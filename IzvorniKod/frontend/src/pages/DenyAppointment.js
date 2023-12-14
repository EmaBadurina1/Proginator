import { React } from "react";
import "./DenyAppointment.css";
import TherapyInfo from "../components/TherapyInfo";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import AppointmentInfo from "../components/AppointmentInfo";

const komentarStyle = {
  width: "100%",
};
const komentarDivStyle = {
  marginLeft: "auto",
  marginRight: "2em",
  width: "40%",
  marginBottom: "2em",
};
const buttonStyle1 = {
  backgroundColor: "orange",
  width: "18em",
  float: "left",
  marginLeft: "2em",
};
const buttonStyle2 = {
  backgroundColor: "gray",
  width: "8em",
  float: "left",
};
const buttonStyle3 = {
  backgroundColor: "blue",
  marginRight: "2em",
  marginLeft: "auto",
  float: "right",
};
const iconButtonStyle = {
  backgroundColor: "black",
  color: "white",
  float: "left",
};

const DenyAppointment = () => {
  return (
    <div className="container-div">
      <div className="iconButtonDiv">
        <IconButton style={iconButtonStyle}>
          <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
        </IconButton>
      </div>
      <div className="mini-container">
        <div className="title-div2">
          <h2>Odbijanje zahtjeva za terminom</h2>
        </div>
        <div className="border-container">
          <div className="big-div1">
            <div className="mid-div1">
              <AppointmentInfo />
            </div>
            <div className="mid-div2">
              <TherapyInfo />
            </div>
          </div>
          <div className="big-div2" style={komentarDivStyle}>
            Komentar za pacijenta:
            <br></br>
            <TextareaAutosize
              style={komentarStyle}
              minRows={7}
              className="komentar-text"
            />
          </div>
          <div className="button-div-container">
            <div className="button-div1">
              <Button
                variant="contained"
                size="medium"
                className="reg-btn"
                style={buttonStyle1}
              >
                Premjesti ovaj termin
              </Button>
            </div>
            <div className="button-div2">
              <Button
                variant="contained"
                size="medium"
                className="reg-btn"
                style={buttonStyle2}
              >
                Odustani
              </Button>
              <Button
                variant="contained"
                size="medium"
                className="reg-btn"
                style={buttonStyle3}
              >
                Potvrdi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DenyAppointment;
