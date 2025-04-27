// src/components/EmptyStateCard.tsx
import React from "react";
import { Box } from "@mui/material";
import DiamondIconOutlined from "@mui/icons-material/DiamondOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { H5, Body1 } from "./Typography";
import { PrimaryButton } from "./Button";

interface EmptyStateCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        textAlign: "center",
        bgcolor: "white",
        borderRadius: 2,
        minHeight: "350px",
        maxWidth: "660px",
        marginLeft: "20%",
      }}
    >
      <DiamondIconOutlined sx={{ color: "#C41E3A", fontSize: 48, mb: 3 }} />
      <H5
        sx={{
          mb: 2,
          color: "#131414",
        }}
      >
        {title}
      </H5>
      <Body1
        sx={{
          color: "#586065",
          maxWidth: "460px",
          mb: 4,
        }}
      >
        {description}
      </Body1>
      <PrimaryButton
        endIcon={<ArrowForwardIcon />}
        onClick={onButtonClick}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 1,
        }}
      >
        {buttonText}
      </PrimaryButton>
    </Box>
  );
};

export default EmptyStateCard;
