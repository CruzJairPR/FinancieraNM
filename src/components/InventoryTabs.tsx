import React from "react";
import { Tabs, Tab, Box, Typography, Chip } from "@mui/material";

interface TabItemProps {
  label: string;
  count: number;
}

const TabItem: React.FC<TabItemProps> = ({ label, count }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Typography>{label}</Typography>
    <Chip
      label={count}
      size="small"
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        height: "20px",
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  </Box>
);

export const InventoryTabs: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    { label: "Todas", count: 100 },
    { label: "Disponibles", count: 30 },
    { label: "Pre-seleccionadas", count: 2 },
    { label: "Confirmadas", count: 10 },
    { label: "Por validar", count: 10 },
    { label: "Vendidas", count: 5 },
  ];

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            minHeight: "48px",
          },
          "& .Mui-selected": {
            backgroundColor: "#F4F1F1FF",
            borderRadius: "8px",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={<TabItem label={tab.label} count={tab.count} />}
            sx={{
              borderRadius: "8px",
              mx: 0.5,
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default InventoryTabs;
