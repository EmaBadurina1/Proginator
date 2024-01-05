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
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
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
    <div className="container">
      <h2>
        Pacijent {appointment && appointment.comment} - evidencija
        dolaska na terapiju
      </h2>
      <div className="mini-container">
        <div className="big-div1">
          <div className="mid-div1">
            <div className="small-div1">
              <FormControl>
                <FormLabel id="blabla">Evidencija</FormLabel>
                <RadioGroup aria-labelledby="blabla" defaultValue="nijeDosao">
                  <FormControlLabel
                    value="nijeDosao"
                    control={<Radio />}
                    label="Pacijent nije došao na dogovoreni termin"
                  />
                  <FormControlLabel
                    value="dosaoINijeOdradio"
                    control={<Radio />}
                    label="Pacijent je došao, ali nije uspješno odradio terapiju"
                  />
                  <FormControlLabel
                    value="odradio"
                    control={<Radio />}
                    label="Pacijent je uspješno odradio terapiju"
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
                label="Soba"
                variant="outlined"
                name="soba"
                style={textInputStyle}
              />
            </div>
            <div className="small-div3">
              Korištena oprema:
              <br></br>
              <TextField
                autoComplete="false"
                className="oprema-text"
                label="Korištena oprema"
                variant="outlined"
                name="korištena oprema"
                style={textInputStyle}
              />
            </div>
          </div>
          <div className="mid-div2">
            <TherapyInfo />
          </div>
        </div>
        <div className="big-div2">
          Komentari:
          <br></br>
          <TextareaAutosize
            style={komentarStyle}
            minRows={4}
            className="komentar-text"
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
