import React from 'react';
import Button from '@mui/material/Button'; // Import Material-UI Button component
import AddIcon from "@mui/icons-material/AddOutlined";
import './topBar.css';

const TopBar = ({ handleOpenPopup }) => {
  return (
    <div className="topBar">
      <div className="topBar-content">
        <Button
            className= "newDeck" 
            variant="contained" // Adds a bit of padding
            onClick={handleOpenPopup} // Call the handleOpenPopup function when the button is clicked in Decks.jsx
            style={{ backgroundColor: '#303484', color: 'white', borderRadius: '8px' }}  
            startIcon={<AddIcon />}
        >
        New Deck
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
