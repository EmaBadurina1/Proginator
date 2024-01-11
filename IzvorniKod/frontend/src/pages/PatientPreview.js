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
import EmployeeService from "../services/employeeService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PatientPreview = () => {

  const [searchInput, setSearchInput] = useState("");
  const [patients, setPatients] = useState(null);

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

  const fetchPatients = async () => {
    try {
      const resp = await EmployeeService.patientPreview();
      if (resp.success) {
        setPatients(resp.data);
        return resp.data;
      } else {
        console.error("greska", resp.message);
        return false;
      }
    } catch(err) {
      toast.error(`API Error:${err.response.data}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const onChangeSearch = (e) => {
    setSearchInput(e.target.value);
    getFilteredPatients(e.target.value);
  };

  const getFilteredPatients = (v) => {

    fetchPatients().then((data) => {
  
      const filteredPatients = data.filter((patient) => {
        return (
          patient &&
          (patient.name.toLowerCase() +
            " " +
            patient.surname.toLowerCase()).includes(v.toLowerCase())
        );
      });
  
      setPatients(filteredPatients);
    });
  };

  return (
    <div className="main-container1_1">
      <div className="header1_1">
        <div className="title-div1_1">
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
            <TableRow className="prviRed1_1">
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
                <TableRow key={patient.user_id}>
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
                      <Link to={`/appointments-preview/${patient.user_id}`}>
                        <Button
                          variant="contained"
                          size="medium"
                          className="gumb1_1"
                          style={buttonStyle}
                        >
                          Prikaži termine
                        </Button>
                      </Link>
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
