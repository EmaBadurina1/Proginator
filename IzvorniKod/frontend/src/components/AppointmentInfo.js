import { React } from "react";
import PropTypes from "prop-types";
import { DateTime } from "luxon";
import DataBox from "./DataBox";

const AppointmentInfo = (props) => {
  const appointmentInfoStyle = {
    marginBottom: "2em",
  };

  const appointment = props.appointment;

  return (
    <div className="appointment-info" style={appointmentInfoStyle}>
        <DataBox label="Ime" tooltip="Ime pacijenta" big={false}>
          {appointment.therapy.patient
            ? appointment.therapy.patient.name
            : "Nema pacijenta"}
        </DataBox>
        <DataBox label="Prezime" tooltip="Prezime pacijenta" big={false}>
          {appointment.therapy.patient
            ? appointment.therapy.patient.surname
            : "Nema pacijenta"}
        </DataBox>
        <DataBox
          label="Datum i vrijeme"
          tooltip="Datum i vrijeme termina"
          big={false}
        >
          {appointment.date_from
            ? DateTime.fromFormat(
                appointment.date_from,
                "EEE, dd LLL yyyy HH:mm:ss 'GMT'",
                { zone: "utc" }
              ).toFormat("dd.MM.yyyy. HH:mm")
            : "Nema datuma"}
        </DataBox>
        <DataBox label="Doktor" tooltip="Ime i prezime doktora" big={false}>
          {appointment.employee
            ? appointment.employee.name + " " + appointment.employee.surname
            : "Nema doktora"}
        </DataBox>
      <DataBox label="Status" tooltip="status termina" big={false}>
        {appointment.status ? appointment.status.status_name : "Nema statusa"}
      </DataBox>
      <DataBox label="Soba" tooltip="Soba termina" big={false}>
        {appointment.room ? appointment.room.room_num : "Nema sobe"}
      </DataBox>
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
