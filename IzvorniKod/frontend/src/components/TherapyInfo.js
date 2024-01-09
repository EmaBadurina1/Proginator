import React from "react";
import PropTypes from "prop-types";


const therapyInfoStyle = {
  marginBottom: "2em",
};

const bolded = {
  fontWeight: "bold",
  display: "inline",
}

const TherapyInfo = (props) => {
  const therapy = props.therapy;

  return (
    <div className="therapy-info" style={therapyInfoStyle}>
      <h4>Informacije o terapiji</h4>
      <p><p style={bolded}>Vrsta terapije:</p> {therapy.therapy_type.therapy_type_name}</p> 
      <p><p style={bolded}>Zahtjevani postupak liječenja:</p> {therapy.req_treatment}</p> 
      <p><p style={bolded}>Datum početka:</p> {therapy.date_from}</p> 
      <p><p style={bolded}>Opis:</p> {therapy.therapy_type.therapy_type_descr}</p> 
      
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
