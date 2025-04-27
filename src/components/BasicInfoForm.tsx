// src/components/BasicInfoForm.tsx
import {
  TextField,
  Typography,
  Box,
  styled,
  Grid,
  Divider,
  Button,
  InputAdornment,
} from "@mui/material";
import type { ElementType } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useMemo } from "react";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#E0E3E5",
    },
    "&:hover fieldset": {
      borderColor: "#C41E3A",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C41E3A",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#586065",
    "&.Mui-focused": {
      color: "#C41E3A",
    },
  },
});

// Estilos mejorados para el input de fecha
const StyledDateField = styled(StyledTextField)({
  width: "300px",
  "& input[type='date']::-webkit-calendar-picker-indicator": {
    opacity: 0, // Hacemos invisible el indicador nativo
    width: "36px",
    height: "26px",
    position: "absolute",
    right: 0,
    cursor: "pointer",
  },
});

interface BasicInfoFormProps {
  formData: {
    nombre: string;
    fecha: string;
    descripcion: string;
    presupuesto: string;
    margen: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isEditMode?: boolean;
}

export const BasicInfoForm = ({
  formData,
  onFormChange,
  onSubmit,
  isEditMode = false,
}: BasicInfoFormProps) => {
  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return (
      formData.nombre.trim() !== "" &&
      formData.fecha.trim() !== "" &&
      formData.descripcion.trim() !== "" &&
      formData.presupuesto.trim() !== "" &&
      formData.margen.trim() !== ""
    );
  }, [formData]);

  return (
    <Box
      sx={{ bgcolor: "white", borderRadius: 2 }}
      component="form"
      onSubmit={onSubmit}
    >
      <Grid container spacing={2} component={"div" as ElementType}>
        {/* Primera fila */}
        <Grid item xs={12} component={"div" as ElementType}>
          <Box display="flex" gap={2}>
            <StyledTextField
              required
              label="Nombre de la asignación"
              value={formData.nombre}
              onChange={(e) => onFormChange("nombre", e.target.value)}
              sx={{
                mb: 1,
                width: "300px",
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
            <StyledDateField
              required
              type="date"
              label="Fecha compromiso"
              value={formData.fecha}
              onChange={(e) => onFormChange("fecha", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayIcon sx={{ color: "#586065" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
          </Box>
        </Grid>

        {/* Segunda fila */}
        <Grid item xs={12} component={"div" as ElementType}>
          <StyledTextField
            style={{ width: "620px" }}
            required
            fullWidth
            multiline
            rows={4}
            label="Describe a detalle"
            value={formData.descripcion}
            onChange={(e) => onFormChange("descripcion", e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          />
          <Divider
            sx={{
              marginTop: "30px",
              marginBottom: "20px",
              backgroundColor: "#D8DCDE",
            }}
          />
        </Grid>
        <Grid item xs={12} component={"div" as ElementType}>
          <div style={{ width: "600px" }}>
            <Typography variant="body1" sx={{ color: "#131414FF" }}>
              Agrega información relevante para facilitar la selección
            </Typography>
          </div>
        </Grid>
        {/* Tercera fila */}
        <Grid item xs={12} component={"div" as ElementType}>
          <Box display="flex" gap={2}>
            <StyledTextField
              required
              label="Presupuesto total"
              value={formData.presupuesto}
              onChange={(e) => onFormChange("presupuesto", e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <span style={{ color: "#586065" }}>$</span>,
                },
              }}
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
            <StyledTextField
              required
              label="Margen"
              value={formData.margen}
              onChange={(e) => onFormChange("margen", e.target.value)}
              slotProps={{
                input: {
                  endAdornment: <span style={{ color: "#586065" }}>%</span>,
                },
              }}
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
          </Box>
        </Grid>

        {/* Botón Continuar */}
        <Grid item xs={12} component={"div" as ElementType} sx={{ mt: 2 }}>
          <Button
            type="submit"
            style={{
              width: "200px",
              borderRadius: "8px",
            }}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            disabled={!isFormValid}
            sx={{
              bgcolor: "#A82A3B",
              "&:hover": { bgcolor: "#a51a30" },
              textTransform: "none",
              fontWeight: 500,
              px: 4,
              py: 1.5,
              "&.Mui-disabled": {
                bgcolor: "#D8DCDE",
                color: "#586065",
              },
            }}
          >
            {isEditMode ? "Guardar cambios" : "Continuar"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfoForm;
