import { React } from "react";
import "./ChangeAppointment.css";
import AppointmentInfo from "../components/AppointmentInfo";
import TherapyInfo from "../components/TherapyInfo";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const ChangeAppointment = () => {
  const iconButtonStyle = {
    backgroundColor: "black",
    color: "white",
    float: "left",
  };

  const buttonStyle = {
    backgroundColor: "orange",
    float: "right",
    marginRight: "5em",
    marginBottom: "2em",
  };

  const komentarStyle = {
    marginTop: "0.8em",
    width: "60%",
  };

  return (
    <div className="container-div2">
      <div className="iconButtonDiv2">
        <IconButton style={iconButtonStyle}>
          <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
        </IconButton>
      </div>
      <div className="mini-container3">
        <div className="title-div3">
          <h2>Odbijanje zahtjeva za terminom</h2>
        </div>
        <div className="border-container2">
          <div className="big-div1">
            <div className="mid-div1">
              <AppointmentInfo />
            </div>
            <div className="mid-div2">
              <TherapyInfo />
            </div>
          </div>
          <div className="big-div2">
            Komentar za pacijenta:
            <br></br>
            <TextField
              autoComplete="false"
              className="komentar-text"
              label="Komentar"
              variant="outlined"
              name="komnetar"
              style={komentarStyle}
            />
          </div>
          <div className="button-div">
            <Button
              variant="contained"
              size="medium"
              className="reg-btn"
              style={buttonStyle}
            >
              Premjesti
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAppointment;
