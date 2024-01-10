import { React, useEffect, useState } from "react";
import DataDisplay from "../components/DataDisplay";
import { TableCell, TableRow } from "@mui/material";

const DataPreview = () => {
   const [data, setData] = useState(null);

   useEffect(() => {
   }, [data]);

   return (
      <DataDisplay
         url="/therapies"
         setData={setData}
         tableHead={tableHead}
      >
         { data !== null && data.data.therapies.map(therapy => (
            <TableRow key={therapy.therapy_id}>
               <TableCell>{therapy.date_from}</TableCell>
               <TableCell>{therapy.date_to}</TableCell>
               <TableCell>{therapy.disease_descr}</TableCell>
               <TableCell>{therapy.req_treatment}</TableCell>
            </TableRow>
         ))}
      </DataDisplay>
   );
}
 
export default DataPreview;

const tableHead = [
   {
      name: "Od",
      orderBy: "date_from",
      align: "left"
   },
   {
      name: "Do",
      orderBy: "date_to",
      align: "left"
   },
   {
      name: "Opis oboljenja",
      orderBy: "disease_descr",
      align: "left"
   },
   {
      name: "Zahtjevani tretman",
      orderBy: "req_treatment",
      align: "left"
   }
]