// src/pages/AsignarCurador.tsx
import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import StepsSidebar from "../components/StepsSidebar";
import Navbar from "../components/Navbar";
import { H5, Body1 } from "../components/Typography";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import { useAsignacion } from "../context/AsignacionContext";
import { FAKE_CURADORES, Curador } from "../data/fakeCuradores";

interface Asignacion {
  id: number;
  nombre?: string;
  descripcion?: string;
  fecha: string;
  presupuesto?: string;
  margen?: string;
  categorias: Array<{
    name: string;
    cantidad: string;
    rangoMinimo: string;
    rangoMaximo: string;
  }>;
  estado: string;
  curadorAsignado?: string | null;
}

const AsignarCurador: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategories, formData } = useAsignacion();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedCurador, setSelectedCurador] = useState<Curador | null>(null);
  const isEditMode = sessionStorage.getItem("editingAsignacionId") !== null;
  const [curadores] = useState<Curador[]>(FAKE_CURADORES);

  // Load current assignment if in edit mode
  useEffect(() => {
    const asignacionId = sessionStorage.getItem("editingAsignacionId");
    if (asignacionId) {
      const asignaciones = JSON.parse(
        localStorage.getItem("asignaciones") || "[]"
      ) as Asignacion[];

      const found = asignaciones.find(
        (asignacion) => asignacion.id === Number(asignacionId)
      );

      if (
        found &&
        found.curadorAsignado &&
        found.curadorAsignado !== "Pendiente de asignar"
      ) {
        const curator = curadores.find(
          (c) => c.nombre === found.curadorAsignado
        );
        if (curator) {
          setSelectedCurador(curator);
        }
      }
    }
  }, [curadores]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Handle curator selection
  const handleSelectCurador = (curador: Curador) => {
    if (!curador.disponible) return; // Can't select unavailable curators

    // Toggle selection if already selected
    if (selectedCurador && selectedCurador.id === curador.id) {
      setSelectedCurador(null);
    } else {
      setSelectedCurador(curador);
    }
  };

  // Función para crear la asignación y guardarla en localStorage
  const createOrUpdateAsignacion = (withCurator: boolean = false) => {
    // Si estamos en modo edición
    if (isEditMode) {
      const asignacionId = sessionStorage.getItem("editingAsignacionId");
      if (asignacionId) {
        const asignaciones = JSON.parse(
          localStorage.getItem("asignaciones") || "[]"
        ) as Asignacion[];

        const updatedAsignaciones = asignaciones.map((asignacion) => {
          if (asignacion.id === Number(asignacionId)) {
            return {
              ...asignacion,
              estado:
                withCurator && selectedCurador ? "en_progreso" : "sin_asignar",
              curadorAsignado:
                withCurator && selectedCurador ? selectedCurador.nombre : null,
            };
          }
          return asignacion;
        });

        localStorage.setItem(
          "asignaciones",
          JSON.stringify(updatedAsignaciones)
        );

        // Mostrar notificación
        setSnackbarMessage("Asignación actualizada exitosamente");
        setOpenSnackbar(true);

        // Navegar de regreso al dashboard después de un breve retraso
        setTimeout(() => {
          sessionStorage.removeItem("editingAsignacionId");
          navigate("/dashboard");
        }, 1500);
      }
    } else {
      // Obtener asignaciones existentes
      const asignaciones = JSON.parse(
        localStorage.getItem("asignaciones") || "[]"
      );

      // Crear nueva asignación con datos completos
      const newAsignacion = {
        id: Date.now(),
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fecha: formData.fecha || new Date().toISOString(),
        presupuesto: formData.presupuesto,
        margen: formData.margen,
        categorias: selectedCategories,
        estado: withCurator && selectedCurador ? "en_progreso" : "sin_asignar",
        curadorAsignado:
          withCurator && selectedCurador ? selectedCurador.nombre : null,
      };

      // Agregar a la lista
      asignaciones.push(newAsignacion);
      localStorage.setItem("asignaciones", JSON.stringify(asignaciones));

      // Mostrar notificación de éxito
      setSnackbarMessage("Asignación creada exitosamente");
      setOpenSnackbar(true);

      // Navegar al dashboard después de un breve retraso
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  const handleAsignarLuego = () => {
    createOrUpdateAsignacion(false);
  };

  const handleFinalizar = () => {
    createOrUpdateAsignacion(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FFFFFF" }}>
      <Navbar variant="assignment" />

      {/* Main Content */}
      <Grid container>
        {/* Sidebar */}
        <Grid item xs={12} md={3} lg={2}>
          <StepsSidebar
            currentStep={3}
            steps={[
              { number: 1, title: "Información básica", status: "completed" },
              { number: 2, title: "Partidas a buscar", status: "completed" },
              { number: 3, title: "Asignar curador(es)", status: "active" },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={9} lg={10} sx={{ p: 4 }}>
          <H5 sx={{ mb: 1 }}>
            {isEditMode ? "Editar curadores asignados" : "3. Asignar curador"}
          </H5>

          <Body1 sx={{ mb: 2, color: "#586065" }}>
            {isEditMode
              ? "Modifica los curadores asignados a esta asignación."
              : "Selecciona a uno o más curadores disponibles"}
          </Body1>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {curadores.map((curador) => (
              <Grid key={curador.id} item xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    cursor: curador.disponible ? "pointer" : "default",
                    opacity: curador.disponible ? 1 : 0.7,
                    width: "190px",
                    height: "180px",
                    margin: "0 auto",
                    border:
                      selectedCurador?.id === curador.id
                        ? "2px solid #C74B5B"
                        : "none",
                    transition: "all 0.2s ease",
                    "&:hover": curador.disponible
                      ? {
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                          transform: "translateY(-2px)",
                        }
                      : {},
                  }}
                  onClick={() => handleSelectCurador(curador)}
                >
                  <CardContent sx={{ p: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: curador.disponible ? "#C74B5B" : "#9E9E9E",
                          mb: 0.5,
                        }}
                      >
                        <PersonOutlineIcon
                          sx={{ color: "white", fontSize: "24px" }}
                        />
                      </Box>
                      <Chip
                        label={
                          curador.disponible ? "Disponible" : "No disponible"
                        }
                        sx={{
                          bgcolor: curador.disponible
                            ? "rgba(75, 210, 143, 0.15)"
                            : "rgba(158, 158, 158, 0.1)",
                          color: curador.disponible ? "#4BD28F" : "#9E9E9E",
                          fontWeight: 500,
                          mb: 0.5,
                          height: "20px",
                          "& .MuiChip-label": {
                            px: 1,
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            mb: 0.5,
                            textAlign: "center",
                          }}
                        >
                          {curador.nombre}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#586065",
                            mb: 0.5,
                          }}
                        >
                          {curador.codigo}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#586065",
                            mb: 0.5,
                          }}
                        >
                          {curador.email}
                        </Typography>
                        <Chip
                          label={`${curador.asignaciones} asignaciones`}
                          sx={{
                            bgcolor: "rgba(0, 0, 0, 0.05)",
                            color: "#586065",
                            height: "20px",
                            "& .MuiChip-label": {
                              px: 1,
                              fontSize: "0.7rem",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <SecondaryButton onClick={handleAsignarLuego}>
              Asignar luego
            </SecondaryButton>
            <PrimaryButton
              onClick={handleFinalizar}
              disabled={!selectedCurador}
            >
              Finalizar
            </PrimaryButton>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AsignarCurador;
