// src/components/EmptyTabContent.tsx
import React from "react";
import { Box } from "@mui/material";
import { Body1 } from "./Typography";

interface EmptyTabContentProps {
  message: string;
}

const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ message }) => {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        bgcolor: "white",
        borderRadius: 2,
        minHeight: "350px",
        maxWidth: "660px",
        marginLeft: "20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Body1
        sx={{
          color: "#586065",
        }}
      >
        {message}
      </Body1>
    </Box>
  );
};

export default EmptyTabContent;
