import React from "react";
import PropTypes from "prop-types";
import { DateTime } from "luxon";
import DataBox from "./DataBox";

const therapyInfoStyle = {
  marginBottom: "2em",
};

const TherapyInfo = (props) => {
  const therapy = props.therapy;

  return (
    <div className="therapy-info" style={therapyInfoStyle}>
      <h4>Informacije o terapiji</h4>
        <DataBox label="Vrsta" tooltip="Vrsta terapije" big={false}>
          {therapy.therapy_type
            ? therapy.therapy_type.therapy_type_name
            : "Nema vrste"}
        </DataBox>
        <DataBox
          label="Opis oboljenja"
          tooltip="Opis oboljenja pacijenta"
          big={false}
        >
          {therapy.disease_descr ? therapy.disease_descr : "Nema opisa"}
        </DataBox>
        <DataBox
          label="Zaht. tretman"
          tooltip="Zahtjevani postupak liječenja pacijenta"
          big={false}
        >
          {therapy.req_treatment
            ? therapy.req_treatment
            : "Nema zaht. tretmana"}
        </DataBox>
        <DataBox label="Datum" tooltip="Datum početka terapije" big={false}>
          {therapy.date_from
            ? DateTime.fromFormat(
                therapy.date_from,
                "EEE, dd LLL yyyy HH:mm:ss 'GMT'",
                { zone: "utc" }
              ).toFormat("dd.MM.yyyy.")
            : "Nema datuma"}
        </DataBox>
        <DataBox label="Opis terapije" tooltip="Opis terapije" big={false}>
          {therapy.therapy_type
            ? therapy.therapy_type.therapy_type_descr
            : "Nema opisa"}
        </DataBox>
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
