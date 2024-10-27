// ResponsiveDrawer.js
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import FolderIcon from "@mui/icons-material/FolderOpenOutlined";
import { useLocation } from "react-router-dom";
import logoWhite from "@/assets/Logo-white.svg";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CustomAppBar from "@/components/Layout/Header/AppBar";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import useModal from "@/hooks/useModal";
import "./drawer.css";

/**
 * ResponsiveDrawer component provides a responsive sidebar drawer that adapts to different screen sizes.
 * It includes navigation buttons to different sections of the application.
 *
 * @param {Object} props - The component props.
 * @param {function} props.window - Function to get the window object.
 * @param {React.ReactNode} props.children - The children components to be rendered inside the main content area.
 */
function ResponsiveDrawer({ window, ...props }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(230);

  const location = useLocation();
  const currentPage = location.pathname;
  const { width } = useWindowDimensions();
  const { modalOpen } = useModal();

  // Get the container to render the drawer
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  // Toggle the drawer open and close states
  // Prevent toggling the drawer when it is closing
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const navigate = useNavigate();

  const handleClick = (tabName) => {
    switch (tabName) {
      case "home":
        navigate("/");
        break;
      case "decks":
        navigate("/decks");
        break;
      case "categories":
        navigate("/categories");
        break;
      default:
        break;
    }
    handleDrawerClose(); // Close the drawer when a menu option is clicked
  };

  useEffect(() => {
    // if modal is open, set drawer width to 0
    if (modalOpen) {
      setDrawerWidth(0);
    } else {
      // if modal is closed, set drawer width to sidebar width
      const sidebarWidth = document.querySelector(".sideBar")?.offsetWidth || 0;
      setDrawerWidth(sidebarWidth === 0 ? 0 : Math.max(180, sidebarWidth));
    }
  }, [width, modalOpen]);

  // Drawer content including logo and navigation buttons
  const drawer = (
    <div className="sideBar">
      <Box sx={{ display: "flex", padding: "30px 20px" }}>
        <img
          src={logoWhite}
          alt="Quizitude Logo"
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
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      {/* Render the drawer only if the modal is not open */}
      {!modalOpen && (
        <>
          {/* Temporary drawer for mobile view */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                color: "white",
                bgcolor: "#2D3282",
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* Permanent drawer for desktop view */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                color: "white",
                bgcolor: "#2D3282",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </>
      )}
      {/* Main content area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {/* Custom AppBar component for the header */}
          <CustomAppBar
            handleDrawerToggle={handleDrawerToggle}
            drawerWidth={drawerWidth}
          />
        </Box>
        {/* Render children components (pages) */}
        <Box
          sx={{
            marginLeft: { sm: `${drawerWidth}px` },
            marginTop: "64px",
            flexDirection: "row",
            flex: 1,
          }}
        >
          {props.children}
        </Box>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node,
};

export default ResponsiveDrawer;
