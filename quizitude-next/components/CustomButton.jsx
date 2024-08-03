import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const CustomButton = ({ children, icon, ...props }) => {
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
        ...props.style // Allow additional custom styles
      }}
    >
      {icon && <span style={{ marginRight: "5px" }}>{icon}</span>}
      <Typography variant="button" sx={{ mr: children ? '5px' : '-3px', fontFamily: "Inter", fontSize: "0.9rem", textTransform: 'none' }}>
        {children} {/* Button label */}
      </Typography>
    </Button>
  );
};

export default CustomButton;