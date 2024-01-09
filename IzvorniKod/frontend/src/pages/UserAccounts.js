import React from "react";
import "./UserAccounts.css";
import DataDisplay from "../components/DataDisplay";
import Container from "@mui/material/Container";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const UserAccounts = () => {

   const nav = useNavigate();

   const handleAddUser = () => {
      nav("/add-users");
   }

  return (
    <Container maxWidth="lg">
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
              Korisnički računi
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: "end" }}>
            <Button
              key="addUserBtn"
              color="success"
              variant="contained"
              size="medium"
              className="mt-1"
              onClick={handleAddUser}
            >
              <AddIcon />
              Novi račun
            </Button>
          </Grid>
        </Grid>
        <DataDisplay
          url={"/employees"}
          columns={[
            "Ime",
            "Prezime",
            "OIB",
            "Datum rođenja",
            "E-mail",
            "Broj telefona",
            "Akcije",
          ]}
          options={[
            "name",
            "surname",
            "OIB",
            "date_of_birth",
            "email",
            "phone_number",
          ]}
          identificator={"user_id"}
          dataName="employees"
        />
      </Box>
    </Container>
  );
};

export default UserAccounts;
