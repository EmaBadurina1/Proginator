import React from "react";
import "./AppointmentRequestsPreview.css";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  InputAdornment,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import EmployeeService from "../services/employeeService";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const AppointmentRequestsPreview = () => {
  const [appointments, setAppointments] = useState(null);

  const cellStyle2 = {
    textAlign: "center",
    border: "0.1em solid black",
  };

  const cellStyle3 = {
    textAlign: "center",
    border: "0.2em solid black",
    color: "white",
  };

  const searchIconStyle = {
    color: "blue",
  };

  const buttonStyle3 = {
    backgroundColor: "orange",
    marginRight: "0.5em",
  };

  const buttonStyle4 = {
    backgroundColor: "red",
    marginLeft: "0.5em",
  };

  const odradjen = {
    color: "green",
    fontWeight: "bold",
  };
  const propusten = {
    color: "red",
    fontWeight: "bold",
  };

  const odradjenDiv = {
    verticalAlign: "middle",
    textAlign: "center",
    margin: "auto",
  };

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    EmployeeService.appointmentsPreview();
    const appointmentData = EmployeeService.getCurrentAppointmentData();
    setAppointments(appointmentData.data.appointments);
  }, []);

  const onChangeSearch = (e) => {
    setSearchInput(e.target.value);
    getFilteredAppointments(e.target.value);
  };

  const getFilteredAppointments = (v) => {
    EmployeeService.appointmentsPreview();
    const data = EmployeeService.getCurrentAppointmentData().data.appointments;

    const filteredAppointments = data.filter((appointment) => {
      return (
        appointment &&
        (
          appointment.therapy.patient.name.toLowerCase() +
          " " +
          appointment.therapy.patient.surname.toLowerCase()
        ).includes(v.toLowerCase())
      );
    });
    setAppointments(filteredAppointments);
  };

  return (
    <div className="main-container5_1">
      <div className="header5_1">
        <div className="title-div5_1">
          <h2>Zahtjevi za termine - svi pacijenti</h2>
        </div>
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon style={searchIconStyle} />
              </InputAdornment>
            ),
          }}
          autoComplete="false"
          className="pretraga5_1"
          label="Pretraga"
          variant="outlined"
          name="pretraga"
          onChange={(event) => onChangeSearch(event)}
          value={searchInput}
        />
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="prviRed5_1">
              <TableCell style={cellStyle3}>Ime</TableCell>
              <TableCell style={cellStyle3}>Prezime</TableCell>
              <TableCell style={cellStyle3}>Željeni termin</TableCell>
              <TableCell style={cellStyle3}>Vrsta terapije</TableCell>
              <TableCell style={cellStyle3}>Napomene</TableCell>
              <TableCell style={cellStyle3}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments &&
              appointments.map((appointment) => (
                <TableRow key={appointment.appointment_id}>
                  <TableCell style={cellStyle2}>
                    {appointment.therapy.patient.name}
                  </TableCell>
                  <TableCell style={cellStyle2}>
                    {appointment.therapy.patient.surname}
                  </TableCell>
                  <TableCell style={cellStyle2}>
                    {appointment.date_from}
                  </TableCell>
                  <TableCell style={cellStyle2}>
                    {appointment.therapy.therapy_type.therapy_type_name}
                  </TableCell>
                  <TableCell style={cellStyle2}>
                    {appointment.comment}
                  </TableCell>
                  <TableCell style={cellStyle2}>
                    {appointment.status.status_name !== "Odrađen" && 
                      appointment.status.status_name !== "Propušten" &&
                      appointment.status.status_name === "Na čekanju" && (
                        <div className="ev5_1">
                          {appointment.status.status_name}
                        </div>
                      )}
                    <div className="button-container5_1">
                      {appointment.status.status_name !== "Odrađen" && 
                      appointment.status.status_name !== "Propušten" &&
                        appointment.status.status_name === "Na čekanju" && (
                          <div>
                            <Link to={`/change-appointment/${appointment.appointment_id}`}>
                              <Button
                                variant="contained"
                                size="medium"
                                className="gumb5_1"
                                style={buttonStyle3}
                              >
                                Promijeni
                              </Button>
                            </Link>
                          </div>
                        )}
                      {appointment.status.status_name !== "Odrađen" && 
                      appointment.status.status_name !== "Propušten" &&
                        appointment.status.status_name === "Na čekanju" && (
                          <div>
                            <Link to={`/deny-appointment/${appointment.appointment_id}`}>
                              <Button
                                variant="contained"
                                size="medium"
                                className="gumb5_2"
                                style={buttonStyle4}
                              >
                                Odbij
                              </Button>
                            </Link>
                          </div>
                        )}
                    </div>
                    <div>
                      {appointment.status.status_name !== "Odrađen" &&
                        appointment.status.status_name !== "Propušten" &&
                        appointment.status.status_name !== "Na čekanju" && (
                          <div className="button-container2">
                            <div className="ev5_1">
                              {appointment.status.status_name}
                            </div>
                            <div>
                              <Link to={`/change-appointment/${appointment.appointment_id}`}>
                                <Button
                                  variant="contained"
                                  size="medium"
                                  className="gumb5_1"
                                  style={buttonStyle3}
                                >
                                  Promijeni
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}
                    </div>

                    <div style={odradjenDiv}>
                      {appointment.status.status_name === "Odrađen" && (
                        <p style={odradjen}>Odrađen</p>
                      )}
                      {appointment.status.status_name === "Propušten" && (
                        <p style={propusten}>Propušten</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AppointmentRequestsPreview;
