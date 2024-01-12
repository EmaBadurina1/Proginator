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

const AppointmentsPreview = () => {
  const [data, setData] = useState(null);
  const { patientId } = useParams();
  const url = `/appointments/by-patient/${patientId}`;
  const nav = useNavigate();
  const [patient, setPatient] = useState(null);

  const iconButtonStyle = {
    backgroundColor: "black",
    color: "white",
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const resp = await EmployeeService.getPatientById(patientId);
        if (resp.success) {
          setPatient(resp.data);
        } else {
          console.log("greska");
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
      <div className="iconButtonDiv2_1">
          <IconButton style={iconButtonStyle} onClick={() => nav("/patient-preview")}>
            <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
          </IconButton>
        </div>
      <div className="title-div2_1">

        <h2>
          Pacijent {patient && patient.name} {patient && patient.surname}
        </h2>
      </div>

      <DataDisplay url={url} setData={setData} tableHead={tableHead}>
        {data !== null &&
          data.data.appointments.map((appointment) => (
            <TableRow
              key={appointment.appointment_id}
              onClick={() => {
                if (appointment.status) {
                  if (appointment.status.status_id === 2) {
                    nav(`/attendance/${appointment.appointment_id}`);
                  } else if (
                    appointment.status.status_id === 3 ||
                    appointment.status.status_id === 4 ||
                    appointment.status.status_id === 5
                  ) {
                    nav(`/attendance-display/${appointment.appointment_id}`);
                  } else {
                    toast.error(
                      "Termin je na čekanju te još nije evidentiran!",
                      {
                        position: toast.POSITION.TOP_RIGHT,
                      }
                    );
                  }
                }
              }}
            >
              <TableCell>{appointment.date_from}</TableCell>
              <TableCell>
                {appointment.therapy.therapy_type.therapy_type_name}
              </TableCell>
              <TableCell>
                {appointment.employee &&
                  appointment.employee.name +
                    " " +
                    appointment.employee.surname}
              </TableCell>
              <TableCell>
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
  },
  {
    name: "Terapija",
    orderBy: "therapy_name",
    align: "left",
  },
  {
    name: "Doktor",
    orderBy: "surname",
    align: "left",
  },
  {
    name: "Ishod",
    orderBy: "status_name",
    align: "left",
  },
];
