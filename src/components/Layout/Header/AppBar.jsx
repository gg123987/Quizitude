import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import IconBreadcrumbs from "./IconBreadcrumbs";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountMenu from "./AccountMenu";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import CustomButton from "@/components/common/CustomButton";
import NewDeckModal from "@/components/features/NewDeck/NewDeckModal";
import useModal from "@/hooks/useModal";
import "./appbar.css";

/**
 * CustomAppBar component renders a responsive AppBar with a drawer toggle button,
 * breadcrumbs, and a set of action icons including a button to open a modal.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.handleDrawerToggle - Function to handle the drawer toggle action.
 * @param {number} props.drawerWidth - The width of the drawer.
 *
 * @returns {JSX.Element} The rendered CustomAppBar component.
 *
 * @example
 * <CustomAppBar handleDrawerToggle={handleDrawerToggle} drawerWidth={240} />
 *
 * @description
 * The CustomAppBar component adjusts its layout based on the screen width.
 * It displays a "New Deck" button which changes its text based on the screen width.
 * The AppBar contains a drawer toggle button, breadcrumbs, and icons for settings, notifications, and account menu.
 * It also includes a modal for creating a new deck.
 *
 */
const CustomAppBar = ({ handleDrawerToggle, drawerWidth }) => {
	const { width } = useWindowDimensions();
	const [buttonText, setButtonText] = useState("New Deck");
	const { modalOpen, openModal, closeModal } = useModal();

	// Update button text based on screen width
	useEffect(() => {
		if (width < 1000) {
			setButtonText("");
		} else {
			setButtonText("New Deck");
		}
	}, [width]);

	return (
		<AppBar
			position="fixed"
			sx={{
				width: { sm: `calc(${width}px - ${drawerWidth}px)` },
				ml: { sm: `${drawerWidth}px` },
				backgroundColor: "#F9FAFB",
				boxShadow: "none",
				borderBottom: 2,
				borderBottomColor: "rgba(0, 0, 0, 0.03)",
			}}
		>
			<div style={{ display: "flex", alignItems: "center" }}>
				<Toolbar
					className="toolbar-left"
					sx={{ width: { sm: `calc(0.5* (${width}px - ${drawerWidth}px))` } }}
				>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 0, display: { md: "none" }, color: "grey" }}
					>
						<MenuIcon />
					</IconButton>
					<IconBreadcrumbs />
				</Toolbar>

				<Toolbar
					className="toolbar-right"
					sx={{
						width: { sm: `calc(0.5* (${width}px - ${drawerWidth}px))` },
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
						padding: "0px",
						spaceBetween: "3px",
					}}
				>
					<CustomButton onClick={openModal} icon={<AddIcon />}>
						{buttonText}
					</CustomButton>
					{/*<IconButton
						color="inherit"
						aria-label="settings"
						edge="end"
						sx={{
							ml: 2,
							color: "#667085",
							display: { xs: "none", sm: "flex" },
						}}
					>
						<SettingsIcon />
					</IconButton>
					 <IconButton
						color="inherit"
						aria-label="notifications"
						edge="end"
						sx={{
							ml: 2,
							color: "#667085",
							display: { xs: "none", sm: "flex" },
						}}
					>
						<NotificationsIcon />
					</IconButton> */}
					<IconButton
						color="inherit"
						aria-label="account"
						edge="end"
						sx={{
							ml: 2,
							color: "#667085",
							display: { xs: "none", sm: "flex" },
						}}
					>
						<AccountMenu />
					</IconButton>
				</Toolbar>
				<NewDeckModal open={modalOpen} handleClose={closeModal} />
			</div>
		</AppBar>
	);
};

CustomAppBar.propTypes = {
	handleDrawerToggle: PropTypes.func.isRequired,
	drawerWidth: PropTypes.number.isRequired,
};

export default CustomAppBar;
