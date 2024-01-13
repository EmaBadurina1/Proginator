import React from "react";
import "./UserAccounts.css";
import DataDisplay from "../components/DataDisplay";
import Container from "@mui/material/Container";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TableRow, TableCell } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const UserAccounts = () => {
  const [data, setData] = useState(null);

  useEffect(() => {}, [data]);

  const nav = useNavigate();

  const handleDelete = async (id) => {
    console.log(id);
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
              align="start"
              className="mb-4"
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
              <TableRow key={employee.user_id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.surname}</TableCell>
                <TableCell>{employee.OIB}</TableCell>
                <TableCell>{employee.date_of_birth}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone_number}</TableCell>
                <TableCell>{employee.is_admin}</TableCell>
                <TableCell>{employee.is_active}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => nav(`/edit-user/${employee.user_id}`)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(employee.user_id)}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </DataDisplay>
      </Box>
    </Container>
  );
};

export default UserAccounts;

const tableHead = [
  {
    name: "Ime",
    orderBy: "name",
    align: "left",
  },
  {
    name: "Prezime",
    orderBy: "surname",
    align: "left",
  },
  {
    name: "OIB",
    orderBy: "OIB",
    align: "left",
  },
  {
    name: "Datum rođenja",
    orderBy: "date_of_birth",
    align: "left",
  },
  {
    name: "E-mail",
    orderBy: "email",
    align: "left",
  },
  {
    name: "Broj telefona",
    orderBy: "phone_number",
    align: "left",
  },
  {
    name: "Administrator?",
    orderBy: "is_admin",
    align: "left",
  },
  {
    name: "Aktivan?",
    orderBy: "is_active",
    align: "left",
  },
  {
    name: "Akcije",
    align: "center",
  },
];
