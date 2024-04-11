import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchBar from "material-ui-search-bar"; // npm i --save material-ui-search-bar
import './decks.css';
import SideBar from '../../components/sideBar/SideBar';
import TopBar from '../../components/topBar/TopBar';
  

const Decks = () => {
const [sort, setSort] = React.useState('');

  const handleChange = (event) => {
    setSort(event.target.value);
  };
  
  return (
    <div className='decks'>
        <TopBar />
        <SideBar />
        <h1 className="title">All Decks</h1>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px', gridColumn: 2, gridRow: 2 }} >
            <SearchBar
            onChange={() => console.log('onChange')}
            onRequestSearch={() => console.log('onRequestSearch')}
            style={{ maxWidth: '300px' }}
            />
            <FormControl className='formControlDropdown'>
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort}
                label="Sort By"
                onChange={handleChange}
            >
                {/* Some Examples, not sure what they'd like specifically */} 
                <MenuItem value="Recently Created">Recently Created</MenuItem>
                <MenuItem value="Category">Last Modified</MenuItem>
                <MenuItem value="Category">Oldest</MenuItem>
            </Select>
            </FormControl>
        </Box>
    </div>
  );
}


export default Decks
