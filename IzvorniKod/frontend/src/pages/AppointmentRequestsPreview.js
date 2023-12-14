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

const AppointmentRequestsPreview = () => {
  const cellStyle3 = {
    textAlign: "center",
    border: "0.2em solid black",
    color: "white",
  };

  const searchIconStyle = {
    color: "blue",
  };

  return (
    <div className="main-container">
      <div className="header2">
        <div className="title-div3">
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
          className="pretraga"
          label="Pretraga"
          variant="outlined"
          name="pretraga"
        />
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="prviRed2">
              <TableCell style={cellStyle3}>Ime</TableCell>
              <TableCell style={cellStyle3}>Prezime</TableCell>
              <TableCell style={cellStyle3}>Željeni termin</TableCell>
              <TableCell style={cellStyle3}>Vrsta terapije</TableCell>
              <TableCell style={cellStyle3}>Napomene</TableCell>
              <TableCell style={cellStyle3}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AppointmentRequestsPreview;
