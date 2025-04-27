// src/pages/Dashboard.tsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Container,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssignmentTabs from "../components/AssignmentTabs";
import TabPanel from "../components/TabPanel";
import EmptyStateCard from "../components/EmptyStateCard";
import EmptyTabContent from "../components/EmptyTabContent";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import { H5 } from "../components/Typography";
import { useAsignacion } from "../context/AsignacionContext";
import { useDashboardHelpers } from "../hooks/useDashboardHelpers";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const { asignaciones, resetFormData, loading, error } = useAsignacion();
  const { formatDate } = useDashboardHelpers();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCreateAssignment = () => {
    // Limpiar datos del formulario antes de navegar
    resetFormData();

    // Asegurarse de que no hay ID de edición
    sessionStorage.removeItem("editingAsignacionId");

    // Navegar a la página de creación
    navigate("/crear-asignacion");
  };

  // Filtrar asignaciones por estado para cada pestaña
  const filteredAsignaciones = useMemo(() => {
    const todasAsignaciones = asignaciones;
    const sinAsignarAsignaciones = asignaciones.filter(
      (a) => a.estado === "sin_asignar"
    );
    const enProgresoAsignaciones = asignaciones.filter(
      (a) => a.estado === "en_progreso"
    );
    const completadasAsignaciones = asignaciones.filter(
      (a) => a.estado === "completada"
    );
    const canceladasAsignaciones = asignaciones.filter(
      (a) => a.estado === "cancelada"
    );

    return {
      todasAsignaciones,
      sinAsignarAsignaciones,
      enProgresoAsignaciones,
      completadasAsignaciones,
      canceladasAsignaciones,
    };
  }, [asignaciones]);

  // Datos para las pestañas con conteo
  const tabsData = useMemo(
    () => [
      { label: "Todas", count: filteredAsignaciones.todasAsignaciones.length },
      {
        label: "Sin asignar",
        count: filteredAsignaciones.sinAsignarAsignaciones.length,
      },
      {
        label: "En progreso",
        count: filteredAsignaciones.enProgresoAsignaciones.length,
      },
      {
        label: "Completadas",
        count: filteredAsignaciones.completadasAsignaciones.length,
      },
      {
        label: "Canceladas",
        count: filteredAsignaciones.canceladasAsignaciones.length,
      },
    ],
    [filteredAsignaciones]
  );

  // Renderizar tarjetas de asignación
  const renderAsignacionCards = (asignacionesList: typeof asignaciones) => {
    if (asignacionesList.length === 0) {
      return (
        <EmptyStateCard
          title="Comienza a crear asignaciones"
          description="Aún no has creado ninguna asignación para tus curadores. Genera una para que puedan iniciar a buscar las piezas que necesitas para tus campañas"
          buttonText="Crear la primer asignación"
          onButtonClick={handleCreateAssignment}
        />
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 3 },
          justifyContent: { xs: "center", sm: "flex-start" },
          width: "100%",
        }}
      >
        {asignacionesList.map((asignacion) => (
          <Box
            sx={{
              width: "360px",
              marginBottom: 3,
              marginRight: 2,
            }}
            key={asignacion.id}
          >
            <TaskCard
              id={asignacion.id}
              titulo={asignacion.nombre}
              descripcion={asignacion.descripcion}
              usuario="Usuario"
              fecha={formatDate(asignacion.fecha)}
              numPartidas={asignacion.categorias.length}
              categorias={asignacion.categorias.map((c) => {
                const [type, category] = c.name.split("_");
                return `${type.charAt(0).toUpperCase() + type.slice(1)}${
                  category ? ` - ${category}` : ""
                }`;
              })}
              estado={
                asignacion.estado === "sin_asignar" ? "Nueva" : "Asignada"
              }
            />
          </Box>
        ))}
      </Box>
    );
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", pb: 4 }}>
      <Container maxWidth={false} disableGutters>
        <Grid container spacing={2} sx={{ bgcolor: "white" }}>
          {/* Navbar */}
          <Grid sx={{ width: "100%" }}>
            <Navbar />
          </Grid>

          {/* Título y botón de crear asignación (condicional) */}
          <Grid sx={{ width: "100%", bgcolor: "white" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: { xs: 2, sm: 4 },
                mt: "20px",
                mb: 3,
              }}
            >
              <H5 sx={{ color: "#131414" }}>Asignaciones</H5>

              {/* Mostrar botón solo si existen asignaciones */}
              {asignaciones.length > 0 && (
                <Button
                  variant="contained"
                  onClick={handleCreateAssignment}
                  sx={{
                    backgroundColor: "#C74B5B",
                    color: "white",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#a43a48",
                    },
                  }}
                >
                  Crear asignación
                </Button>
              )}
            </Box>
          </Grid>

          {/* Tabs y Contenido */}
          <Grid sx={{ width: "100%", bgcolor: "white" }}>
            <AssignmentTabs
              tabs={tabsData}
              currentTab={currentTab}
              onTabChange={handleTabChange}
            />

            <Box sx={{ mt: 3, px: { xs: 2, sm: 4 } }}>
              <TabPanel value={currentTab} index={0}>
                {renderAsignacionCards(filteredAsignaciones.todasAsignaciones)}
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                {renderAsignacionCards(
                  filteredAsignaciones.sinAsignarAsignaciones
                )}
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                {filteredAsignaciones.enProgresoAsignaciones.length === 0 ? (
                  <EmptyTabContent message="No hay asignaciones en progreso" />
                ) : (
                  renderAsignacionCards(
                    filteredAsignaciones.enProgresoAsignaciones
                  )
                )}
              </TabPanel>

              <TabPanel value={currentTab} index={3}>
                {filteredAsignaciones.completadasAsignaciones.length === 0 ? (
                  <EmptyTabContent message="No hay asignaciones completadas" />
                ) : (
                  renderAsignacionCards(
                    filteredAsignaciones.completadasAsignaciones
                  )
                )}
              </TabPanel>

              <TabPanel value={currentTab} index={4}>
                {filteredAsignaciones.canceladasAsignaciones.length === 0 ? (
                  <EmptyTabContent message="No hay asignaciones canceladas" />
                ) : (
                  renderAsignacionCards(
                    filteredAsignaciones.canceladasAsignaciones
                  )
                )}
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
