import { React } from "react";
import "./AttendanceDisplay.css";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
//import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import TherapyInfo from "../components/TherapyInfo";
import { useParams } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { useEffect, useState } from "react";

const buttonStyle = {
  backgroundColor: "purple",
  marginLeft: "auto",
  marginRight: "4em",
  marginBottom: "1em",
  display: "block",
};

const textInputStyle = {
  marginTop: "0.5em",
};

const komentarStyle = {
  width: "70%",
};

const AttendanceDisplay = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");


  useEffect(() => {
    const fetchAppointment = async () => {
      await EmployeeService.getAppointmentById(appointmentId).then((resp) => {
        if (resp.success) {
          const pom = EmployeeService.getCurrentAppointment();
          setAppointment(pom.data.appointment);
          setSelectedStatus(pom.data.appointment.status.status_name);
        } else {
          console.log("greska");
        }
      });
    };
    fetchAppointment();
    console.log(appointment);
  }, [appointmentId, appointment]);



  return (
    <div className="container">
      <h2>
        Pacijent {appointment && appointment.therapy.patient.name}{" "}
        {appointment && appointment.therapy.patient.surname} - evidencija
        dolaska na termin
      </h2>
      <div className="mini-container">
        <div className="big-div1">
          <div className="mid-div1">
            <div className="small-div1">
              <FormControl
              disabled
              >
                <FormLabel id="blabla">Evidencija</FormLabel>
                <RadioGroup 
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                >
                  <FormControlLabel
                    value="Odrađen"
                    control={<Radio />}
                    label="Termin je odrađen"
                  />
                  <FormControlLabel
                    value="Propušten"
                    control={<Radio />}
                    label="Termin je propušten"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="small-div2">
              Soba:
              <br></br>
              <TextField
                autoComplete="false"
                className="soba-text"
                label={appointment && appointment.status.status_name !== "Otkazan" 
                ? appointment.room.room_num : '/'}
                variant="outlined"
                name="soba"
                style={textInputStyle}
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </div>
          </div>
          <div className="mid-div2">
            {appointment && appointment.therapy && (
              <TherapyInfo therapy={appointment.therapy} />
            )}
          </div>
        </div>
        <div className="big-div2">
          Komentari:
          <br></br>
          <TextField
            autoComplete="false"
            className="komentar-text"
            label={appointment && appointment.status.status_name !== "Otkazan" 
            ? appointment.comment : '/'}
            variant="outlined"
            name="korištena oprema"
            multiline
            rows={4}
            style={komentarStyle}
            InputProps={{
              readOnly: true,
            }}
            disabled
          />
        </div>

        <Button
          variant="contained"
          size="medium"
          className="reg-btn"
          style={buttonStyle}
        >
          Predaj evidenciju
        </Button>
      </div>
    </div>
  );
};

export default AttendanceDisplay;
