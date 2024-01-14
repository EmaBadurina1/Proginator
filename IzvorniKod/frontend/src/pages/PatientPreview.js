import { React, useEffect, useState } from "react";
import DataDisplay from "../components/DataDisplay";
import { TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./PatientPreview.css";

const PatientPreview = () => {
  //inicijalizacija varijabli
  const [data, setData] = useState(null);
  const nav = useNavigate();

  useEffect(() => {}, [data]);

  return (
    <div>
      <div className="title-div1_1">
        <h2>Svi pacijenti</h2>
      </div>
      <DataDisplay
        url="/patients" 
        setData={setData} 
        tableHead={tableHead} 
      >
        {data !== null &&
          data.data.patients.map((patient) => (
            <TableRow
              onClick={() => {nav(`/appointments-preview/${patient.user_id}`)}}
              key={patient.user_id}
            >
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.surname}</TableCell>
              <TableCell>{patient.MBO}</TableCell>
              <TableCell className="hide-sm">{patient.email}</TableCell>
              <TableCell className="hide-sm">{patient.phone_number}</TableCell>
            </TableRow>
          ))}
      </DataDisplay>
    </div>
  );
};

export default PatientPreview;

const tableHead = [
  {
    name: "Ime",
    orderBy: "name",
    align: "left",
    classes: "show-sm"
  },
  {
    name: "Prezime",
    orderBy: "surname",
    align: "left",
    classes: "show-sm"
  },
  {
    name: "MBO",
    orderBy: "MBO",
    align: "left",
    classes: "show-sm"
  },
  {
    name: "E-mail adresa",
    orderBy: "email",
    align: "left",
    classes: "hide-sm"
  },
  {
    name: "Broj telefona",
    orderBy: "phone_number",
    align: "left",
    classes: "hide-sm"
  },
];
