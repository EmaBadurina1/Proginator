import { React, useEffect, useState } from "react";
import DataDisplay from "../components/DataDisplay";
import { TableCell, TableRow } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { toast } from "react-toastify";
import "./AppointmentsPreview.css";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { DateTime } from "luxon";

const AppointmentsPreview = () => {
  //inicijalizacija varijabli
  const [data, setData] = useState(null);
  const { patientId } = useParams();
  const url = `/appointments/by-patient/${patientId}`;
  const nav = useNavigate();
  const [patient, setPatient] = useState(null);

  //stilovi
  const iconButtonStyle = {
    backgroundColor: "black",
    color: "white",
  };

  //fetchanje pacijenta pri renderu
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const resp = await EmployeeService.getPatientById(patientId);
        if (resp.success) {
          setPatient(resp.data);
        } else {
          toast.error("Greska!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (err) {
        toast.error(`API Error:${err.response.data}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    fetchPatient();
  }, [data, patientId]);

  return (
    <div>
      <div className="button-title-div">
        <div className="iconButtonDiv2_1">
          <IconButton style={iconButtonStyle} onClick={() => nav(-1)}>
            <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
          </IconButton>
        </div>
        <div className="title-div2_1">
          <h2>
            Pacijent {patient && patient.name} {patient && patient.surname}
          </h2>
        </div>
      </div>
      <DataDisplay url={url} setData={setData} tableHead={tableHead}>
        {data !== null &&
          data.data.appointments.map((appointment) => (
            <TableRow
              key={appointment.appointment_id}
              onClick={() => {
                if (appointment.status) {
                  nav(`/appointment-options/${appointment.appointment_id}`);
                } else {
                  toast.error("Greska!", {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
              }}
            >
              <TableCell>
                {DateTime.fromFormat(
                  appointment.date_from,
                  "EEE, dd LLL yyyy HH:mm:ss 'GMT'",
                  { zone: "utc" }
                ).toFormat("dd.MM.yyyy. HH:mm")}
              </TableCell>
              <TableCell>
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

export default AppointmentsPreview;

const tableHead = [
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
    classes: "show-sm",
  },
  {
    name: "Status termina",
    orderBy: "status_id",
    align: "left",
    classes: "hide-sm",
  },
];
