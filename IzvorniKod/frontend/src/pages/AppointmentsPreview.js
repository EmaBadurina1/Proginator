import { React, useEffect, useState } from "react";
import DataDisplay from "../components/DataDisplay";
import { TableCell, TableRow } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { toast } from "react-toastify";
import "./AppointmentsPreview.css";

const AppointmentsPreview = () => {
  const [data, setData] = useState(null);
  const { patientId } = useParams();
  const url = `/appointments/by-patient/${patientId}`;
  const nav = useNavigate();
  const [patient, setPatient] = useState(null);

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
      <div className="title-div2_1">
        <h2>
          Pacijent {patient && patient.name} {patient && patient.surname}
        </h2>
      </div>
      <DataDisplay
        url={url} // url from where to fetch data
        setData={setData} // function for setting data declared with useState() hook
        tableHead={tableHead} // array of objects representing table header
        //buttonLabel="Dodaj terapiju" // text on button/link
        //buttonUrl="/home" // link to adding new element page
      >
        {/* adding table rows as children to DataDisplay component */}
        {data !== null &&
          data.data.appointments.map((appointment) => (
            <TableRow
              key={appointment.appointment_id}
              onClick={() => {
                if (appointment.status) {
                  if (appointment.status.status_id === 2) {
                    nav(`/attendance/${appointment.appointment_id}`);
                  } else {
                    nav(`/attendance-display/${appointment.appointment_id}`);
                  }
                }
              }}
            >
              <TableCell>{appointment.therapy.date_from}</TableCell>
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
