import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./newcat.css";

const NewCategory = ({ open, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(""); // State to manage error messages

  const handleSave = async () => {
    if (categoryName.trim()) {
      try {
        // Call the onSave function and wait for it to complete
        await onSave(categoryName.trim());
        setCategoryName(""); // Clear input after successful save
        setError(""); // Clear error message on success
        onClose(); // Close modal on success
      } catch (error) {
        // Set error message based on error response
        if (error.message.includes("unique_category_name_user_id")) {
          setError("A category with this name already exists.");
        } else {
          setError("An error occurred while creating the category.");
        }
      }
    } else {
      setError("Category name cannot be empty.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="new-category-modal-title"
      aria-describedby="new-category-modal-description"
    >
      <Box className="cat-popup">
        <div className="close">
          <IconButton className="close-button" onClick={onClose}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
        <div className="cat-popup-content">
          <h2 id="new-category-modal-title">Add New Category</h2>
          <TextField
            label="Category Name"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            margin="normal"
          />
          {error && (
            <Typography
              color="error"
              variant="body2"
              style={{ marginTop: "10px" }}
            >
              {error}
            </Typography>
          )}
          <Button
            onClick={handleSave}
            style={{
              backgroundColor: "#303484",
              color: "white",
              minHeight: "40px",
              marginTop: "20px",
            }}
            fullWidth
          >
            Save Category
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

NewCategory.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default NewCategory;
