import { React } from "react";
import "./DenyAppointment.css";
import TherapyInfo from "../components/TherapyInfo";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import AppointmentInfo from "../components/AppointmentInfo";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

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
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      await EmployeeService.getAppointmentById(appointmentId).then((resp) => {
        if (resp.success) {
          EmployeeService.getAppointmentById(appointmentId);
          const pom = EmployeeService.getCurrentAppointment();
          setAppointment(pom.data.appointment);
        } else {
          console.log("greska");
        }
      });
    };
    fetchAppointment();
  }, [appointmentId]);

  return (
    <div className="container-div">
      <div className="iconButtonDiv">
        <IconButton style={iconButtonStyle}>
          <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
        </IconButton>
      </div>
      <div className="mini-container2">
        <div className="title-div2">
          <h2>Odbijanje zahtjeva za terminom</h2>
        </div>
        <div className="border-container">
          <div className="big-div1">
            <div className="mid-div1">
              {appointment && appointment.therapy && (
                <AppointmentInfo appointment={appointment} />
              )}
            </div>
            <div className="mid-div2">
              {appointment && appointment.therapy && (
                <TherapyInfo therapy={appointment.therapy} />
              )}
            </div>
          </div>
          <div className="big-div2" style={komentarDivStyle}>
            <TextField
              autoComplete="false"
              className="komentar-text"
              label="Komentar za pacijenta"
              variant="outlined"
              name="komentar"
              multiline
              rows={4}
              style={komentarStyle}
            />
          </div>
          <div className="button-div-container">
            <div className="button-div1">
              <Link to={`/change-appointment/${appointmentId}`}>
                <Button
                  variant="contained"
                  size="medium"
                  className="reg-btn"
                  style={buttonStyle1}
                >
                  Premjesti ovaj termin
                </Button>
              </Link>
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
