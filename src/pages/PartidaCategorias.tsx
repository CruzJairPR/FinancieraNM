import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  TextField,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import StepsSidebar from "../components/StepsSidebar";
import Navbar from "../components/Navbar";
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
  curadorAsignado?: string | null;
}

const PartidasCategorias: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategories, setSelectedCategories } = useAsignacion();
  const [localCategories, setLocalCategories] = useState(selectedCategories);
  const [isFormValid, setIsFormValid] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const isEditMode = sessionStorage.getItem("editingAsignacionId") !== null;

  useEffect(() => {
    // Validar si todos los campos requeridos tienen valor
    validateForm();
  }, [localCategories]);

  const validateForm = () => {
    const allFieldsFilled = localCategories.every(
      (category) =>
        category.cantidad.trim() !== "" &&
        category.rangoMinimo.trim() !== "" &&
        category.rangoMaximo.trim() !== ""
    );
    setIsFormValid(allFieldsFilled);
  };

  const handleInputChange = (
    categoryIndex: number,
    field: string,
    value: string
  ) => {
    const updatedCategories = [...localCategories];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      [field]: value,
    };
    setLocalCategories(updatedCategories);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleContinue = () => {
    // Actualizar las categorías en el contexto
    setSelectedCategories(localCategories);

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
              categorias: localCategories,
            };
          }
          return asignacion;
        });

        localStorage.setItem(
          "asignaciones",
          JSON.stringify(updatedAsignaciones)
        );

        // Mostrar notificación
        setSnackbarMessage("Categorías actualizadas correctamente");
        setOpenSnackbar(true);

        // Navegar de regreso al dashboard después de un breve retraso
        setTimeout(() => {
          sessionStorage.removeItem("editingAsignacionId");
          navigate("/dashboard");
        }, 1500);
      }
    } else {
      navigate("/asignar-curador");
    }
  };

  const formatCategoryName = (name: string) => {
    const [type, category] = name.split("_");
    return `${type.charAt(0).toUpperCase() + type.slice(1)}${
      category ? ` - ${category}` : ""
    }`;
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
            currentStep={2}
            steps={[
              { number: 1, title: "Información básica", status: "completed" },
              { number: 2, title: "Partidas a buscar", status: "completed" },
              { number: 3, title: "Asignar curador(es)", status: "active" },
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
              mb: 1,
            }}
          >
            {isEditMode
              ? "Editar detalles de categorías"
              : "Categorías seleccionadas"}
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: "#586065" }}>
            {isEditMode
              ? "Ingresa los detalles para cada categoría seleccionada."
              : "Ingresa los detalles para cada categoría seleccionada."}
          </Typography>

          <Grid container spacing={2}>
            {localCategories.map((category, index) => (
              <Grid size={12} key={index} sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, fontSize: "18px", mb: 1 }}
                >
                  {formatCategoryName(category.name)}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Cantidad"
                      value={category.cantidad}
                      onChange={(e) =>
                        handleInputChange(index, "cantidad", e.target.value)
                      }
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Rango mínimo"
                      value={category.rangoMinimo}
                      onChange={(e) =>
                        handleInputChange(index, "rangoMinimo", e.target.value)
                      }
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <span style={{ color: "#586065" }}>$</span>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Rango máximo"
                      value={category.rangoMaximo}
                      onChange={(e) =>
                        handleInputChange(index, "rangoMaximo", e.target.value)
                      }
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <span style={{ color: "#586065" }}>$</span>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                {index < localCategories.length - 1 && (
                  <Divider sx={{ my: 3 }} />
                )}
              </Grid>
            ))}
          </Grid>

          <Grid container sx={{ mt: 4 }}>
            <Button
              style={{
                width: "200px",
                borderRadius: "8px",
              }}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleContinue}
              disabled={!isFormValid}
              sx={{
                bgcolor: "#A82A3B",
                "&:hover": { bgcolor: "#a51a30" },
                textTransform: "none",
                fontWeight: 500,
                px: 4,
                py: 1.5,
                "&.Mui-disabled": {
                  bgcolor: "#D8DCDE",
                  color: "#586065",
                },
              }}
            >
              {isEditMode ? "Guardar cambios" : "Continuar"}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default PartidasCategorias;
