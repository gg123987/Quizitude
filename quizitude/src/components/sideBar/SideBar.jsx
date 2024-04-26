import React, { useState } from 'react';
import './sideBar.css';
import HomeIcon from "@mui/icons-material/HomeOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import FolderIcon from '@mui/icons-material/FolderOpenOutlined';
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import logoSmall from '../../assets/Logo-small.png';

const SideBar = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();  // Initialize navigate function

  // Event handlers
  const handleClick = (tabName) => {
    setActiveTab(tabName);
    // Navigate based on the tabName
    switch (tabName) {
      case 'home':
        navigate('/home'); 
        break;
      case 'allDecks':
        navigate('/decks'); 
        break;
      case 'categories':
        navigate('/categories'); 
        break;
      default:
        // Handle default case or error
        break;
    }
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
              sx={{ borderRadius: 1 }}
              variant="contained"
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
              sx={{ borderRadius: 1 }}
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
};

export default SideBar;