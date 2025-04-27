import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "./DataTable.css";
import { inventarioService, InventoryItem } from "../../services/api";

// Componente principal
const JoyeriaDataTable = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [inventarioData, setInventarioData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar datos del inventario
  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const data = await inventarioService.getAll();
        setInventarioData(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el inventario:", err);
        setError(
          "No se pudo cargar el inventario. Intente nuevamente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInventario();
  }, []);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = inventarioData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.includes(id);

  const PriceCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: "bold",
  }));

  // Función para limpiar selección
  const handleClearSelection = () => {
    setSelected([]);
  };

  // Función para navegar al dashboard
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TableContainer
          sx={{ flexGrow: 1, overflow: "auto" }}
          className="custom-scrollbar"
        >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead sx={{ backgroundColor: "#f8f8f8" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < inventarioData.length
                    }
                    checked={
                      inventarioData.length > 0 &&
                      selected.length === inventarioData.length
                    }
                    onChange={handleSelectAllClick}
                    slotProps={{
                      input: { "aria-label": "select all items" },
                    }}
                  />
                </TableCell>
                <TableCell>Artículo (A-Z)</TableCell>
                <TableCell>Asignación</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Días</TableCell>
                <TableCell>Precio base</TableCell>
                <TableCell>Venta</TableCell>
                <TableCell>Precio final</TableCell>
                <TableCell>Margen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventarioData.map((row) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${row.id}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      "&.MuiTableRow-root.Mui-selected": {
                        backgroundColor: "rgba(199, 75, 91, 0.08)",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{
                        maxWidth: 300,
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          component="p"
                          sx={{ fontWeight: "500" }}
                        >
                          {row.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={row.category}
                            size="small"
                            sx={{
                              bgcolor: "rgba(199, 75, 91, 0.1)",
                              color: "#C74B5B",
                              borderRadius: "4px",
                              height: "20px",
                              fontSize: "11px",
                            }}
                          />
                          <Chip
                            label={row.subCategory}
                            size="small"
                            sx={{
                              bgcolor: "rgba(0, 0, 0, 0.05)",
                              color: "text.secondary",
                              borderRadius: "4px",
                              height: "20px",
                              fontSize: "11px",
                            }}
                          />
                          {row.forChristmas && (
                            <Chip
                              label="Navidad"
                              size="small"
                              sx={{
                                bgcolor: "rgba(0, 128, 0, 0.1)",
                                color: "green",
                                borderRadius: "4px",
                                height: "20px",
                                fontSize: "11px",
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" component="p">
                        {row.assignment}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" component="p">
                        {row.material}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" component="p">
                        {row.condition}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body2" component="p">
                          {row.daysLeft}
                        </Typography>
                        <Typography
                          variant="caption"
                          component="p"
                          sx={{ color: "text.secondary" }}
                        >
                          ({row.dateInfo})
                        </Typography>
                      </Box>
                    </TableCell>
                    <PriceCell>
                      <Typography variant="body2" component="p">
                        ${row.basePrice.toLocaleString()}
                      </Typography>
                    </PriceCell>
                    <PriceCell>
                      <Typography variant="body2" component="p">
                        ${row.salePrice.toLocaleString()}
                      </Typography>
                    </PriceCell>
                    <PriceCell>
                      <Typography variant="body2" component="p">
                        ${row.finalPrice.toLocaleString()}
                      </Typography>
                    </PriceCell>
                    <TableCell>
                      <Typography variant="body2" component="p">
                        {row.margin}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 2,
            borderTop: "1px solid #e0e0e0",
            mt: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {selected.length} seleccionadas
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                height: "48px",
                textTransform: "none",
                mr: 1,
                borderRadius: 2,
              }}
              onClick={handleClearSelection}
            >
              Limpiar selección
            </Button>

            <Button
              variant="contained"
              color="error"
              sx={{
                height: "48px",
                textTransform: "none",
                mr: 1,
                borderRadius: 2,
              }}
              onClick={navigateToDashboard}
            >
              Rechazar todos
            </Button>

            <Button
              variant="contained"
              color="success"
              sx={{
                height: "48px",
                textTransform: "none",
                borderRadius: 2,
              }}
              onClick={navigateToDashboard}
            >
              Validar todos
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default JoyeriaDataTable;
