import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./tabselect.css";

/**
 * CustomTabPanel component renders the content of a tab panel.
 * It displays its children only when the `value` prop matches the `index` prop.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The content to be displayed inside the tab panel.
 * @param {number} props.value - The current value of the selected tab.
 * @param {number} props.index - The index of this tab panel.
 * @param {Object} [props.other] - Additional properties to be passed to the div element.
 *
 * @returns {JSX.Element} The rendered tab panel component.
 */
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

/**
 * Generates accessibility properties for a tab element.
 *
 * @param {number} index - The index of the tab.
 * @returns {Object} An object containing the id and aria-controls attributes for the tab.
 */
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/**
 * BasicTabs component renders a set of tabs using Material-UI's Tabs and Tab components.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.value - The currently selected tab index.
 * @param {function} props.onTabChange - Callback function to handle tab change events.
 * @param {Array} props.tabsData - Array of tab data objects, each containing a `label` property.
 *
 * @example
 * const tabsData = [
 *   { label: 'Tab 1' },
 *   { label: 'Tab 2' },
 *   { label: 'Tab 3' }
 * ];
 * const [value, setValue] = useState(0);
 *
 * const handleTabChange = (event, newValue) => {
 *   setValue(newValue);
 * };
 *
 * <BasicTabs value={value} onTabChange={handleTabChange} tabsData={tabsData} />
 *
 * @returns {JSX.Element} The rendered BasicTabs component.
 */
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
