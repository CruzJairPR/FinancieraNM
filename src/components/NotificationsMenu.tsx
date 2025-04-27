import React from "react";
import {
  Menu,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppState } from "../context/AppStateContext";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  anchorEl,
  open,
  onClose,
  notifications,
}) => {
  const { markAllNotificationsAsRead, markNotificationAsRead } = useAppState();

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          maxHeight: "80vh",
          "& .MuiList-root": {
            padding: 0,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#C41E3A",
          color: "white",
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="subtitle1">Notificaciones</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Button
          onClick={handleMarkAllAsRead}
          sx={{
            textTransform: "none",
            color: "#0288d1",
            fontSize: "0.875rem",
          }}
        >
          Marcar como leídas
        </Button>
      </Box>

      <Typography
        variant="subtitle2"
        sx={{
          px: 2,
          py: 1,
          color: "text.secondary",
          bgcolor: "rgba(0, 0, 0, 0.03)",
        }}
      >
        Hoy
      </Typography>

      {notifications.length === 0 ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No tienes notificaciones
          </Typography>
        </Box>
      ) : (
        notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => markNotificationAsRead(notification.id)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              py: 2,
              px: 2,
              borderLeft: notification.read ? "none" : "4px solid #0288d1",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "#0288d1", fontWeight: 600 }}
              >
                {notification.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // En una implementación completa, aquí iría la lógica para eliminar la notificación
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>
          </MenuItem>
        ))
      )}
    </Menu>
  );
};

export default NotificationsMenu;
