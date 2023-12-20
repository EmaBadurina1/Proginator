import "./Home.css";
import React, { useEffect, useState } from "react";

const Home = () => {
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
    </div>
  );
};

export default Home;
