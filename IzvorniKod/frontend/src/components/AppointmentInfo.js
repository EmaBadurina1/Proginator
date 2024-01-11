import { React } from "react";
import PropTypes from "prop-types";

const AppointmentInfo = (props) => {

  const bolded = {
    fontWeight: "bold",
    display: "inline"
  }

  const appointment = props.appointment;

  return (
    <div className="appointment-info">
      <p><p style={bolded}>IME PACIJENTA:</p> {appointment.therapy.patient.name} </p>
      <p><p style={bolded}>PREZIME PACIJENTA:</p> {appointment.therapy.patient.surname}  </p>
      <p><p style={bolded}>DATUM I VRIJEME:</p> {appointment.date_from} </p>
      
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
