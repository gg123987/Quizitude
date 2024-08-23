import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";

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
          textAlign: 'center',
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
