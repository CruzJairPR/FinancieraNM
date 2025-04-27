import React from "react";
import { Box } from "@mui/material";
import { H6 } from "./Typography";

interface NavbarLogoProps {
  variant?: "default" | "assignment";
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ variant = "default" }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <img
        src="/src/assets/logo-NMP.jpg"
        alt="Nacional Monte de Piedad"
        height={variant === "assignment" ? "24" : "30"}
      />
      <H6 sx={{ ml: 1, fontSize: variant === "assignment" ? "14px" : "16px" }}>
        Nacional Monte de Piedad
      </H6>
    </Box>
  );
};

export default NavbarLogo;
