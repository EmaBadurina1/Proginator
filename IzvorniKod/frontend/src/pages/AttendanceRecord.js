import { React } from "react";
import "./AttendanceRecord.css";
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
import { Link } from "react-router-dom";

const buttonStyle = {
  backgroundColor: "purple",
  marginLeft: "auto",
  marginRight: "4em",
  marginBottom: "1em",
  display: "block",
};

const komentarStyle = {
  width: "70%",
};

const AttendanceRecord = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [comment, setComment] = useState(null);
  const [statusId, setStatusId] = useState(null);

  const updateAppointment = async () =>  {
    console.log("Status Id:", statusId);
    console.log("Comment: ", comment);

    const updatedData = {
      comment: comment,
      status_id: statusId,

    };

    await EmployeeService.updateAppointment(appointmentId, updatedData)
      .then((resp) => {
        if (resp.success) {
          console.log("Update uspio", resp.message);
          //setAppointment(EmployeeService.getCurrentAppointment().data.appointment);
          //console.log(appointment);
          console.log(EmployeeService.getCurrentAppointment().data.appointment);
          //console.log(appointment);
        } else {
          console.error("greska", resp.message);
        }
      })
      .catch((error) => {
        console.error("greska", error);
      });
  }

  useEffect(() => {
    const fetchAppointment = async () => {
      await EmployeeService.getAppointmentById(appointmentId).then((resp) => {
        if (resp.success) {
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
        Pacijent {appointment && appointment.therapy.patient.name}{" "}
        {appointment && appointment.therapy.patient.surname} - evidencija
        dolaska na termin
      </h2>
      <div className="mini-container">
        <div className="big-div1">
          <div className="mid-div1">
            <div className="small-div1">
              <FormControl>
                <FormLabel id="blabla">Evidencija</FormLabel>
                <RadioGroup
                  aria-labelledby="blabla"
                  value={statusId}
                  onChange={(e) => {
                    setStatusId(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    label="Termin je odrađen"
                  />
                  <FormControlLabel
                    value={5}
                    control={<Radio />}
                    label="Termin je propušten"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="mid-div2">
            {appointment && appointment.therapy && (
              <TherapyInfo therapy={appointment.therapy} />
            )}
          </div>
        </div>
        <div className="big-div2">
          <TextField
            autoComplete="false"
            className="komentar-text"
            label="Komentari"
            variant="outlined"
            name="komentar"
            value={comment}
            multiline
            rows={4}
            style={komentarStyle}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {appointment && (
          <Link
            to={`/appointments-preview/${appointment.therapy.patient.user_id}`}
          >
            <Button
              variant="contained"
              size="medium"
              className="reg-btn"
              style={buttonStyle}
              onClick={() => {
                updateAppointment();
              }}
            >
              Predaj evidenciju
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecord;
