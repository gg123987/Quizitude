import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './decks.css';

const Decks = () => {
  // State variables
  const [sort, setSort] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  // Event handlers
  const handleInputLabelChange = (event) => {
    setSort(event.target.value);
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  
  return (
    <div className='decks'>
        <h1 className="title">All Decks</h1>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px', gridColumn: 2, gridRow: 2}} >
            
            <FormControl className='decksInputLabel'>
            <InputLabel id="inputLabel">Sort By</InputLabel>
            <Select
                labelId="inputLabel"
                id="demo-simple-select"
                value={sort}
                label="Sort By"
                onChange={handleInputLabelChange}
                style= {{ minWidth: '200px'}}
            >
                <MenuItem value="Recently Created">Recently Created</MenuItem>
                <MenuItem value="Last Modified">Last Modified</MenuItem>
                <MenuItem value="Oldest">Oldest</MenuItem>
            </Select>
            </FormControl>
        </Box>
        {isPopupOpen && <Popup handleClosePopup={handleClosePopup} />} {/* Show the Popup component if isPopupOpen is true */}
    </div>
  );
}

export default Decks;
