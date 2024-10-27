import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";

/**
 * AccountMenu component renders a user account menu with options to navigate to profile, study, and logout.
 *
 * @component
 *
 * @example
 * return (
 *   <AccountMenu />
 * )
 *
 * @returns {React.Fragment} A fragment containing the account menu.
 *
 * @description
 * This component uses Material-UI components such as Tooltip, Avatar, Menu, MenuItem, Divider, and ListItemIcon.
 * It provides navigation options for the user to access their profile, study page, and logout functionality.
 *
 * @function
 * @name AccountMenu
 *
 * @hook
 * @name useAuth
 * @description Custom hook to get authentication state and sign out function.
 *
 * @hook
 * @name useNavigate
 * @description Hook from react-router-dom to navigate programmatically.
 *
 * @state {HTMLElement|null} anchorEl - The current anchor element for the menu.
 * @state {boolean} open - Boolean indicating if the menu is open.
 */
export default function AccountMenu() {
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl); // Boolean to check if anchorEl is not null

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    navigate("/logout");
    signOut();
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
        </div>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
          mt: 2,
          overflow: "visible",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handlProfile}>
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        {auth && (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
