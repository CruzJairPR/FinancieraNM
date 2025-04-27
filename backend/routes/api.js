const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Clave secreta para JWT
const JWT_SECRET = "clave_secreta_para_jwt_curadores_app";

// Importar los datos
const inventario = require("../data/inventario");
const asignaciones = require("../data/asignaciones");
const usuarios = require("../data/usuarios");
const curadores = require("../data/curadores");

// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
  // Obtener el header de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Acceso denegado. Token no proporcionado." });
  }

  try {
    // El formato del header debe ser "Bearer <token>"
    const token = authHeader.split(" ")[1];
    const usuarioVerificado = jwt.verify(token, JWT_SECRET);
    req.usuario = usuarioVerificado;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// Rutas para inventario
router.get("/inventario", verificarToken, (req, res) => {
  res.json(inventario);
});

// Rutas para asignaciones
router.get("/asignaciones", verificarToken, (req, res) => {
  res.json(asignaciones);
});

// Rutas para curadores
router.get("/curadores", verificarToken, (req, res) => {
  res.json(curadores);
});

// Rutas para autenticación
router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const usuario = usuarios.find(
    (user) => user.email === email && user.password === password
  );

  if (usuario) {
    // Crear token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // El token expira en 1 hora
    );

    // Omitimos el password en la respuesta
    const { password, ...userWithoutPassword } = usuario;
    res.json({
      user: userWithoutPassword,
      token: token,
    });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});

router.get("/usuarios", verificarToken, (req, res) => {
  // Verificar si el usuario es administrador
  if (req.usuario.rol !== "admin") {
    return res
      .status(403)
      .json({ error: "No tienes permisos para acceder a esta información" });
  }

  // Omitimos los passwords en la respuesta
  const usersWithoutPasswords = usuarios.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

module.exports = router;
