import PropTypes from "prop-types";
import {
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { updateCategory, deleteCategory } from "@/services/categoryService";
import React, { useState } from "react";
import "./category.css";

const Category = ({ category, onRefreshCategories }) => {
  const { name, decks_count } = category;
  const navigate = useNavigate();

  // State to handle the menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // State to handle the dialogs
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleMenuClick = (event) => {
    event.stopPropagation(); // Prevent triggering the category click event
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRenameCategory = () => {
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteCategory = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleClickCategory = () => {
    const params = new URLSearchParams();
    params.append("categoryId", category.id);
    params.append("categoryName", category.name);
    navigate(`/decks?${params.toString()}`);
  };

  const handleRenameDialogClose = () => {
    setNewCategoryName("");
    setRenameDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleRenameSubmit = async () => {
    const { data, error } = await updateCategory(
      category.id,
      {
        name: newCategoryName,
      },
      category.user_id
    );

    if (error) {
      console.error("Error renaming category:", error);
    } else {
      console.log("Category renamed successfully:", data);
      await onRefreshCategories(); // Refresh the categories list
      handleRenameDialogClose();
    }
  };

  const handleDeleteSubmit = async () => {
    console.log("Deleting category...");
    const { error } = await deleteCategory(category.id, category.user_id);

    if (error) {
      console.error("Error deleting category:", error);
    } else {
      console.log("Category deleted successfully");
      await onRefreshCategories(); // Refresh the categories list
      handleDeleteDialogClose();
    }
  };

  return (
    <div>
      <div className="category-card" onClick={handleClickCategory}>
        <div className="category-name">
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
              <MenuItem onClick={handleDeleteCategory}>Delete</MenuItem>
            </Menu>
          </div>
        </div>
      </div>

      {/* Rename Dialog */}
      <div>
        <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
          <DialogTitle>Rename Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Category Name"
              type="text"
              fullWidth
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRenameDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRenameSubmit} color="primary">
              Rename
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteSubmit} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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
