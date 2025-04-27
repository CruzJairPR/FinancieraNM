const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const apiRoutes = require("./routes/api");
const curadores = require("./data/curadores");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Rutas API
app.use("/api", apiRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de Curadores backend funcionando correctamente" });
});

// Rutas básicas
app.get("/api/asignaciones", (req, res) => {
  res.json([
    {
      id: 1,
      fecha: "2024-03-15",
      nombre: "Campaña Navidad 2024",
      descripcion: "Selección de piezas para campaña navideña 2024",
      presupuesto: "100000",
      margen: "15",
      categorias: [
        {
          name: "joyeria_anillos",
          cantidad: "5",
          rangoMinimo: "5000",
          rangoMaximo: "15000",
        },
      ],
      estado: "sin_asignar",
    },
  ]);
});

// Ruta para curadores
app.get("/api/curadores", (req, res) => {
  res.json(curadores);
});

app.get("/api/inventario", (req, res) => {
  res.json([
    {
      id: "INV001",
      sku: "235657",
      name: "Prendedor flores",
      category: "Alhajas",
      subCategory: "Prendedores",
      assignment: "Sin asignar",
      material: "Oro 18k",
      condition: "Buena",
      daysLeft: 31,
      dateInfo: "Sep 20",
      basePrice: 48906,
      salePrice: 49637,
      finalPrice: 49637,
      margin: "11%",
      images: ["https://i.imgur.com/DvpvklR.png"],
      forChristmas: true,
    },
  ]);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
