import React from "react";
import "./UserAccounts.css";
import DataDisplay from "../components/DataDisplay";
import Container from "@mui/material/Container";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TableRow, TableCell } from "@mui/material";
import UserDialog from "../components/UserDialog";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';

const UserAccounts = () => {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {}, [data]);

  const openDialog = (content) => {
    setContent(content);
    setOpen(true);
  };

  const formatDate = (inputString) => {
    const inputDate = new Date(inputString);
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  
    return inputDate.toLocaleDateString('hr-HR', options);
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          boxShadow: 2,
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h4"
              align="left"
              className="mb-2"
              gutterBottom
            >
              Djelatnici - korisnički računi
            </Typography>
          </Grid>
        </Grid>
        <DataDisplay
          url="/employees" // url from where to fetch data
          setData={setData} // function for setting data declared with useState() hook
          tableHead={tableHead} // array of objects representing table header
          buttonLabel="Novi račun" // text on button/link
          buttonUrl="/new-user" // link to adding new element page
        >
          {/* adding table rows as children to DataDisplay component */}
          {data !== null &&
            data.data.employees.map((employee) => (
              <TableRow
                key={employee.user_id}
                onClick={() => openDialog(employee)}
              >
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.surname}</TableCell>
                <TableCell className="hide-sm">{employee.OIB}</TableCell>
                <TableCell className="hide-sm">{formatDate(employee.date_of_birth)}</TableCell>
                <TableCell className="hide-sm">{employee.email}</TableCell>
                <TableCell className="hide-sm">{employee.phone_number}</TableCell>
                <TableCell className="hide-sm">{employee.is_admin ? "DA" : "NE"}</TableCell>
                <TableCell>{employee.is_active ? <CheckIcon/> : <RemoveCircleIcon/>}</TableCell>
              </TableRow>
            ))}
        </DataDisplay>
      </Box>
      {open && <UserDialog open={open} setOpen={setOpen} employee={content} />}
    </Container>
  );
};

export default UserAccounts;

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
    name: "OIB",
    orderBy: "OIB",
    align: "left",
    classes: "hide-sm" 
  },
  {
    name: "Datum rođenja",
    orderBy: "date_of_birth",
    align: "left",
    classes: "hide-sm" 
  },
  {
    name: "E-mail",
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
  {
    name: "Administrator?",
    orderBy: "is_admin",
    align: "left",
    classes: "hide-sm" 
  },
  {
    name: "Aktivan?",
    orderBy: "is_active",
    align: "left",
    classes: "show-sm" 
  },
];
