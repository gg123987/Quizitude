import React, { useState } from 'react';
import './sideBar.css';
import HomeIcon from "@mui/icons-material/HomeOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import FolderIcon from '@mui/icons-material/FolderOpenOutlined';
import { Button } from "@mui/material";
import logoSmall from '../../assets/Logo-small.png';

const SideBar = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('home');

  // Event handlers
  const handleClick = (tabName) => {
    setActiveTab(tabName); 
  };

  return (
    <div className="sideBar">
        <img src={logoSmall} alt="logo" width="23px" height="23px" />
      <ul className="sideBar-tabs">
        <li
          className={activeTab === 'home' ? 'active' : ''}  // Check if the tab is active
          onClick={() => handleClick('home')}
        >
        <Button
            sx={{ borderRadius: 10 }} // Round corners
            variant="contained" // Adds a bit of padding
            startIcon={<HomeIcon />}
        >
        Home
        </Button>
        </li>
        <li
          className={activeTab === 'allDecks' ? 'active' : ''}
          onClick={() => handleClick('allDecks')}
        >
        <Button
            sx={{ borderRadius: 10 }}
            variant="contained"
            startIcon={<LayersIcon />}
        >
        All Decks
        </Button>  
        </li>
        <li
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => handleClick('categories')}
        >
        <Button
            sx={{ borderRadius: 10 }}
            variant="contained"
            startIcon={<FolderIcon />}
        >
        Categories
        </Button>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
