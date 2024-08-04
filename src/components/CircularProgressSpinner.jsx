import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Custom component combining CircularProgress and Typography to display progress with a label
function CircularProgressWithLabel(props) {
  return (
    // Container for positioning elements
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* Circular progress spinner */}
      <CircularProgress variant="determinate" {...props} sx={{ color: 'white' }} /> {/* Set color of spinner to white */}
      {/* Box for positioning label over the spinner */}
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Progress label */}
        <Typography variant="caption" component="div" color="white">
          {`${Math.round(props.value)}%`} {/* Display progress percentage */}
        </Typography>
      </Box>
    </Box>
  );
}

// PropTypes for the CircularProgressWithLabel component
CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

// Functional component to display CircularProgressWithLabel with a controlled progress value
export default function CircularWithValueLabel() {
  const [progress, setProgress] = React.useState(10);

  // Effect hook to simulate progress increment
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10)); // Increment progress value
    }, 900); // Interval for incrementing progress
    return () => {
      clearInterval(timer); // Cleanup function to clear interval
    };
  }, []); // Empty dependency array to run effect only once

  // Render CircularProgressWithLabel with the current progress value
  return <CircularProgressWithLabel value={progress} size={35} />; // Set the size of the CircularProgressWithLabel
}
