import { React } from "react";
import "./AttendanceRecord.css";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  CircularProgress,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TherapyInfo from "../components/TherapyInfo";
import { useParams } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AttendanceRecord = () => {
  //inicijalizacija varijabli
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [comment, setComment] = useState("");
  const [statusId, setStatusId] = useState("");
  const nav = useNavigate();
  const toastShownRef = useRef(false);
  const [loading, setLoading] = useState(true);

  //stilovi
  const buttonStyle = {
    backgroundColor: "purple",
    marginLeft: "3em",
    marginRight: "2em",
    marginBottom: "1em",
  };
  const buttonStyle2 = {
    backgroundColor: "gray",
    width: "8em",
    marginBottom: "1em",
    marginLeft: "3em",
    marginRight: "2em",
  };
  const komentarStyle = {
    width: "70%",
  };
  const bolded = {
    fontWeight: "bold",
    display: "inline",
  };

  //funkcija koja provjerava jesu komentar ili status prazni
  const isFilled = () => {
    if (comment === "") return false;
    if (statusId === "") return false;
    return true;
  };

  //funkcija za ažuriranje termina
  const updateAppointment = async () => {
    //ako je termin otkazan, odrađen, propušten ili na čekanju, onemogući evidenciju termina
    if (appointment && !(appointment.status.status_id === 2)) {
      toast.error("Termin je već evidentiran ili je na čekanju!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    //ako su komentar ili status prazni, onemogućiti evidenciju termina
    let filled = isFilled();
    if (!filled) {
      toast.error("Treba odabrati status i unijeti komentar!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    //ažurirani podatci
    const updatedData = {
      comment: comment,
      status_id: statusId,
    };

    //ažuriranje termina
    try {
      const resp = await EmployeeService.updateAppointment(
        appointmentId,
        updatedData
      );
      if (resp.success) {
        setAppointment(resp.data);
        return true;
      } else {
        toast.error("Greska!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return false;
      }
    } catch (err) {
      toast.error(`API Error:${err.response.data}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  };

  //fetchanje termina pri renderu
  useEffect(() => {
    setLoading(true);
    const fetchAppointment = async () => {
      try {
        const resp = await EmployeeService.getAppointmentById(appointmentId);
        if (resp.success) {
          setAppointment(resp.data);
          setLoading(false);
          if (!(resp.data.status.status_id === 2) && !toastShownRef.current) {
            toast.error("Termin je već evidentiran ili je na čekanju", {
              position: toast.POSITION.TOP_RIGHT,
            });
            toastShownRef.current = true;
          }
        } else {
          toast.error("Greska!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (err) {
        toast.error(`API Error:${err.response.data}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  //funkcija koja provjerava je li evidencija uspjela
  const provjeraUspjehaUpdatea = async () => {
    const updBool = await updateAppointment();
    console.log("updBool:", updBool);
    if (updBool) {
      nav(-1);
    }
  };

  return (
    <div className="main-container3_1">
      {loading && (
        <div className="circural-progress">
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <div>
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
                <div className="small-div3_2">
                  <p>
                    <span style={bolded}>DATUM I VRIJEME TERMINA:</span>{" "}
                    {appointment && appointment.date_from}{" "}
                  </p>
                  <p>
                    <span style={bolded}>Soba:</span>{" "}
                    {appointment &&
                    appointment.room &&
                    appointment.status.status_name !== "Otkazan"
                      ? appointment.room.room_num
                      : "/"}
                  </p>
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

            <div className="button-div3_1">
              {appointment && (
                <Button
                  variant="contained"
                  size="medium"
                  className="gumb3_1"
                  style={buttonStyle2}
                  onClick={() => {
                    nav(-1);
                  }}
                >
                  Odustani
                </Button>
              )}
              {appointment && (
                <Button
                  variant="contained"
                  size="medium"
                  className="gumb3_2"
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
        </div>
      )}
    </div>
  );
};

export default AttendanceRecord;
