import React from "react";
import "./UserAccounts.css";
import DataDisplay from "../components/DataDisplay";
import Container from "@mui/material/Container";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const Rooms = () => {

   const nav = useNavigate();

   const handleAddRoom = () => {
      nav("/add-room");
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
              Popis soba
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: "end" }}>
            <Button
              key="addRoomBtn"
              color="success"
              variant="contained"
              size="medium"
              className="mt-1"
              onClick={handleAddRoom}
            >
              <AddIcon />
              Nova soba
            </Button>
          </Grid>
        </Grid>
        <DataDisplay
          url={"/rooms"}
          columns={[
            "Broj sobe",
            "Soba zauzeta",
            "Kapacitet sobe",
            "Akcije",
          ]}
          options={[
            "room_num",
            "in_use",
            "capacity",
          ]}
          identificator={"room_num"}
          dataName="rooms"
        />
      </Box>
    </Container>
  );
};

export default Rooms;
