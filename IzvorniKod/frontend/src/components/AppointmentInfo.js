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
      <p><span style={bolded}>IME PACIJENTA:</span> {appointment.therapy.patient.name} </p>
      <p><span style={bolded}>PREZIME PACIJENTA:</span> {appointment.therapy.patient.surname}  </p>
      <p><span style={bolded}>TRENUTNI DATUM I VRIJEME:</span> {appointment.date_from} </p>
      
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
