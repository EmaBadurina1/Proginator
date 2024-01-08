import { React } from "react";
import PropTypes from "prop-types";

const AppointmentInfo = (props) => {

  const bolded = {
    fontWeight: "bold",
  }

  const appointment = props.appointment;

  return (
    <div className="appointment-info">
      <p><h7 style={bolded}>IME PACIJENTA:</h7> {appointment.therapy.patient.name} </p>
      <p><h7 style={bolded}>PREZIME PACIJENTA:</h7> {appointment.therapy.patient.surname}  </p>
      <p><h7 style={bolded}>DATUM I VRIJEME:</h7> {appointment.date_from} </p>
      
    </div>
  );
};

AppointmentInfo.propTypes = {
  appointment: PropTypes.shape({
    therapy: PropTypes.shape({
      patient: PropTypes.shape({
        name: PropTypes.string,
        surname: PropTypes.string,
      }),
    }),
    date_from: PropTypes.string,
  }),
};

export default AppointmentInfo;
