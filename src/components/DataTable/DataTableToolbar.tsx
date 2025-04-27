import React from "react";
import { Box, Stack, Button, TextField } from "@mui/material";
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

interface DataTableToolbarProps {
  onSearch?: (value: string) => void;
  onColumnsClick?: () => void;
  onFiltersClick?: () => void;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  onSearch,
  onColumnsClick,
  onFiltersClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box sx={{ position: "relative" }}>
          <TextField
            placeholder="SIN FILTROS APLICADOS"
            variant="outlined"
            size="small"
            sx={{ width: "300px" }}
            onChange={(e) => onSearch?.(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "action.active", mr: 1 }} />
              ),
            }}
          />
        </Box>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button
          variant="text"
          startIcon={<SettingsIcon />}
          onClick={onColumnsClick}
        >
          Columnas
        </Button>
        <Button
          variant="text"
          endIcon={<ExpandMoreIcon />}
          onClick={onFiltersClick}
        >
          Todos los filtros
        </Button>
      </Stack>
    </Box>
  );
};

export default DataTableToolbar;
