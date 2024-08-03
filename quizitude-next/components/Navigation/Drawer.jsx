import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import FolderIcon from "@mui/icons-material/FolderOpenOutlined";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import "./drawer.css";
import { usePathname } from "next/navigation";

const ResponsiveDrawer = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {
  const currentPage = usePathname();

  const drawer = (
    <div className="sideBar">
      <Box sx={{ display: "flex", padding: "30px 20px" }}>
        <img
          src={"/assets/Logo-white.svg"}
          alt="Logo"
          style={{ width: "30px", height: "30px" }}
        />
      </Box>
      <ul className="sideBar-tabs">
        <li
          className={currentPage === "/" ? "active" : ""}
          onClick={() => handleClick("home")}
        >
          <Button
            sx={{ borderRadius: 1 }}
            variant="contained"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
        </li>
        <li
          className={currentPage === "/decks" ? "active" : ""}
          onClick={() => handleClick("decks")}
        >
          <Button
            sx={{ borderRadius: 1 }}
            variant="contained"
            startIcon={<LayersIcon />}
          >
            All Decks
          </Button>
        </li>
        <li
          className={currentPage === "/categories" ? "active" : ""}
          onClick={() => handleClick("categories")}
        >
          <Button
            sx={{ borderRadius: 1 }}
            variant="contained"
            startIcon={<FolderIcon />}
          >
            Categories
          </Button>
        </li>
      </ul>
    </div>
  );

  return (
    <div>
      <CssBaseline />
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#2D3282",
            color: "white",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#2D3282",
            color: "white",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </div>
  );
};

export default ResponsiveDrawer;