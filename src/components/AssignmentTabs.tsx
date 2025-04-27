// src/components/AssignmentTabs.tsx
import React from "react";
import { Box, Tabs, Tab, Typography, styled } from "@mui/material";

interface TabData {
  label: string;
  count: number;
}

interface AssignmentTabsProps {
  tabs: TabData[];
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#C41E3A",
    height: "3px",
  },
});

const StyledTab = styled(Tab)({
  textTransform: "none",
  minWidth: 0,
  padding: "12px 24px",
  color: "#586065",
  "&.Mui-selected": {
    color: "#C41E3A",
    fontWeight: 500,
  },
  "&:first-of-type": {
    paddingLeft: 0,
  },
});

const AssignmentTabs: React.FC<AssignmentTabsProps> = ({
  tabs,
  currentTab,
  onTabChange,
}) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "#E0E3E5" }}>
      <StyledTabs
        value={currentTab}
        onChange={onTabChange}
        aria-label="assignaciones tabs"
      >
        {tabs.map((tab, index) => (
          <StyledTab
            key={index}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "20px",
                  gap: 1,
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>{tab.label}</Typography>
                <Typography
                  component="span"
                  sx={{
                    bgcolor: "#F5F5F5",
                    borderRadius: "12px",
                    px: 1,
                    py: 0.25,
                    minWidth: "24px",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#586065",
                  }}
                >
                  {tab.count}
                </Typography>
              </Box>
            }
          />
        ))}
      </StyledTabs>
    </Box>
  );
};

export default AssignmentTabs;
