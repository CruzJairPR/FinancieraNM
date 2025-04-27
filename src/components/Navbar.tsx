// src/components/Navbar.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";
import NavbarLogo from "./NavbarLogo";
import NotificationsMenu from "./NotificationsMenu";
import NavbarMenu from "./NavbarMenu";

interface NavbarProps {
  variant?: "default" | "assignment";
}

const Navbar: React.FC<NavbarProps> = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appState, logout } = useAppState();

  const [mainMenuAnchor, setMainMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [notificationsAnchor, setNotificationsAnchor] =
    useState<null | HTMLElement>(null);
  const [assignmentsMenuAnchor, setAssignmentsMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [inventoryMenuAnchor, setInventoryMenuAnchor] =
    useState<null | HTMLElement>(null);

  const assignmentItems = [
    { label: "Ver Asignaciones", path: "/dashboard" },
    { label: "Curadores", path: "/curadores" },
    { label: "Visitas Agendadas", path: "/visitas-agendadas" },
  ];

  const inventoryItems = [
    { label: "Todas las Partidas", path: "/inventario" },
    { label: "Por Validar", path: "/inventario" },
    { label: "Listos por Asignar", path: "/inventario" },
    { label: "Por Publicar", path: "/inventario" },
    { label: "Vendidas", path: "/inventario" },
  ];

  const handleMainMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMainMenuAnchor(event.currentTarget);
  };

  const handleAssignmentsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAssignmentsMenuAnchor(event.currentTarget);
  };

  const handleInventoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setInventoryMenuAnchor(event.currentTarget);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMainMenuAnchor(null);
    setNotificationsAnchor(null);
    setAssignmentsMenuAnchor(null);
    setInventoryMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const handleReturn = () => {
    // Determine the previous step based on the current path
    const currentPath = location.pathname;

    // Flow: crear-asignacion -> partidas-buscar -> partidas-categorias -> asignar-curador
    switch (currentPath) {
      case "/crear-asignacion":
        navigate("/dashboard");
        break;
      case "/partidas-buscar":
        navigate("/crear-asignacion");
        break;
      case "/partidas-categorias":
        navigate("/partidas-buscar");
        break;
      case "/asignar-curador":
        navigate("/partidas-categorias");
        break;
      default:
        navigate("/dashboard");
        break;
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ backgroundColor: "white" }}
    >
      <Toolbar
        variant={variant === "assignment" ? "dense" : "regular"}
        sx={{ minHeight: variant === "assignment" ? "56px" : "64px" }}
      >
        {variant === "default" && (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMainMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mainMenuAnchor}
              open={Boolean(mainMenuAnchor)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </>
        )}

        <NavbarLogo variant={variant} />

        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {variant === "assignment" ? (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleReturn}
              sx={{
                color: "#C41E3A",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Regresar
            </Button>
          ) : (
            <>
              <Button
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleAssignmentsClick}
                sx={{ textTransform: "none", color: "inherit" }}
              >
                Asignaciones
              </Button>
              <NavbarMenu
                anchorEl={assignmentsMenuAnchor}
                open={Boolean(assignmentsMenuAnchor)}
                onClose={handleClose}
                items={assignmentItems}
                onItemClick={handleNavigate}
              />

              <Button
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleInventoryClick}
                sx={{ textTransform: "none", color: "inherit" }}
              >
                Inventario
              </Button>
              <NavbarMenu
                anchorEl={inventoryMenuAnchor}
                open={Boolean(inventoryMenuAnchor)}
                onClose={handleClose}
                items={inventoryItems}
                onItemClick={handleNavigate}
              />

              <IconButton
                color="inherit"
                onClick={handleNotificationsClick}
                size="large"
              >
                <Badge
                  badgeContent={
                    appState.notifications.filter((n) => !n.read).length
                  }
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <NotificationsMenu
                anchorEl={notificationsAnchor}
                open={Boolean(notificationsAnchor)}
                onClose={handleClose}
                notifications={appState.notifications}
              />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
