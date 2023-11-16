import "./Home.css";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const Home = ({ onLogout }) => {
  const nav = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    AuthService.logout().then(() => {
      onLogout();
      nav("/login");
      window.location.reload();
    });
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("user_data");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    }
  }, []);

  return (
    <div className="home">
      <h1>Proginator</h1>
      {userData ? (
        <div>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      ) : (
        <p>Korisnički podaci nisu nađeni!</p>
      )}
      <button
        type="submit"
        className="btn btn-primary w-auto"
        onClick={async (event) => await handleLogout(event)}
      >
        Odjava
      </button>
    </div>
  );
};

Home.propTypes = {
  onLogout: PropTypes.func,
};

export default Home;
