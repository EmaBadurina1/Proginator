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
      <p><span style={bolded}>Vrsta terapije:</span> {therapy.therapy_type.therapy_type_name}</p> 
      <p><span style={bolded}>Opis bolesti:</span> {therapy.disease_descr}</p> 
      <p><span style={bolded}>Zahtjevani postupak liječenja:</span> {therapy.req_treatment}</p> 
      <p><span style={bolded}>Datum početka:</span> {therapy.date_from}</p> 
      <p><span style={bolded}>Opis terapije:</span> {therapy.therapy_type.therapy_type_descr}</p> 
    </div>
  );
};

TherapyInfo.propTypes = {
  therapy: PropTypes.shape({
    therapy_type: PropTypes.shape({
      therapy_type_name: PropTypes.string,
      therapy_type_descr: PropTypes.string,
    }),
    disease_descr: PropTypes.string,
    req_treatment: PropTypes.string,
    date_from: PropTypes.string,
  }),
};

export default TherapyInfo;
