import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";
import ReCAPTCHA from "react-google-recaptcha";

// Clave de sitio de prueba para reCAPTCHA
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Clave de prueba de Google

// Estilos CSS para el centrado del CAPTCHA
const captchaStyles = `
  .recaptcha-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 16px 0 24px 0;
  }
  .recaptcha-container > div {
    margin: 0 auto;
  }
  .recaptcha-container iframe {
    margin: 0 auto;
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { appState, loginWithCredentials, addNotification } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (appState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [appState.isAuthenticated, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setCaptchaVerified(true);
      setCaptchaError("");
    } else {
      setCaptchaVerified(false);
      setCaptchaError("Por favor, verifica que no eres un robot");
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError("El correo electrónico es requerido");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("El formato del correo electrónico es inválido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    }

    if (!captchaVerified) {
      setCaptchaError("Por favor, verifica que no eres un robot");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await loginWithCredentials(email, password);
      if (result.success) {
        // Mostrar notificación de éxito
        setSuccessMessage(`¡Bienvenido ${result.user?.nombre}!`);
        setShowSuccessSnackbar(true);

        // Agregar notificación al sistema
        addNotification({
          title: "Inicio de sesión exitoso",
          message: `Has iniciado sesión como ${result.user?.rol}`,
          time: new Date().toLocaleTimeString(),
          read: false,
        });

        // Breve retraso antes de redireccionar
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setErrorMessage(result.error || "Error al iniciar sesión");
        setShowErrorSnackbar(true);
        setPasswordError("Credenciales incorrectas");
        // Resetear el reCAPTCHA
        recaptchaRef.current?.reset();
        setCaptchaVerified(false);
      }
    } catch (error: unknown) {
      console.error("Error de conexión:", error);
      setErrorMessage("Error al conectar con el servidor");
      setShowErrorSnackbar(true);
      // Resetear el reCAPTCHA
      recaptchaRef.current?.reset();
      setCaptchaVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorSnackbar = () => {
    setShowErrorSnackbar(false);
  };

  const handleCloseSuccessSnackbar = () => {
    setShowSuccessSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {/* Agregar estilos CSS globales */}
      <style>{captchaStyles}</style>

      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <img
            src="/src/assets/logo-NMP.jpg"
            alt="Nacional Monte de Piedad"
            style={{ height: "60px", marginBottom: "16px" }}
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "#4A4A4A",
              mb: 1,
            }}
          >
            Iniciar Sesión
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#A0A0A0",
              mt: 0.5,
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            Ingresa tus credenciales para acceder a la plataforma
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                "&.Mui-focused fieldset": {
                  borderColor: "#FF3D64",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#FF3D64",
              },
            }}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                "&.Mui-focused fieldset": {
                  borderColor: "#FF3D64",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#FF3D64",
              },
            }}
            disabled={loading}
          />

          {/* reCAPTCHA con clase CSS personalizada */}
          <div className="recaptcha-container">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              theme="light"
            />
          </div>
          {captchaError && (
            <Typography
              color="error"
              variant="body2"
              sx={{
                textAlign: "center",
                mb: 2,
              }}
            >
              {captchaError}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: "#FF3D64",
              "&:hover": {
                backgroundColor: "#E0355A",
              },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "4px",
              boxShadow: "none",
            }}
          >
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              color: "#6c757d",
            }}
          >
            <Typography variant="body2">
              ¿Olvidaste tu contraseña?{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: "#FF3D64",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Recuperar
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Nacional Monte de Piedad
        </Typography>
      </Box>

      {/* Notificación de error */}
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Notificación de éxito */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
