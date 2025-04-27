import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

// Tipos de estado para los pasos
type StepStatus = "completed" | "active" | "pending";

// Interfaz para cada paso
interface Step {
  number: number;
  title: string;
  status: StepStatus;
}

interface StepsSidebarProps {
  currentStep: number;
  steps: Step[];
  formCompleted?: boolean;
}

// Componente estilizado para la línea vertical
const VerticalLine = styled("div")(() => ({
  position: "absolute",
  left: "24px",
  top: "30px",
  height: "calc(80% - 24px)",
  width: "2px",
  backgroundColor: "#D8DCDE",
  zIndex: 0,
}));

// Componente estilizado para el círculo numerado
const StepCircle = styled(Box)<{ status: StepStatus }>(({ status }) => ({
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: 500,
  zIndex: 1,
  backgroundColor:
    status === "completed" ? "#FFD6DC" : status === "active" ? "#777" : "#CCC",
  color:
    status === "completed" ? "#000" : status === "active" ? "#FFF" : "#000",
  border: "none",
}));

const useStepsStatus = (
  currentStep: number,
  initialSteps: Step[],
  formCompleted?: boolean
) => {
  const [updatedSteps, setUpdatedSteps] = useState<Step[]>(initialSteps);
  const location = useLocation();

  useEffect(() => {
    const newSteps = initialSteps.map((step) => {
      if (step.number < currentStep) {
        return { ...step, status: "completed" as StepStatus };
      } else if (step.number === currentStep) {
        return { ...step, status: "active" as StepStatus };
      } else {
        return { ...step, status: "pending" as StepStatus };
      }
    });

    // Si el formulario está completado y estamos en la página actual,
    // marcar el paso actual como completado y activar el siguiente
    if (formCompleted) {
      const currentStepIndex = currentStep - 1;
      if (currentStepIndex >= 0 && currentStepIndex < newSteps.length) {
        newSteps[currentStepIndex].status = "completed";
        if (currentStepIndex + 1 < newSteps.length) {
          newSteps[currentStepIndex + 1].status = "active";
        }
      }
    }

    setUpdatedSteps(newSteps);
  }, [currentStep, initialSteps, formCompleted, location.pathname]);

  return updatedSteps;
};

const StepsSidebar: React.FC<StepsSidebarProps> = ({
  currentStep,
  steps,
  formCompleted,
}) => {
  const updatedSteps = useStepsStatus(currentStep, steps, formCompleted);

  return (
    <Box
      sx={{
        p: 3,
        position: "relative",
        bgcolor: "#f5f5f5",
        height: "100%",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: 600,
          fontSize: "20px",
          mb: 3,
          color: "#333",
        }}
      >
        Crear asignación
      </Typography>

      <List sx={{ position: "relative" }}>
        {/* Línea vertical conectora */}
        <VerticalLine />

        {updatedSteps.map((step) => (
          <ListItem
            key={step.number}
            sx={{
              p: 1,
              mb: 3,
              position: "relative",
            }}
          >
            <ListItemIcon sx={{ minWidth: "42px" }}>
              {step.status === "completed" ? (
                <CheckCircleIcon
                  sx={{
                    color: "#FFD6DC",
                    fontSize: 32,
                    backgroundColor: "pink",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <StepCircle status={step.status}>{step.number}</StepCircle>
              )}
            </ListItemIcon>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <ListItemText
                primary={step.title}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#333",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mb: 0,
                  },
                }}
                sx={{ m: 0, p: 0 }}
              />
              {step.status === "completed" && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#666",
                    fontSize: "12px",
                    lineHeight: 1,
                  }}
                >
                  Completado
                </Typography>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default StepsSidebar;
