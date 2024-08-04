import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import QuizIcon from '@mui/icons-material/Quiz';

export default function AccountMenu() {
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStudy = () => {
    navigate("/study");
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
        <MenuItem onClick={handleStudy}>
          <QuizIcon fontSize="large" color="disabled" sx={{ mr: "5px", ml: "-5px" }} /> Study Mode
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
