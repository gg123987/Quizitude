// CustomAppBar.js
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import IconBreadcrumbs from "./IconBreadcrumbs";
import { useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountMenu from "./AccountMenu";
import useWindowDimensions from '@/hooks/useWindowDimensions';
import CustomButton from "../CustomButton";
import NewDeckModal from "../NewDeck/Modal";
import "./appbar.css";

const CustomAppBar = ({ handleDrawerToggle, drawerWidth, modalOpen, setModalOpen }) => {
  const location = useLocation();
  const currentPage = location.pathname;
  const { width } = useWindowDimensions();
  const [buttonText, setButtonText] = useState("New Deck");

  useEffect(() => {
    if (width < 900) {
      setButtonText("");
    } else {
      setButtonText("New Deck");
    }
  }, [width]);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

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
          <CustomButton onClick={handleOpen} icon={<AddIcon />}>
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
        <NewDeckModal open={modalOpen} handleClose={handleClose} />
      </div>
    </AppBar>
  );
};

CustomAppBar.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

export default CustomAppBar;