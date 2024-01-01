import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";

const Layout = ({ children, onLogout }) => {
  return (
    <div>
      <Header onLogout={onLogout}></Header>
      {children}
      
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Layout;