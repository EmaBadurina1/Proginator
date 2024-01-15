import { React, useEffect, useState } from "react";
import DataDisplay from "../components/DataDisplay";
import { TableCell, TableRow } from "@mui/material";
import "./AppointmentRequestsPreview.css";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { toast } from "react-toastify";

const AppointmentRequestsPreview = () => {
  //inicijalizacija varijabli
  const [data, setData] = useState(null);
  const nav = useNavigate();

  useEffect(() => {}, [data]);

  return (
    <div>
      <div className="title-div5_1">
        <h2>Neevidentirani termini - svi pacijenti</h2>
      </div>
      <DataDisplay
        url="/appointments/active"
        setData={setData}
        tableHead={tableHead}
        buttonRemove={true}
      >
        {data !== null &&
          data.data.appointments.map((appointment) => (
            <TableRow
              onClick={() => {
                if (appointment.status) {
                  nav(`../appointment-options/${appointment.appointment_id}`);
                } else {
                  toast.error("Greska!", {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
              }}
              key={appointment.appointment_id}
            >
              <TableCell>{appointment.therapy.patient.name}</TableCell>
              <TableCell>{appointment.therapy.patient.surname}</TableCell>
              <TableCell>
                {DateTime.fromFormat(
                  appointment.date_from,
                  "EEE, dd LLL yyyy HH:mm:ss 'GMT'",
                  { zone: "utc" }
                ).toFormat("dd.MM.yyyy. HH:mm")}
              </TableCell>
              <TableCell className="hide-sm">
                {appointment.therapy.therapy_type.therapy_type_name}
              </TableCell>
              <TableCell className="hide-sm">
                {appointment.status && appointment.status.status_name}
              </TableCell>
            </TableRow>
          ))}
      </DataDisplay>
    </div>
  );
};

export default AppointmentRequestsPreview;

const tableHead = [
  {
    name: "Ime",
    orderBy: "name",
    align: "left",
    classes: "show-sm",
  },
  {
    name: "Prezime",
    orderBy: "surname",
    align: "left",
    classes: "show-sm",
  },
  {
    name: "Datum i vrijeme",
    orderBy: "date_from",
    align: "left",
    classes: "show-sm",
  },
  {
    name: "Vrsta terapije",
    orderBy: "therapy_id",
    align: "left",
    classes: "hide-sm",
  },
  {
    name: "Status termina",
    orderBy: "status_id",
    align: "left",
    classes: "hide-sm",
  },
];
