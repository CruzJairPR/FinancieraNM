import { Box, Typography } from "@mui/material";
import { JoyeriaDataTable } from "../components/DataTable";
import Navbar from "../components/Navbar";
import InventoryTabs from "../components/InventoryTabs";

const Inventario = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Navbar variant="default" />

      <Box
        sx={{ px: 2, py: 1, bgcolor: "white", borderTop: "1px solid #e0e0e0" }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Inventario
        </Typography>
      </Box>

      <Box sx={{ bgcolor: "white", ml: -3 }}>
        <InventoryTabs />
      </Box>

      {/* Contenedor de la tabla */}
      <Box
        sx={{
          flexGrow: 1,
          px: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <JoyeriaDataTable />
      </Box>
    </Box>
  );
};

export default Inventario;
