import { React } from "react";
import "./AppointmentOptions.css";
import AppointmentInfo from "../components/AppointmentInfo";
import TherapyInfo from "../components/TherapyInfo";
import { IconButton, CircularProgress } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EmployeeService from "../services/employeeService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AppointmentOptions = () => {
  //inicijalizacija varijabli
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  //stilovi
  const buttonStyle1 = {
    backgroundColor: "darkslateblue",
  };
  const buttonStyle2 = {
    backgroundColor: "purple",
  };
  const buttonStyle3 = {
    backgroundColor: "orange",
  };
  const buttonStyle4 = {
    backgroundColor: "red",
  };
  const iconButtonStyle = {
    backgroundColor: "black",
    color: "white",
    float: "left",
  };

  //fetchanje appointmenta pri renderu
  useEffect(() => {
    setLoading(true);
    const fetchAppointment = async () => {
      try {
        const resp = await EmployeeService.getAppointmentById(appointmentId);
        if (resp.success) {
          setAppointment(resp.data);
          setLoading(false);
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

  return (
    <div className="main-container8_1">
      {loading && (
        <div className="circural-progress">
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <div>
          <div className="iconButtonDiv8_1">
            <IconButton style={iconButtonStyle} onClick={() => nav(-1)}>
              <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
            </IconButton>
          </div>
          <div className="mini-container8_1">
            <div className="title-div8_1">
              <h2>Akcije za termin</h2>
            </div>
            <div className="border-container8_1">
              <div className="big-div8_1">
                <div className="mid-div8_1">
                  {appointment && appointment.therapy && (
                    <AppointmentInfo appointment={appointment} />
                  )}
                </div>
                <div className="mid-div8_2">
                  {appointment && appointment.therapy && (
                    <TherapyInfo therapy={appointment.therapy} />
                  )}
                </div>
              </div>
              <div className="button-div-container8_1">
                <div className="akcije-div">Dostupne akcije:</div>
                {appointment &&
                  (appointment.status.status_id === 3 ||
                    appointment.status.status_id === 4 ||
                    appointment.status.status_id === 5) && (
                    <div className="button-div8_1">
                      <Button
                        variant="contained"
                        size="medium"
                        className="gumb8_1"
                        style={buttonStyle1}
                        onClick={() => {
                          nav(
                            `/attendance-display/${appointment.appointment_id}`
                          );
                        }}
                      >
                        Prikaži evidenciju
                      </Button>
                    </div>
                  )}
                {appointment && appointment.status.status_id === 2 && (
                  <div className="button-div8_2">
                    <Button
                      variant="contained"
                      size="medium"
                      className="gumb8_2"
                      style={buttonStyle2}
                      onClick={() => {
                        nav(`/attendance/${appointment.appointment_id}`);
                      }}
                    >
                      Evidentiraj
                    </Button>
                  </div>
                )}
                {appointment &&
                  (appointment.status.status_id === 1 ||
                    appointment.status.status_id === 2 ||
                    appointment.status.status_id === 4) && (
                    <div className="button-div8_3">
                      <Button
                        variant="contained"
                        size="medium"
                        className="gumb8_3"
                        style={buttonStyle3}
                        onClick={() => {
                          nav(
                            `/change-appointment/${appointment.appointment_id}`
                          );
                        }}
                      >
                        Promjeni termin
                      </Button>
                    </div>
                  )}
                {appointment &&
                  (appointment.status.status_id === 1 ||
                    appointment.status.status_id === 2) && (
                    <div className="button-div8_4">
                      <Button
                        variant="contained"
                        size="medium"
                        className="gumb8_4"
                        style={buttonStyle4}
                        onClick={() => {
                          nav(
                            `/deny-appointment/${appointment.appointment_id}`
                          );
                        }}
                      >
                        Otkaži termin
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentOptions;
