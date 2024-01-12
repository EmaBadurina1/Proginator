import { React } from "react";
import PropTypes from 'prop-types';
import "./DataBox.css";
import { Tooltip } from "@mui/material";

const DataBox = ({ children, label, tooltip, big }) => {
   let classes = big === false ? "data-box" : "data-box big"
   return (
      <Tooltip title={tooltip} className={classes} placement="top">
         <div className={classes}>
            <span>{children}</span>
            <div className="label">
               {label}
            </div>
         </div>
      </Tooltip>
   );
}

DataBox.propTypes = {
   children: PropTypes.node,
   label: PropTypes.string.isRequired,
   tooltip: PropTypes.string.isRequired,
   big: PropTypes.bool.isRequired
}

export default DataBox;