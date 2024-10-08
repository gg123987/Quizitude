import PropTypes from "prop-types";
import { Typography, Menu, MenuItem, IconButton } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./category.css";

const Category = ({ category }) => {
  const { name, decks_count } = category;
  const navigate = useNavigate();

  // State to handle the menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation(); // Prevent triggering the category click event
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRenameCategory = () => {
    console.log("Renaming category...");
    handleMenuClose();
  };

  const handleDeleteCategory = () => {
    console.log("Deleting category...");
    handleMenuClose();
  };

  const handleOpenCategory = () => {
    navigate(`/categories/${category.id}`);
    handleMenuClose();
  };

  const handleClickCategory = () => {
    navigate(`/categories/${category.id}`);
  };

  return (
    <div className="deck-card" onClick={handleClickCategory}>
      <div className="name">
        <FolderOpenIcon />
        <Typography
          variant="body1"
          color="textSecondary"
          style={{
            fontFamily: "Inter",
            fontSize: "1.2rem",
            fontWeight: "bold",
            margin: "0px",
            width: "fit-content",
          }}
        >
          {name}
        </Typography>
      </div>
      <div className="right">
        <div
          className="category"
          style={{
            borderRadius: "30px",
            color: "#1D2939",
            backgroundColor: "#EAECF0",
            boxShadow: "none",
            width: "fit-content",
            marginBottom: "0px",
            padding: "2px 10px",
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleClickCategory}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            style={{
              fontFamily: "Inter",
              fontWeight: "400",
              fontSize: "12px",
              margin: "0px",
              width: "fit-content",
            }}
          >
            {decks_count}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{
              fontFamily: "Inter",
              fontWeight: "400",
              fontSize: "12px",
              margin: "0px 0px 0px 4px",
              width: "fit-content",
            }}
          >
            {decks_count === 1 ? " Deck" : " Decks"}
          </Typography>
        </div>

        {/* Menu Icon */}
        <div className="menu">
          <IconButton
            aria-label="category-menu"
            aria-controls={menuOpen ? "category-menu" : undefined}
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="category-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()} // Prevent parent click on menu click
          >
            <MenuItem onClick={handleRenameCategory}>Rename</MenuItem>
            <MenuItem onClick={handleOpenCategory}>Open</MenuItem>
            <MenuItem onClick={handleDeleteCategory}>Delete</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    decks_count: PropTypes.number.isRequired,
  }).isRequired,
};

export default Category;
