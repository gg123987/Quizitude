"use client";

import ResponsiveDrawer from '@/components/Navigation/Drawer';
import CustomAppBar from '@/components/Navigation/AppBar';
import { useState } from 'react';

export default function DrawerLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 230; // Make sure this matches your drawer width

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenPopup = () => {
    // Implement the function to open the popup
  };

  return (
    <div className="root">
      <CustomAppBar
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        handleOpenPopup={handleOpenPopup}
      />
      <ResponsiveDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
      <main className="content">
        {children}
      </main>
      <style jsx>{`
        .root {
          display: flex;
        }
        .content {
          flex-grow: 1;
          padding: 20px;
          margin-top: 64px; // Adjust based on your AppBar height
          margin-left: ${drawerWidth}px; // Adjust based on your Drawer width
        }
        @media (max-width: 600px) {
          .content {
            margin-left: 0; // No margin on mobile
          }
        }
      `}</style>
    </div>
  );
}
