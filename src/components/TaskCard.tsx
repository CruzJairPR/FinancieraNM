import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
  Menu,
  MenuItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  MoreVert,
  PersonOutline,
  AccessTimeOutlined,
  DiamondOutlined,
  Warning,
  ArrowForwardIos,
} from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAsignacion } from "../context/AsignacionContext";

interface TaskCardProps {
  id: number;
  titulo: string;
  descripcion: string;
  usuario: string;
  fecha: string;
  numPartidas: number;
  categorias: string[];
  estado:
    | "Nueva"
    | "Asignada"
    | "sin_asignar"
    | "en_progreso"
    | "completada"
    | "cancelada";
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

function TaskCard({
  id,
  titulo,
  descripcion,
  usuario,
  fecha,
  numPartidas,
  categorias,
  estado,
  onCardClick,
}: TaskCardProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const chipContainerRef = useRef<HTMLDivElement>(null);
  const [showAllChips, setShowAllChips] = useState(false);
  const [hasChipOverflow, setHasChipOverflow] = useState(false);
  const [visibleChips, setVisibleChips] = useState<string[]>([]);
  const [hiddenChips, setHiddenChips] = useState<string[]>([]);

  const open = Boolean(menuAnchorEl);
  const navigate = useNavigate();
  const { setFormData, setSelectedCategories, setSelectedCheckboxes } =
    useAsignacion();

  // Load assignment data to check if it has an assigned curator
  const loadAsignacionData = (): Asignacion | undefined => {
    const asignaciones = JSON.parse(
      localStorage.getItem("asignaciones") || "[]"
    ) as Asignacion[];
    return asignaciones.find((asignacion) => asignacion.id === id);
  };

  const asignacion = loadAsignacionData();
  const curadorAsignado = asignacion?.curadorAsignado || null;

  // Calculate which chips fit in the first row
  useEffect(() => {
    const calculateVisibleChips = () => {
      if (!chipContainerRef.current) return;

      const containerWidth = chipContainerRef.current.offsetWidth;
      const tempDiv = document.createElement("div");
      tempDiv.style.visibility = "hidden";
      tempDiv.style.position = "absolute";
      tempDiv.style.whiteSpace = "nowrap";
      document.body.appendChild(tempDiv);

      let totalWidth = 0;
      let visibleCount = 0;

      for (let i = 0; i < categorias.length; i++) {
        tempDiv.textContent = categorias[i];
        // Add approximate chip padding and margins (adjust as needed)
        const chipWidth = tempDiv.offsetWidth + 70;

        if (totalWidth + chipWidth < containerWidth) {
          totalWidth += chipWidth;
          visibleCount++;
        } else {
          break;
        }
      }

      document.body.removeChild(tempDiv);

      // If there are more chips than what fits in the container, set overflow state
      setHasChipOverflow(visibleCount < categorias.length);
      setVisibleChips(categorias.slice(0, visibleCount));
      setHiddenChips(categorias.slice(visibleCount));
    };

    calculateVisibleChips();
    window.addEventListener("resize", calculateVisibleChips);
    return () => window.removeEventListener("resize", calculateVisibleChips);
  }, [categorias]);

  // Toggle showing all chips
  const toggleChipsDisplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllChips(!showAllChips);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
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

    // Recargar la página para reflejar los cambios después de un pequeño delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
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

  // Get status chip color based on estado
  const getStatusChipStyles = (status: string) => {
    switch (status) {
      case "sin_asignar":
      case "Nueva":
        return {
          bgcolor: "#eaf6f9",
          color: "#115A73",
          label: "Nueva",
        };
      case "en_progreso":
      case "Asignada":
        return {
          bgcolor: "#9CDBEFFF",
          color: "#115A73",
          label: "Asignada",
        };
      case "completada":
        return {
          bgcolor: "rgba(75, 210, 143, 0.15)",
          color: "#2EA065",
          label: "Completada",
        };
      case "cancelada":
        return {
          bgcolor: "rgba(211, 47, 47, 0.15)",
          color: "#C62828",
          label: "Cancelada",
        };
      default:
        return {
          bgcolor: "#eaf6f9",
          color: "#115A73",
          label: "Nueva",
        };
    }
  };

  const statusStyles = getStatusChipStyles(estado);

  // Person section with curator name if assigned
  const renderUserSection = () => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PersonOutline sx={{ mr: 1.5, color: "#C74B5B" }} />
        <Typography
          component="span"
          sx={{
            fontSize: "1rem",
            color: curadorAsignado ? "#0288d1" : "#666",
            fontWeight: "500",
          }}
        >
          {curadorAsignado || usuario || "Sin asignar"}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Card
        sx={{
          width: 360,
          height: !showAllChips ? "auto" : "auto",
          minHeight: 280,
          borderRadius: 3,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "height 0.3s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          },
        }}
        onClick={onCardClick}
      >
        <CardContent
          sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
        >
          {/* Header with title and status chips */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography
              component="div"
              fontWeight="600"
              sx={{
                fontSize: "22px",
                color: "#333",
              }}
            >
              {titulo}
            </Typography>
            <Box>
              <Chip
                label={statusStyles.label}
                sx={{
                  mr: 1,
                  bgcolor: statusStyles.bgcolor,
                  color: statusStyles.color,
                  fontWeight: "500",
                  borderRadius: "20px",
                  height: "30px",
                  width: "auto",
                  minWidth: "69px",
                  paddingX: 1,
                  fontSize: "14px",
                }}
              />
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{
                  color: "#707070",
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              mb: 2.5,
              color: "#666",
              lineHeight: 1.5,
              fontSize: "16pxS",
            }}
          >
            {descripcion}
          </Typography>

          {/* Progress bar */}
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{
              mb: 3,
              height: 8,
              width: "80%",
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  estado === "completada"
                    ? "#4BD28F"
                    : estado === "cancelada"
                    ? "#C62828"
                    : "#c62828",
              },
            }}
          />

          {/* Person section - now dynamic based on curator assignment */}
          {renderUserSection()}

          {/* Date and amount */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <AccessTimeOutlined sx={{ mr: 1.5, color: "#C74B5B" }} />
            <Typography
              component="span"
              color="text.secondary"
              sx={{
                fontSize: "0.95rem",
                color: "#666",
                mr: 2,
              }}
            >
              {fecha}
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 2, bgcolor: "rgba(0,0,0,0.08)" }}
            />
            <Typography
              component="span"
              sx={{
                fontWeight: "bold",
                fontSize: "0.95rem",
              }}
            >
              {numPartidas} partidas
            </Typography>
          </Box>

          {/* Categories - single row with overflow handling */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            <DiamondOutlined
              sx={{ mr: 1.5, color: "#C74B5B", mt: 0.5, flexShrink: 0 }}
            />
            <Box
              ref={chipContainerRef}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* First row of chips - always visible */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  overflow: "hidden",
                  mb: showAllChips && hiddenChips.length > 0 ? 1 : 0,
                }}
              >
                {visibleChips.map((categoria, index) => (
                  <Chip
                    key={`visible-${index}`}
                    label={categoria}
                    size="medium"
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: "#666",
                      borderRadius: "20px",
                      mr: 1,
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      height: "32px",
                    }}
                  />
                ))}
              </Box>

              {/* Additional rows of chips - visible only when expanded */}
              {showAllChips && hiddenChips.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    mt: 0.5,
                  }}
                >
                  {hiddenChips.map((categoria, index) => (
                    <Chip
                      key={`hidden-${index}`}
                      label={categoria}
                      size="medium"
                      sx={{
                        bgcolor: "#f5f5f5",
                        color: "#666",
                        borderRadius: "20px",
                        mr: 1,
                        mb: 1,
                        fontSize: "0.875rem",
                        fontWeight: 400,
                        height: "32px",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Arrow to show more chips - only visible when there are hidden chips */}
            {hasChipOverflow && (
              <IconButton
                size="small"
                onClick={toggleChipsDisplay}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  color: "#C74B5B",
                  transform: showAllChips ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <ArrowForwardIos fontSize="small" />
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

      {/* Delete confirmation dialog */}
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
          <Warning fontSize="large" />
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

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{
              minWidth: "120px",
              borderColor: "#C4C4C4",
              color: "#333",
              mr: 1,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              minWidth: "120px",
              backgroundColor: "#C41E3A",
              color: "white",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#a41930",
              },
            }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskCard;
