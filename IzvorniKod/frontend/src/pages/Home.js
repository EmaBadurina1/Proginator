import { Container, Typography } from "@mui/material";
import "./Home.css";
import React from "react";
import Grid from "@mui/material/Grid";

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2" sx={{marginTop:"10rem"}}>Dobrodošli!</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" fontStyle="italic" className="blockquote-footer" sx={{textAlign:"center"}} gutterBottom>
            Grupa Proginator
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
