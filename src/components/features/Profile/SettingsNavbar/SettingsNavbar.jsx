import React, { useState } from "react";
import "./settingsNavbar.css";

/**
 * SettingsNavbar component renders a navigation bar with tabs for different settings sections.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.activeTab - The currently active tab.
 * @param {Function} props.setActiveTab - Function to set the active tab.
 *
 * @example
 * <SettingsNavbar activeTab="Streak" setActiveTab={setActiveTabFunction} />
 *
 * @returns {JSX.Element} The rendered SettingsNavbar component.
 */
function SettingsNavbar({ activeTab, setActiveTab }) {
	return (
		<nav className="settings-navbar">
			<ul className="settings-navbar-tabs">
				{[
					"Streak",
					"View Score History",
					"Document Uploads",
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
