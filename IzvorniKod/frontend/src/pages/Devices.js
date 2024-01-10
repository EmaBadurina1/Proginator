import React from "react";
import "./UserAccounts.css";
import DataDisplay from "../components/DataDisplay";
import Container from "@mui/material/Container";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const Devices = () => {

   const nav = useNavigate();

   const handleAddDevice = () => {
      nav("/add-device");
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
              Popis opreme
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: "end" }}>
            <Button
              key="addDeviceBtn"
              color="success"
              variant="contained"
              size="medium"
              className="mt-1"
              onClick={handleAddDevice}
            >
              <AddIcon />
              Novi uređaj
            </Button>
          </Grid>
        </Grid>
        <DataDisplay
          url={"/devices"}
          columns={[
            "Broj sobe",
            "Soba zauzeta",
            "Kapacitet sobe",
            "Tip uređaja",
            "Opis uređaja",
            "Akcije",
          ]}
          options={[
            "room.room_num",
            "room.in_use",
            "room.capacity",
            "device_type.device_type_name",
            "device_type.device_type_descr",
          ]}
          identificator={"device_id"}
          dataName="devices"
        />
      </Box>
    </Container>
  );
};

export default Devices;
