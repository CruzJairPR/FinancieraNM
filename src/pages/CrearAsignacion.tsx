// src/pages/CrearAsignacion.tsx
import React from "react";
import { Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StepsSidebar from "../components/StepsSidebar";
import Navbar from "../components/Navbar";
import BasicInfoForm from "../components/BasicInfoForm";
import { useAsignacion } from "../context/AsignacionContext";

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
}

const CrearAsignacion: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useAsignacion();
  const isEditMode = sessionStorage.getItem("editingAsignacionId") !== null;

  const handleFormChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isEditMode) {
      // Actualizar datos en localStorage
      const asignacionId = sessionStorage.getItem("editingAsignacionId");
      if (asignacionId) {
        const asignaciones = JSON.parse(
          localStorage.getItem("asignaciones") || "[]"
        ) as Asignacion[];

        const updatedAsignaciones = asignaciones.map((asignacion) => {
          if (asignacion.id === Number(asignacionId)) {
            return {
              ...asignacion,
              nombre: formData.nombre,
              descripcion: formData.descripcion,
              fecha: formData.fecha,
              presupuesto: formData.presupuesto,
              margen: formData.margen,
            };
          }
          return asignacion;
        });

        localStorage.setItem(
          "asignaciones",
          JSON.stringify(updatedAsignaciones)
        );

        // Navegar de regreso al dashboard
        sessionStorage.removeItem("editingAsignacionId");
        navigate("/dashboard");
      }
    } else {
      // Continuar al siguiente paso de creación
      navigate("/partidas-buscar");
    }
  };

  return (
    <Grid
      container
      direction="column"
      sx={{ minHeight: "100vh", bgcolor: "#FFFFFF" }}
    >
      <Grid size={12}>
        <Navbar variant="assignment" />
      </Grid>

      {/* Main Content */}
      <Grid container>
        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 3, lg: 2 }}>
          <StepsSidebar
            currentStep={1}
            steps={[
              { number: 1, title: "Información básica", status: "active" },
              { number: 2, title: "Partidas a buscar", status: "pending" },
              { number: 3, title: "Asignar curador(es)", status: "pending" },
            ]}
          />
        </Grid>

        {/* Form Content */}
        <Grid size={{ xs: 12, md: 9, lg: 10 }} sx={{ p: 4 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 500,
              fontSize: "24px",
              mb: 2,
            }}
          >
            {isEditMode ? "Editar información básica" : "1. Información básica"}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1, color: "#586065" }}>
            {isEditMode
              ? "Modifica los datos básicos de la asignación."
              : "Ingresa los datos básicos de la asignación que deseas crear."}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#C41E3A",
              mb: 4,
              "& span": { color: "#C41E3A" },
            }}
          >
            * Campos requeridos
          </Typography>

          <BasicInfoForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleFormSubmit}
            isEditMode={isEditMode}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CrearAsignacion;
