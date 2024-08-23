import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./tabselect.css";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className="tabPanel"
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ value, onTabChange, tabsData }) {
  return (
    <Box className="tabContainer">
      <Box className="tabHeader">
        <Tabs
          value={value}
          onChange={onTabChange}
          aria-label="basic tabs example"
          indicatorColor="none"
          textColor="inherit"
        >
          {tabsData.map((tab, index) => (
            <Tab
              label={tab.label}
              {...a11yProps(index)}
              className="tabLabel"
              key={index}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}

BasicTabs.propTypes = {
  value: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
  tabsData: PropTypes.array.isRequired,
};
