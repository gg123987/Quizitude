import './categories.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';

import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FolderOpenOutlined from '@mui/icons-material/FolderOpenOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
//npm install @mui/icons-material @mui/material @emotion/styled @emotion/react

const Categories = () => {
  const [isSelectingCategory, setIsSelectingCategory] = useState(false); // Determine if we're selecting or creating a category
  const [categories, setCategories] = useState([]); // Store categories dynamically
  const [newCategoryName, setNewCategoryName] = useState(''); // Track new category name input
  const [openModal, setOpenModal] = useState(false); // Control modal visibility
  const [anchorEl, setAnchorEl] = useState(null); // Control menu anchor for each category
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(null); // Track which category is being renamed or deleted

  const navigate = useNavigate();

  // Function to open the new category modal (for new or renaming)
  const handleNewCategoryClick = () => {
    setCurrentCategoryIndex(null); 
    setNewCategoryName(''); 
    setOpenModal(true); 
  };

  // Open modal for renaming category
  const handleOpenModalForRename = (index) => {
    setCurrentCategoryIndex(index); 
    setNewCategoryName(categories[index].name); 
    setOpenModal(true); 
  };

  // Close modal without saving
  const handleCloseModal = () => {
    setOpenModal(false); 
    setNewCategoryName(''); 
    setCurrentCategoryIndex(null); 
  };

  // Function to handle saving a new or renamed category
  const handleSaveCategory = () => {
    if (newCategoryName.trim()) {
      if (currentCategoryIndex !== null) {
        // Renaming existing category
        const updatedCategories = [...categories];
        updatedCategories[currentCategoryIndex].name = newCategoryName;
        setCategories(updatedCategories); 
      } else {
        // Adding new category
        const newCategory = { name: newCategoryName, decks: 0 };
        setCategories([...categories, newCategory]);
      }
      setIsSelectingCategory(true);
      handleCloseModal();
    }
  };

  // Function to delete a specific category
  const handleDeleteCategory = () => {
    if (currentCategoryIndex !== null) {
      const updatedCategories = categories.filter((_, i) => i !== currentCategoryIndex); // Remove category by index
      setCategories(updatedCategories);
      setAnchorEl(null); // Close the menu
      setCurrentCategoryIndex(null);
    }
  };

  // Rendering the component
  return (
    <Box padding={3}>
      {/* Header section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">Categories</Typography>
      </Box>

      {/* Search and action buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <TextField
          id="filled-basic"
          variant="outlined"
          placeholder='Search'
          style={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box marginLeft="auto" display="flex" gap={2}>
          <Button variant="outlined" color='secondary' onClick={handleNewCategoryClick}>New Category</Button>
          <Button variant="outlined" color='info' endIcon={<ArrowDropDownIcon />}>Recently Created</Button>
        </Box>
      </Box>

      {/* Conditionally render content */}
      {categories.length === 0 ? (
        <Box sx={{ marginTop: 30 }}>
          <Typography variant="h5">You have no categories yet</Typography>
          <Typography variant="subtitle1">Create your first category by clicking the button below</Typography>
          <Button variant="outlined" color='secondary' sx={{ marginTop: 2 }} onClick={handleNewCategoryClick}>New Category</Button>
        </Box>
      ) : (
        <Box sx={{ marginTop: 2 }}>
          {/* Grid showing the created categories */}
          <Grid container spacing={10}>
            {categories.map((category, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                onClick={() => navigate("/decks")}
                sx={{ cursor: 'pointer' }}
              >
                <Card
                  sx={{
                    transition: "background-color 0.3s ease",
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FolderOpenOutlined sx={{ marginRight: 1 }} />
                      <span style={{ fontWeight: 'bold' }}>{category.name}</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#f7f5f5',
                        padding: '2px 6px',
                        borderRadius: '20px'
                      }}>
                        {category.decks} Decks
                      </span>
                      <IconButton
                        sx={{ marginLeft: 1 }}
                        onClick={(event) => {
                          event.stopPropagation();
                          setAnchorEl(event.currentTarget); // Open the menu
                          setCurrentCategoryIndex(index); // Set the index for the current category
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        elevation={1}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => {
                          setAnchorEl(null);
                          setCurrentCategoryIndex(null); // Reset index when closing the menu
                        }}
                      >
                        <MenuItem onClick={(event) => {
                          event.stopPropagation();
                          setAnchorEl(null);
                          handleOpenModalForRename(index);
                        }}>
                          <BorderColorOutlinedIcon sx={{ marginRight: 1 }} />
                          Rename Category
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteCategory();
                        }}>
                          <DeleteOutlineOutlinedIcon sx={{ marginRight: 1 }} />
                          Delete Category
                        </MenuItem>
                      </Menu>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Modal for creating or renaming a category */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: '10px',
        }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}>
            <CloseIcon />
          </IconButton>
          <Typography id="modal-title" variant="subtitle1" component="h1" align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            {currentCategoryIndex !== null ? "Rename Category" : "Create New Category"}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)} // Track the new or renamed category name
            placeholder="Enter category name"
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'darkblue',
              color: 'white', 
            }}
            fullWidth
            onClick={handleSaveCategory} // Save the new or renamed category
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Categories;