import React, { useState } from 'react';
import './settingsNavbar.css';

function SettingsNavbar({ activeTab, setActiveTab}) {
  return (
    <nav className="settings-navbar">
      <ul className="settings-navbar-tabs">
        {['streak', 'view-score-history', 'pdf-uploads', 'general-settings'].map((tab) => (
          <li
            key={tab}
            className={`settings-navbar-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.replace(/-/g, ' ').toUpperCase()}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SettingsNavbar;
