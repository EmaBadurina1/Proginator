import { React } from "react";
import PropTypes from "prop-types";
import { DateTime } from "luxon";

const AppointmentInfo = (props) => {
  const bolded = {
    fontWeight: "bold",
    display: "inline",
  };

  const appointment = props.appointment;

  return (
    <div className="appointment-info">
      <p>
        <span style={bolded}>IME PACIJENTA:</span>{" "}
        {appointment.therapy.patient.name}{" "}
      </p>
      <p>
        <span style={bolded}>PREZIME PACIJENTA:</span>{" "}
        {appointment.therapy.patient.surname}{" "}
      </p>
      <p>
        <span style={bolded}>DATUM I VRIJEME TERMINA:</span>{" "}
        {DateTime.fromFormat(
          appointment.date_from,
          "EEE, dd LLL yyyy HH:mm:ss 'GMT'",
          { zone: "utc" }
        ).toFormat("dd.MM.yyyy. HH:mm")}{" "}
      </p>
      <p>
        <span style={bolded}>DOKTOR: </span>{" "}
        {appointment && appointment.employee && appointment.employee.name}{" "}
        {appointment && appointment.employee && appointment.employee.surname}
      </p>
      <p>
        <span style={bolded}>STATUS TERMINA: </span>{" "}
        {appointment && appointment.status && appointment.status.status_name}
      </p>
      <p>
        <span style={bolded}>SOBA: </span>{" "}
        {appointment && appointment.room && appointment.room.room_num}
      </p>
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
    comment: PropTypes.string,
    employee: PropTypes.shape({
      name: PropTypes.string,
      surname: PropTypes.string,
    }),
    status: PropTypes.shape({
      status_name: PropTypes.string,
    }),
    room: PropTypes.shape({
      room_num: PropTypes.string,
    }),
  }),
};

export default AppointmentInfo;
