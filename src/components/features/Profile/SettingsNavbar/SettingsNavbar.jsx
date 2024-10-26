import React, { useState } from "react";
import "./settingsNavbar.css";

function SettingsNavbar({ activeTab, setActiveTab }) {
  return (
    <nav className="settings-navbar">
      <ul className="settings-navbar-tabs">
        {[
          "Streak",
          "View Score History",
          "PDF Uploads",
          "General Settings",
        ].map((tab) => (
          <li
            key={tab}
            className={`settings-navbar-tab ${
              activeTab === tab ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SettingsNavbar;
