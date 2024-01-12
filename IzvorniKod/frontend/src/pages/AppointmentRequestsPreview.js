import { React, useEffect, useState } from "react";
import DataDisplay from "../components/DataDisplay";
import { TableCell, TableRow } from "@mui/material";
import "./AppointmentRequestsPreview.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AppointmentRequestsPreview = () => {
  const [data, setData] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
  }, [data]);

  return (
    <div>
      <div className="title-div5_1">
        <h2>Zahtjevi za termine - svi pacijenti</h2>
      </div>
      <DataDisplay
         url="/appointments" 
         setData={setData}
         tableHead={tableHead} 
      >
         { data !== null && data.data.appointments.map(appointment => (
            <TableRow 
              onClick={() => {
               if (appointment.status.status_id === 3 || appointment.status.status_id === 5) {
                  toast.error("Ne može se promijeniti propušten ili odrađen termin!", {
                    position: toast.POSITION.TOP_RIGHT,
                  });
               } else {
                  nav(`../change-appointment/${appointment.appointment_id}`)
               }
            }}
              key={appointment.appointment_id}
            >
               <TableCell>{appointment.therapy.patient.name}</TableCell>
               <TableCell>{appointment.therapy.patient.surname}</TableCell>
               <TableCell>{appointment.date_from}</TableCell>
               <TableCell>{appointment.therapy.therapy_type.therapy_type_name}</TableCell>
               <TableCell>{appointment.status && appointment.status.status_name}</TableCell>
            </TableRow>
         ))}
      </DataDisplay>
    </div>
  );
};

export default AppointmentRequestsPreview;

const tableHead = [
  {
     name: "Ime",
     orderBy: "name",
     align: "left"
  },
  {
     name: "Prezime",
     orderBy: "surname",
     align: "left"
  },
  {
     name: "Željeni termin",
     orderBy: "date_from",
     align: "left"
  },
  {
     name: "Vrsta terapije",
     orderBy: "therapy_type_name",
     align: "left"
  },
  {
     name: "Status termina",
     orderBy: "status_name",
     align: "left"
  }
]
