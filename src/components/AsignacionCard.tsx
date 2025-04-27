import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
  Tooltip,
  CardContent,
  Divider,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";
import { useAsignacion } from "../context/AsignacionContext";

interface AsignacionCardProps {
  id: number;
  titulo: string;
  descripcion: string;
  usuario: string;
  fecha: string;
  numPartidas: number;
  categorias: string[];
  estado: "Nueva" | "Asignada";
  onCardClick?: () => void;
}

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

const AsignacionCard: React.FC<AsignacionCardProps> = ({
  id,
  titulo,
  descripcion,
  usuario,
  fecha,
  numPartidas,
  categorias,
  estado,
  onCardClick,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showAllChips, setShowAllChips] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const chipContainerRef = useRef<HTMLDivElement>(null);

  const open = Boolean(menuAnchorEl);
  const navigate = useNavigate();
  const { setFormData, setSelectedCategories, setSelectedCheckboxes } =
    useAsignacion();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
  };

  // Función para cargar los datos de la asignación desde localStorage
  const loadAsignacionData = (): Asignacion | undefined => {
    const asignaciones = JSON.parse(
      localStorage.getItem("asignaciones") || "[]"
    ) as Asignacion[];
    return asignaciones.find((asignacion) => asignacion.id === id);
  };

  const handleEditBasic = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // Cargar datos de la asignación
    const asignacion = loadAsignacionData();
    if (asignacion) {
      // Guardar los datos en el contexto
      setFormData({
        nombre: asignacion.nombre || "",
        fecha: asignacion.fecha || "",
        descripcion: asignacion.descripcion || "",
        presupuesto: asignacion.presupuesto || "",
        margen: asignacion.margen || "",
      });

      // Guardar el ID para edición en sessionStorage
      sessionStorage.setItem("editingAsignacionId", id.toString());

      // Navegar a la página de información básica
      navigate("/crear-asignacion");
    }

    setMenuAnchorEl(null);
  };

  const handleEditPartidas = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // Cargar datos de la asignación
    const asignacion = loadAsignacionData();
    if (asignacion) {
      // Preparar objeto de checkboxes seleccionados
      const checkboxes: { [key: string]: boolean } = {};

      // Convertir categorías a checkboxes seleccionados
      asignacion.categorias.forEach((categoria) => {
        checkboxes[categoria.name] = true;
      });

      // Guardar en el contexto
      setSelectedCheckboxes(checkboxes);
      setSelectedCategories(asignacion.categorias);
      setFormData({
        nombre: asignacion.nombre || "",
        fecha: asignacion.fecha || "",
        descripcion: asignacion.descripcion || "",
        presupuesto: asignacion.presupuesto || "",
        margen: asignacion.margen || "",
      });

      // Guardar el ID para edición en sessionStorage
      sessionStorage.setItem("editingAsignacionId", id.toString());

      // Navegar a la página de partidas
      navigate("/partidas-buscar");
    }

    setMenuAnchorEl(null);
  };

  const handleEditCuradores = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // Cargar datos de la asignación
    const asignacion = loadAsignacionData();
    if (asignacion) {
      // Guardar los datos en el contexto
      setFormData({
        nombre: asignacion.nombre || "",
        fecha: asignacion.fecha || "",
        descripcion: asignacion.descripcion || "",
        presupuesto: asignacion.presupuesto || "",
        margen: asignacion.margen || "",
      });

      setSelectedCategories(asignacion.categorias);

      // Guardar el ID para edición en sessionStorage
      sessionStorage.setItem("editingAsignacionId", id.toString());

      // Navegar a la página de asignar curador
      navigate("/asignar-curador");
    }

    setMenuAnchorEl(null);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
    // Mostrar diálogo de confirmación
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // Obtener las asignaciones existentes
    const asignaciones = JSON.parse(
      localStorage.getItem("asignaciones") || "[]"
    ) as Asignacion[];

    // Filtrar para eliminar la asignación actual
    const updatedAsignaciones = asignaciones.filter(
      (asignacion) => asignacion.id !== id
    );

    // Guardar las asignaciones actualizadas
    localStorage.setItem("asignaciones", JSON.stringify(updatedAsignaciones));

    // Cerrar el diálogo
    setDeleteDialogOpen(false);

    // Mostrar notificación de éxito
    setNotificationOpen(true);

    // Recargar la página para reflejar los cambios después de un pequeño delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationOpen(false);
  };

  // Calculate assignment progress based on current state
  const calculateProgress = () => {
    // Get the assignment from localStorage to check its current state
    const asignacion = loadAsignacionData();
    if (!asignacion) return 30; // Default progress if not found

    // Progress logic - this is a simplified example
    // You can adjust this based on your actual workflow steps
    if (asignacion.curadorAsignado) return 100; // Completed
    if (asignacion.categorias.length > 0) return 60; // Has categories
    if (asignacion.nombre && asignacion.descripcion) return 30; // Has basic info

    return 10; // Just started
  };

  // Check if chips container has overflow
  useEffect(() => {
    const checkOverflow = () => {
      const container = chipContainerRef.current;
      if (container) {
        setHasOverflow(container.scrollWidth > container.clientWidth);
      }
    };

    checkOverflow();
    // Add resize listener to recheck on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [categorias]);

  // Determinar cuántas categorías mostrar y si mostrar el "+N"
  const visibleCategories = showAllChips ? categorias : categorias.slice(0, 3);
  const hiddenCategoriesCount = categorias.length - visibleCategories.length;

  return (
    <>
      <Card
        sx={{
          width: "370px",
          height: "350px",
          mr: 1,
          borderRadius: 2,
          cursor: "pointer",
        }}
        onClick={onCardClick}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header with title and action buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              component="div"
              fontWeight="bold"
              sx={{ fontSize: "15px" }}
            >
              {titulo}
            </Typography>
            <Box>
              <Chip
                label="Asignada"
                size="small"
                sx={{
                  mr: 1,
                  bgcolor: "#9CDBEFFF",
                  color: "#115A73",
                  fontWeight: "500",
                  borderRadius: "4px",
                  height: "30px",
                  width: "69px",
                }}
              />
              <Chip
                label={estado}
                size="small"
                sx={{
                  mr: 1,
                  bgcolor:
                    estado === "Nueva"
                      ? "rgba(75, 210, 143, 0.1)"
                      : "rgba(0, 123, 167, 0.1)",
                  color: estado === "Nueva" ? "#4BD28F" : "#0288d1",
                  fontWeight: "medium",
                }}
              />
              <IconButton size="small" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{
              fontSize: "12px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.5,
            }}
          >
            {descripcion}
          </Typography>

          {/* Progress bar */}
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{
              mb: 2,
              height: 8,
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#c62828",
              },
            }}
          />

          {/* Person section */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PersonOutlineIcon sx={{ color: "#C74B5B", mr: 1 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                component="span"
                color="primary"
                fontWeight="medium"
              >
                {usuario}
              </Typography>
              <IconButton size="small">
                <ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />
              </IconButton>
            </Box>
          </Box>

          {/* Date and amount */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AccessTimeOutlinedIcon sx={{ color: "#C74B5B", mr: 1 }} />
            <Typography
              variant="body2"
              component="span"
              color="text.secondary"
              sx={{ mr: 2 }}
            >
              {fecha}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Typography variant="body2" component="span" fontWeight="bold">
              {numPartidas} partidas
            </Typography>
          </Box>

          {/* Categories */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <DiamondOutlinedIcon
              sx={{ color: "#C74B5B", mr: 1, mt: 0.5, flexShrink: 0 }}
            />
            <Box
              ref={chipContainerRef}
              sx={{
                display: "flex",
                flexWrap: showAllChips ? "wrap" : "nowrap",
                gap: 0.5,
                flex: 1,
                position: "relative",
                pr: hasOverflow || categorias.length > 3 ? 4 : 0,
              }}
            >
              {visibleCategories.map((categoria, index) => (
                <Tooltip
                  key={index}
                  title={`Buscamos partidas de ${categoria}`}
                  arrow
                >
                  <Chip
                    label={categoria}
                    size="small"
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: "text.secondary",
                      mb: showAllChips ? 0.5 : 0,
                    }}
                  />
                </Tooltip>
              ))}

              {!showAllChips && hiddenCategoriesCount > 0 && (
                <Chip
                  label={`+${hiddenCategoriesCount}`}
                  size="small"
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "text.secondary",
                  }}
                />
              )}
            </Box>

            {/* Show "more" icon only if there's overflow or more chips */}
            {(hasOverflow || categorias.length > 3) && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllChips(!showAllChips);
                }}
                sx={{
                  position: "absolute",
                  right: 16,
                  bottom: showAllChips ? "auto" : 75,
                  color: "#C74B5B",
                  backgroundColor: "rgba(199, 75, 91, 0.05)",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  padding: 0,
                  transform: showAllChips ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Menu for options */}
      <Menu
        anchorEl={menuAnchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              minWidth: "200px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              mt: 0.5,
              borderRadius: 1,
            },
          },
        }}
      >
        <MenuItem onClick={handleEditBasic} sx={{ py: 1.5 }}>
          <ListItemText primary="Editar datos básicos" />
        </MenuItem>
        <MenuItem onClick={handleEditPartidas} sx={{ py: 1.5 }}>
          <ListItemText primary="Editar tipos de partidas" />
        </MenuItem>
        <MenuItem onClick={handleEditCuradores} sx={{ py: 1.5 }}>
          <ListItemText primary="Editar curadores asignados" />
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{
            py: 1.5,
            bgcolor: "rgba(196, 30, 58, 0.08)",
            color: "#C41E3A",
            "&:hover": {
              bgcolor: "rgba(196, 30, 58, 0.12)",
            },
          }}
        >
          <ListItemText primary="Eliminar asignación" />
        </MenuItem>
      </Menu>

      {/* Modal de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
            maxWidth: "400px",
            width: "90%",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            pt: 3,
            color: "#C41E3A",
          }}
        >
          <WarningIcon fontSize="large" />
        </Box>
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            fontWeight: 500,
            pb: 0,
          }}
        >
          ¿Estas seguro que deseas eliminar?
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              textAlign: "center",
              px: 2,
              color: "#586065",
              fontSize: "0.95rem",
            }}
          >
            Al eliminar la asignación, todas las partidas pre-seleccionadas se
            mandan a la lista de "Guardadas para después" y se pierde el
            progreso
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              border: "1px solid #C41E3A",
              color: "#C41E3A",
              borderRadius: 1,
              py: 1.2,
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
              "&:hover": {
                backgroundColor: "rgba(196, 30, 58, 0.04)",
              },
            }}
          >
            Conservar asignación
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: "#C41E3A",
              color: "white",
              borderRadius: 1,
              py: 1.2,
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
              "&:hover": {
                backgroundColor: "#a51c33",
              },
            }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificación de éxito */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          sx={{ width: "100%" }}
        >
          La asignación "{titulo}" ha sido eliminada exitosamente
        </Alert>
      </Snackbar>
    </>
  );
};

export default AsignacionCard;
