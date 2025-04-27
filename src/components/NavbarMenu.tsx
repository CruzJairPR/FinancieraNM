import React from "react";
import { Menu, MenuItem } from "@mui/material";

interface NavbarMenuItem {
  label: string;
  path: string;
}

interface NavbarMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: NavbarMenuItem[];
  onItemClick: (path: string) => void;
}

const NavbarMenu: React.FC<NavbarMenuProps> = ({
  anchorEl,
  open,
  onClose,
  items,
  onItemClick,
}) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {items.map((item) => (
        <MenuItem
          key={`${item.label}-${item.path}`}
          onClick={() => onItemClick(item.path)}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default NavbarMenu;
