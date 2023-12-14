import React from "react";
import "./AppointmentsPreview.css";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EmployeeService from "../services/employeeService";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const AppointmentsPreview = () => {
  const { patientId } = useParams();
  const [appointments, setAppointments] = useState(null);
  const [patient, setPatient] = useState(null);

  const cellStyle3 = {
    textAlign: "center",
    border: "0.2em solid black",
    color: "white",
  };

  const cellStyle4 = {
    textAlign: "center",
    border: "0.1em solid black",
  };

  const buttonStyle = {
    backgroundColor: "purple",
  };

  useEffect(() => {
    EmployeeService.appointmentsPreview();
    const appointmentData = EmployeeService.getCurrentAppointmentData();
    const pom = appointmentData.data.appointments;
    const filtered = pom.filter((appointment) => {
      return appointment && appointment.therapy.patient.user_id == patientId;
    });
    setAppointments(filtered);

    EmployeeService.getPatientById(patientId);
    const pom2 = EmployeeService.getCurrentPatient();
    setPatient(pom2.data.patient);
  }, [patientId]);

  return (
    <div className="main-container">
      <div className="title-div">
        <h2>
          {patient && patient.name} {patient && patient.surname}
        </h2>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="prviRed2">
              <TableCell style={cellStyle3}>Datum i vrijeme</TableCell>
              <TableCell style={cellStyle3}>Terapija</TableCell>
              <TableCell style={cellStyle3}>Ishod</TableCell>
              <TableCell style={cellStyle3}>Akcija</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments &&
              appointments.map((appointment) => (
                <TableRow key={appointment.appointment_id}>
                  <TableCell style={cellStyle4}>
                    {appointment.date_from}
                  </TableCell>
                  <TableCell style={cellStyle4}>
                    {appointment.therapy.therapy_type.therapy_type_name}
                  </TableCell>

                  <TableCell style={cellStyle4}>
                    {appointment.status.status_name}
                  </TableCell>

                  <TableCell style={cellStyle4}>
                    {appointment.status.status_name === "Na čekanju" && (
                      <Link to="/attendance">
                        <Button
                          variant="contained"
                          size="medium"
                          className="reg-btn"
                          style={buttonStyle}
                        >
                          Evidentiraj
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AppointmentsPreview;
