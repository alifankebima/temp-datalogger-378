import React from 'react'
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

interface CustomTabPanelProps {
  children: React.ReactNode,
  value: number,
  index: number,
}

const CustomTabPanel: React.FC<CustomTabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
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