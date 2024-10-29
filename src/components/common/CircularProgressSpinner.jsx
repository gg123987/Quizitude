import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const CircularProgressSpinner = ({ value }) => {
  // Clamp the value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={clampedValue}
        aria-valuenow={clampedValue}
        aria-valuemax={100}
        aria-valuemin={0}
        color="white"
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="white">
          {`${Math.round(clampedValue)}%`} {/* Display progress percentage */}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressSpinner;
