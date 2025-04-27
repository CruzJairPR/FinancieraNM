import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { DataTableProps } from "./types";

export const InventoryDataTable: React.FC<DataTableProps> = ({
  data,
  selectedItems,
  onSelectAll,
  onSelectItem,
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              checked={data.length > 0 && selectedItems.length === data.length}
              indeterminate={
                selectedItems.length > 0 && selectedItems.length < data.length
              }
              onChange={onSelectAll}
            />
          </TableCell>
          <TableCell>Artículo (A-Z)</TableCell>
          <TableCell>Asignación</TableCell>
          <TableCell>Material</TableCell>
          <TableCell>Conservación</TableCell>
          <TableCell>Antigüedad</TableCell>
          <TableCell>$ Préstamo</TableCell>
          <TableCell>$ Venta</TableCell>
          <TableCell>Valores ($)</TableCell>
          <TableCell>Margen</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onChange={() => onSelectItem(item.id)}
              />
            </TableCell>
            <TableCell>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={item.images[0]}
                  alt={item.name}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
                <Box>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.category}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell>{item.assignment}</TableCell>
            <TableCell>{item.material}</TableCell>
            <TableCell>{item.condition}</TableCell>
            <TableCell>{item.daysLeft}</TableCell>
            <TableCell>${item.basePrice.toLocaleString()}</TableCell>
            <TableCell>${item.salePrice.toLocaleString()}</TableCell>
            <TableCell>${item.finalPrice.toLocaleString()}</TableCell>
            <TableCell>{item.margin}</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <IconButton size="small">
                  <RefreshIcon />
                </IconButton>
                <IconButton size="small">
                  <ExpandMoreIcon />
                </IconButton>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryDataTable;
