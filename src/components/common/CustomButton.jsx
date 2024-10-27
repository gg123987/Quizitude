import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";

/**
 * CustomButton component renders a styled button with optional icon and text.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the button.
 * @param {React.ReactNode} [props.icon] - Optional icon to be displayed alongside the button text.
 * @param {string} [props.fontSize="0.9rem"] - The font size of the button text.
 * @param {Object} [props.style] - Additional custom styles to be applied to the button.
 * @param {Object} [props.rest] - Any other props to be passed to the Button component.
 *
 * @example
 * // Usage example:
 * <CustomButton icon={<SomeIcon />} fontSize="1rem" onClick={handleClick}>
 *   Click Me
 * </CustomButton>
 *
 * @returns {JSX.Element} A styled button component with optional icon and text.
 */
const CustomButton = ({ children, icon, fontSize = "0.9rem", ...props }) => {
  return (
    <Button
      {...props}
      style={{
        backgroundColor: "#3538CD",
        fontFamily: "Inter",
        color: "white",
        borderRadius: "8px",
        minWidth: "auto", // Allow width adjustment based on content
        display: "flex", // Ensure flexbox behavior
        alignItems: "center", // Align content vertically
        justifyContent: "center", // Center content horizontally
        ...props.style, // Allow additional custom styles
      }}
    >
      {icon && <span style={{ marginRight: "5px" }}>{icon}</span>}
      <Typography
        variant="button"
        sx={{
          mr: children ? "5px" : "-3px",
          fontFamily: "Inter",
          fontSize,
          textAlign: "center",
          textTransform: "none",
          margin: 0,
        }}
      >
        {children} {/* Button label */}
      </Typography>
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  fontSize: PropTypes.string,
  style: PropTypes.object,
};

export default CustomButton;
