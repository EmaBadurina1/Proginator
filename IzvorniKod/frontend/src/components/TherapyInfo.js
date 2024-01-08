import React from "react";
import PropTypes from "prop-types";


const therapyInfoStyle = {
  marginBottom: "2em",
};

const bolded = {
  fontWeight: "bold",
}

const TherapyInfo = (props) => {
  const therapy = props.therapy;

  return (
    <div className="therapy-info" style={therapyInfoStyle}>
      <h4>Informacije o terapiji</h4>
      <p><h7 style={bolded}>Vrsta terapije:</h7> {therapy.therapy_type.therapy_type_name}</p> 
      <p><h7 style={bolded}>Zahtjevani postupak liječenja:</h7> {therapy.req_treatment}</p> 
      <p><h7 style={bolded}>Datum početka:</h7> {therapy.date_from}</p> 
      <p><h7 style={bolded}>Opis:</h7> {therapy.therapy_type.therapy_type_descr}</p> 
      
      <br></br>
    </div>
  );
};

TherapyInfo.propTypes = {
  therapy: PropTypes.shape({
    therapy_type: PropTypes.shape({
      therapy_type_name: PropTypes.string,
      therapy_type_descr: PropTypes.string,
    }),
    req_treatment: PropTypes.string,
    date_from: PropTypes.string,
  }),
};

export default TherapyInfo;
