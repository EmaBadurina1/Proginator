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
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const AppointmentsPreview = () => {
  const { patientId } = useParams();
  const [appointments, setAppointments] = useState(null);
  const [patient, setPatient] = useState(null);
  const nav = useNavigate();

  const iconButtonStyle = {
    backgroundColor: "black",
    color: "white",
    float: "left",
  };

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

  const buttonStyle2 = {
    backgroundColor: "rgb(80, 49, 100)",
  };

  useEffect(() => {
    const fetchAppointmentsByPatient = async () => {
      try {
        const resp = await EmployeeService.getAppointmentsByPatient(patientId);
        if (resp.success) {
          const appointmentData =
            EmployeeService.getCurrentAppointmentDataByPatient();
          const pom = appointmentData.data.appointments;
          const filtered = pom.filter((appointment) => {
            return (
              appointment && appointment.status.status_name !== "Na čekanju"
            );
          });
          setAppointments(filtered);
        } else {
          console.log("greska");
        }
      } catch (err) {
        toast.error("Greska!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    const fetchPatient = async () => {
      try {
        const resp = await EmployeeService.getPatientById(patientId);
        if (resp.success) {
          const pom2 = EmployeeService.getCurrentPatient();
          setPatient(pom2.data.patient);
        } else {
          console.log("greska");
        }
      } catch (err) {
        toast.error("Greska!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    fetchPatient();
    fetchAppointmentsByPatient();
  }, [patientId]);

  useEffect(() => {
    //console.log(appointments);
  }, [appointments]);

  return (
    <div className="main-container2_1">
      <div className="iconButtonDiv2_1">
        <IconButton style={iconButtonStyle}
        onClick={() => nav("../patient-preview")}>
          <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
        </IconButton>
      </div>
      <div className="mini-container2_1">
        <div className="title-div2_1">
          <h2>
            {patient && patient.name} {patient && patient.surname}
          </h2>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="prviRed2_1">
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
                      {appointment.status.status_name === "Zakazan" && (
                        <Link to={`/attendance/${appointment.appointment_id}`}>
                          <Button
                            variant="contained"
                            size="medium"
                            className="gumb2_1"
                            style={buttonStyle}
                          >
                            Evidentiraj
                          </Button>
                        </Link>
                      )}
                      {appointment.status.status_name !== "Zakazan" && (
                        <div>
                          <div className="ev2_1">EVIDENTIRANO</div>
                          <div>
                            <Link
                              to={`/attendance-display/${appointment.appointment_id}`}
                            >
                              <Button
                                variant="contained"
                                size="medium"
                                className="gumb2_2"
                                style={buttonStyle2}
                              >
                                Prikaži evidenciju
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AppointmentsPreview;
