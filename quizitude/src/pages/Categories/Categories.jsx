import React from 'react';
import './categories.css';
import SideBar from '../../components/sideBar/SideBar';
import TopBar from '../../components/topBar/TopBar';

const Categories = () => {
  return (
    <div className="categories">
        <TopBar />
        <SideBar />
        <h1 className="title">Categories</h1>
        {/* Content will go here */}
    </div>
  );
}

export default Categories;
