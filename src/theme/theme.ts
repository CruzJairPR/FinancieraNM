// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#C41E3A",
    },
    secondary: {
      main: "#0288d1",
    },
    error: {
      main: "#C41E3A", // Mismo que el primary para mantener consistencia
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          fontSize: "16px",
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#a51a30",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 400,
          fontSize: "16px",
          minWidth: "auto",
          padding: "12px 16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h5: {
          fontWeight: 500,
          fontSize: "24px",
        },
        h6: {
          fontWeight: 500,
          fontSize: "24px",
        },
        subtitle1: {
          fontWeight: 500,
          fontSize: "16px",
        },
        body1: {
          fontWeight: 400,
          fontSize: "16px",
        },
      },
    },
  },
});

export default theme;
