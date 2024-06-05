import React from 'react'
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

interface CustomTabPanelProps {
  children: React.ReactNode,
  value: number,
  index: number,
  className?: string
}

const CustomTabPanel: React.FC<CustomTabPanelProps> = ({ children, value, index,  className, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={className}
      {...other}
    >
      {value === index && (
        <Box sx={{ m: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default CustomTabPanel