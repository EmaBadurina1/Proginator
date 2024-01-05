import { React } from "react";

const therapyInfoStyle = {
  marginBottom: "2em",
};

const TherapyInfo = () => {
  return (
    <div className="therapy-info" style={therapyInfoStyle}>
      <h4>Informacije o terapiji</h4>
      Vrsta terapije:
      <br></br>
      Zahtjevani postupak liječenja:
      <br></br>
      Datum početka:
      <br></br>
      Opis:
      <br></br>
    </div>
  );
};

export default TherapyInfo;
