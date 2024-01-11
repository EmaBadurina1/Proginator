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
import TherapyInfo from "../components/TherapyInfo";
import { useParams } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const [comment, setComment] = useState("");
  const [statusId, setStatusId] = useState("");
  const nav = useNavigate();

  const isFilled = () => {
    if (comment === "") return false;
    if (statusId === "") return false;
    return true;
  };

  const updateAppointment = async () =>  {
    try {
      let filled = isFilled();
      if (!filled) {
        throw new Error("Status ili komentar je" + filled);
      }
    } catch (err) {
      toast.error("Treba odabrati status i unijeti komentar!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    const updatedData = {
      comment: comment,
      status_id: statusId,
    };

    try {
      const resp = await EmployeeService.updateAppointment(appointmentId, updatedData);
      if (resp.success) {
        setAppointment(resp.data);
        return true;
      } else {
        console.error("greska", resp.message);
        return false;
      }
    } catch (err) {
      toast.error(`API Error:${err.response.data}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  }

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const resp = await EmployeeService.getAppointmentById(appointmentId);
        if (resp.success) {
          setAppointment(resp.data);
        } else {
          console.log("greska");
        }
      } catch (err) {
        toast.error(`API Error:${err.response.data}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  const provjeraUspjehaUpdatea = async () => {
    const updBool = await updateAppointment();
    console.log('updBool:', updBool);
    if(updBool) {
      nav(`/appointments-preview/${appointment.therapy.patient.user_id}`);
    }
  }

  return (
    <div className="main-container3_1">
      <h2>
        Pacijent {appointment && appointment.therapy.patient.name}{" "}
        {appointment && appointment.therapy.patient.surname} - evidencija
        dolaska na termin
      </h2>
      <div className="mini-container3_1">
        <div className="big-div3_1">
          <div className="mid-div3_1">
            <div className="small-div3_1">
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
                  <FormControlLabel
                    value={4}
                    control={<Radio />}
                    label="Termin je otkazan"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="mid-div3_2">
            {appointment && appointment.therapy && (
              <TherapyInfo therapy={appointment.therapy} />
            )}
          </div>
        </div>
        <div className="big-div3_2">
          <TextField
            autoComplete="false"
            className="komentar-text3_1"
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
          <Button
            variant="contained"
            size="medium"
            className="gumb3_1"
            style={buttonStyle}
            onClick={() => {
              provjeraUspjehaUpdatea();
            }}
          >
            Predaj evidenciju
          </Button>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecord;
