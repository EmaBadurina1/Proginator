import React from "react";
import "./PatientPreview.css";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  InputAdornment,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import TableCell from "@mui/material/TableCell";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
//import ForwardIcon from '@mui/icons-material/Forward';
import EmployeeService from "../services/employeeService";

const PatientPreview = () => {
  const cellStyle = {
    textAlign: "center",
  };

  const cellStyle2 = {
    textAlign: "center",
    border: "0.1em solid black",
  };

  const buttonStyle = {
    backgroundColor: "purple",
  };

  const searchIconStyle = {
    color: "blue",
  };

  const [searchInput, setSearchInput] = useState("");

  //test podatci
  const [patients, setPatients] = useState(null);

  useEffect(() => {
    EmployeeService.patientPreview();
    const patientData = EmployeeService.getCurrentPatientData();

    setPatients(patientData.data.patients);
    console.log(patientData);
  }, []);

  const onChangeSearch = (e) => {
    setSearchInput(e.target.value);
    getFilteredPatients(e.target.value);
  };

  const getFilteredPatients = (v) => {

    EmployeeService.patientPreview();
    const data = EmployeeService.getCurrentPatientData().data.patients;

    const filteredPatients = data.filter((patient) => {
      return (
        patient &&
        (
          patient.name.toLowerCase() +
          " " +
          patient.surname.toLowerCase()
        ).includes(v.toLowerCase())
      );
    });
    setPatients(filteredPatients);
  };

  return (
    <div className="main-container">
      <div className="header">
        <div className="title-div">
          <h2>Svi pacijenti</h2>
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
          className="pretraga"
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
            <TableRow className="prviRed">
              <TableCell style={cellStyle}>Ime</TableCell>
              <TableCell style={cellStyle}>Prezime</TableCell>
              <TableCell style={cellStyle}>MBO</TableCell>
              <TableCell style={cellStyle}>Datum rođenja</TableCell>
              <TableCell style={cellStyle}>E-mail adresa</TableCell>
              <TableCell style={cellStyle}>Broj telefona</TableCell>
              <TableCell style={cellStyle}>Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients &&
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell style={cellStyle2}>{patient.name}</TableCell>
                  <TableCell style={cellStyle2}>{patient.surname}</TableCell>
                  <TableCell style={cellStyle2}>{patient.MBO}</TableCell>
                  <TableCell style={cellStyle2}>
                    {patient.date_of_birth}
                  </TableCell>
                  <TableCell style={cellStyle2}>{patient.email}</TableCell>
                  <TableCell style={cellStyle2}>
                    {patient.phone_number}
                  </TableCell>
                  <TableCell style={cellStyle2}>
                    <div>
                      <Button
                        variant="contained"
                        size="medium"
                        className="reg-btn"
                        style={buttonStyle}
                      >
                        Prikaži termine
                      </Button>
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

export default PatientPreview;
