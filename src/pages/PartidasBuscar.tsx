import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Checkbox,
  TextField,
  Divider,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import StepsSidebar from "../components/StepsSidebar";
import Navbar from "../components/Navbar";
import { Watch, DiamondOutlined, LaptopMacOutlined } from "@mui/icons-material";
import { useAsignacion } from "../context/AsignacionContext";

interface CategoryData {
  cantidad: string;
  rangoMinimo: string;
  rangoMaximo: string;
}

const PartidasBuscar: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedCheckboxes,
    setSelectedCheckboxes,
    selectedCategories,
    setSelectedCategories,
  } = useAsignacion();
  const isEditMode = sessionStorage.getItem("editingAsignacionId") !== null;

  const [categoryData, setCategoryData] = useState<{
    [key: string]: CategoryData;
  }>({});

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Cargar datos existentes para modo de edición
  useEffect(() => {
    if (isEditMode && selectedCategories.length > 0) {
      // Inicializar categoryData con los valores existentes de las categorías
      const initialCategoryData: { [key: string]: CategoryData } = {};

      selectedCategories.forEach((category) => {
        initialCategoryData[category.name] = {
          cantidad: category.cantidad,
          rangoMinimo: category.rangoMinimo,
          rangoMaximo: category.rangoMaximo,
        };
      });

      setCategoryData(initialCategoryData);
    }
  }, [isEditMode, selectedCategories]);

  const handleCheckboxChange =
    (category: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedCheckboxes({
        ...selectedCheckboxes,
        [category]: event.target.checked,
      });

      if (event.target.checked && !categoryData[category]) {
        // Buscar si ya existe esta categoría en selectedCategories
        const existingCategory = selectedCategories.find(
          (cat) => cat.name === category
        );

        if (existingCategory) {
          // Si existe, usar sus valores
          setCategoryData({
            ...categoryData,
            [category]: {
              cantidad: existingCategory.cantidad,
              rangoMinimo: existingCategory.rangoMinimo,
              rangoMaximo: existingCategory.rangoMaximo,
            },
          });
        } else {
          // Si no existe, inicializar con valores vacíos
          setCategoryData({
            ...categoryData,
            [category]: {
              cantidad: "",
              rangoMinimo: "",
              rangoMaximo: "",
            },
          });
        }
      }
    };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleContinue = () => {
    // Convertir los datos seleccionados al formato requerido
    const categories = Object.entries(selectedCheckboxes)
      .filter(([category]) => selectedCheckboxes[category])
      .map(([category]) => {
        // Buscar primero en los datos del formulario
        if (categoryData[category]) {
          return {
            name: category,
            cantidad: categoryData[category].cantidad || "0",
            rangoMinimo: categoryData[category].rangoMinimo || "0",
            rangoMaximo: categoryData[category].rangoMaximo || "0",
          };
        }

        // Si no está en los datos del formulario, buscar en selectedCategories existente
        const existingCategory = selectedCategories.find(
          (cat) => cat.name === category
        );
        if (existingCategory) {
          return existingCategory;
        }

        // Si no existe en ningún lado, usar valores por defecto
        return {
          name: category,
          cantidad: "0",
          rangoMinimo: "0",
          rangoMaximo: "0",
        };
      });

    // Guardar en el contexto
    setSelectedCategories(categories);

    // Mostrar notificación
    setSnackbarMessage("Categorías seleccionadas correctamente");
    setOpenSnackbar(true);

    // Navegar a la pantalla de categorías para completar los valores
    navigate("/partidas-categorias");
  };

  const isFormValid = () => {
    const selectedCategories = Object.entries(selectedCheckboxes).filter(
      ([category]) => selectedCheckboxes[category]
    );
    return selectedCategories.length > 0;
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

      <Grid container>
        <Grid size={{ xs: 12, md: 3, lg: 2 }}>
          <StepsSidebar
            currentStep={2}
            steps={[
              { number: 1, title: "Información básica", status: "completed" },
              { number: 2, title: "Partidas a buscar", status: "active" },
              { number: 3, title: "Asignar curador(es)", status: "pending" },
            ]}
            formCompleted={isFormValid()}
          />
        </Grid>

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
            {isEditMode ? "Editar tipos de partidas" : "2. Partidas a buscar"}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: "#586065" }}>
            {isEditMode
              ? "Modifica las categorías por Ramo seleccionadas."
              : "Indica las categorias por Ramo a seleccionar."}
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

          {/* Sección de Relojes */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Watch sx={{ color: "#C74B5B" }} />
              Relojes
            </Typography>
            <Grid>
              <div style={{ display: "flex", flexDirection: "row", gap: 30 }}>
                {["Oro", "De Marca", "Unisex", "Mujer", "Hombre"].map(
                  (category) => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={
                            selectedCheckboxes[`reloj_${category}`] || false
                          }
                          onChange={handleCheckboxChange(`reloj_${category}`)}
                          sx={{
                            color: "#C74B5B",
                            "&.Mui-checked": { color: "#C74B5B" },
                          }}
                        />
                      }
                      label={category}
                      sx={{ whiteSpace: "nowrap" }}
                    />
                  )
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-start" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Agrega comentarios (opcional)"
            />
          </Grid>
          <Grid container justifyContent="flex-start" sx={{ mt: 3 }}>
            <Divider sx={{ mt: 2, mb: 2, width: "100%" }} />
          </Grid>
          {/* Sección de Alhajas */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <DiamondOutlined sx={{ color: "#C74B5B" }} />
              Alhajas
            </Typography>
            <Grid>
              <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
                {[
                  "Collares",
                  "Pulseras",
                  "Esclabas",
                  "Aretes",
                  "Dijes",
                  "Juegos",
                ].map((category) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={
                          selectedCheckboxes[`alhaja_${category}`] || false
                        }
                        onChange={handleCheckboxChange(`alhaja_${category}`)}
                        sx={{
                          color: "#C74B5B",
                          "&.Mui-checked": { color: "#C74B5B" },
                        }}
                      />
                    }
                    label={category}
                    sx={{ whiteSpace: "nowrap" }}
                  />
                ))}
              </div>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-start" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Agrega comentarios (opcional)"
            />
          </Grid>
          <Grid container justifyContent="flex-start" sx={{ mt: 3 }}>
            <Divider sx={{ mt: 1, mb: 2, width: "100%" }} />
          </Grid>

          {/* Sección de Varios */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LaptopMacOutlined sx={{ color: "#C74B5B" }} />
              Varios
            </Typography>
            <Grid>
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {[
                  "Celulares",
                  "Inmuebles",
                  "Laptops",
                  "Linea blanca",
                  "Otro",
                  "Bicicletas",
                ].map((category) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={
                          selectedCheckboxes[`varios_${category}`] || false
                        }
                        onChange={handleCheckboxChange(`varios_${category}`)}
                        sx={{
                          color: "#C74B5B",
                          "&.Mui-checked": { color: "#C74B5B" },
                        }}
                      />
                    }
                    label={category}
                    sx={{ whiteSpace: "nowrap" }}
                  />
                ))}
              </div>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-start" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Agrega comentarios (opcional)"
            />
          </Grid>
          <Grid container justifyContent="flex-start" sx={{ mt: 4 }}>
            <Button
              style={{
                width: "200px",
                borderRadius: "8px",
              }}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleContinue}
              disabled={!isFormValid()}
              sx={{
                bgcolor: "#A82A3B",
                "&:hover": { bgcolor: "#a51a30" },
                textTransform: "none",
                fontWeight: 500,
                px: 4,
                py: 1.5,
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

export default PartidasBuscar;
