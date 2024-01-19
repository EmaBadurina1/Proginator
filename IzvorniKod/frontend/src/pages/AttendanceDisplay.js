import { React } from "react";
import "./AttendanceDisplay.css";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  CircularProgress,
} from "@mui/material";
//import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TherapyInfo from "../components/TherapyInfo";
import { useParams } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import DataBox from "../components/DataBox";

//stilovi
const buttonStyle = {
  backgroundColor: "purple",
  marginLeft: "auto",
  marginRight: "4em",
  marginBottom: "1em",
  display: "block",
};

const AttendanceDisplay = () => {
  //inicijalizacija varijabli
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const nav = useNavigate();
  const toastShownRef = useRef(false);
  const [loading, setLoading] = useState(true);

  //fetchanje termina pri renderu
  useEffect(() => {
    setLoading(true);
    const fetchAppointment = async () => {
      try {
        const resp = await EmployeeService.getAppointmentById(appointmentId);
        if (resp.success) {
          setAppointment(resp.data);
          setSelectedStatus(resp.data.status.status_name);
          setLoading(false);
          if (resp.data.status.status_id === 1 && !toastShownRef.current) {
            toast.error("Termin je na čekanju!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            toastShownRef.current = true;
          }
          if (resp.data.status.status_id === 2 && !toastShownRef.current) {
            toast.error("Termin je zakazan!", {
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
        toast.error("Greska!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  return (
    <div className="main-container4_1">
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
          <div className="mini-container4_1">
            <div className="big-div4_1">
              <div className="mid-div4_1">
                <div className="small-div4_1">
                  <FormControl disabled>
                    <FormLabel id="blabla">Evidencija</FormLabel>
                    <RadioGroup
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(event.target.value)
                      }
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
                      <FormControlLabel
                        value="Otkazan"
                        control={<Radio />}
                        label="Termin je otkazan"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="small-div4_2">
                  <DataBox
                    label="Datum i vrijeme"
                    tooltip="Datum i vrijeme termina"
                    big={false}
                  >
                    {appointment && appointment.date_from
                      ? DateTime.fromFormat(
                          appointment.date_from,
                          "EEE, dd LLL yyyy HH:mm:ss 'GMT'",
                          { zone: "utc" }
                        ).toFormat("dd.MM.yyyy. HH:mm")
                      : "Nema datuma"}
                  </DataBox>
                  <DataBox
                    label="Doktor"
                    tooltip="Doktor vezan uz termin"
                    big={false}
                  >
                    {appointment && appointment.employee
                      ? appointment.employee.name +
                        " " +
                        appointment.employee.surname
                      : "Nema doktora"}
                  </DataBox>
                  <DataBox
                    label="Soba"
                    tooltip="Soba u kojoj je termin zakazan"
                    big={false}
                  >
                    {appointment &&
                    appointment.room &&
                    appointment.status.status_name !== "Otkazan"
                      ? appointment.room.room_num
                      : "Nema sobe"}
                  </DataBox>
                </div>
              </div>
              <div className="mid-div4_2">
                {appointment && appointment.therapy && (
                  <TherapyInfo therapy={appointment.therapy} />
                )}
              </div>
            </div>
            <div className="big-div4_2">
              <DataBox
                label="Komentar"
                tooltip="Komentar stavljen pri evidenciji termina"
                big={false}
              >
                {appointment && appointment.comment
                  ? appointment.comment
                  : "Nema komentara"}
              </DataBox>
            </div>
            {appointment && (
              <Button
                variant="contained"
                size="medium"
                className="gumb4_1"
                style={buttonStyle}
                onClick={() => {
                  nav(-1);
                }}
              >
                Povratak
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDisplay;
