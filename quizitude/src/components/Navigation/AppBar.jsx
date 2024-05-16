// CustomAppBar.js
import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import IconBreadcrumbs from "../IconBreadcrumbs";
import { useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./appbar.css";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountMenu from "../AccountMenu";
import WindowDimensions from "../../context/WindowDimensions";
import CustomButton from "../CustomButton";

const CustomAppBar = ({ handleDrawerToggle, drawerWidth, handleOpenPopup }) => {
  const location = useLocation();
  const currentPage = location.pathname;
  const { height, width } = WindowDimensions();
  const [ buttonText, setButtonText ] = useState("New Deck");

  // if width is less than 600px, set the button text to ""
  useEffect(() => {
    if (width < 900) {
      setButtonText("");
    } else {
      setButtonText("New Deck");
    }
  }, [width]);


  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(${width}px - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: "transparent",
        boxShadow: "none",
        borderBottom: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Toolbar className="toolbar-left" sx={{ width: { sm: `calc(0.5* (${width}px - ${drawerWidth}px))`}}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 0, display: { sm: "none" }, color: "grey" }}
          >
            <MenuIcon />
          </IconButton>

          {/* If not on the home page, show the IconBreadcrumbs */}
          {currentPage !== "/" && <IconBreadcrumbs page={currentPage} />}
        </Toolbar>

        <Toolbar
          className="toolbar-right"
          sx={{
            width: { sm: `calc(0.5* (${width}px - ${drawerWidth}px))`},
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0px",
            spaceBetween: "3px",
          }}
        >
          <CustomButton onClick={handleOpenPopup} icon={<AddIcon />} >
            {buttonText}
          </CustomButton>
          <IconButton
            color="inherit"
            aria-label="settings"
            edge="end"
            sx={{ ml: 2, color: "#667085", display: { xs: "none", sm: "flex" } }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="notifications"
            edge="end"
            sx={{ ml: 2, color: "#667085", display: { xs: "none", sm: "flex" } }}
          >
            <NotificationsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="account"
            edge="end"
            sx={{ ml: 2, color: "#667085", display: { xs: "none", sm: "flex" } }}
          >
            <AccountMenu />
          </IconButton>
        </Toolbar>
      </div>
    </AppBar>
  );
};

export default CustomAppBar;
