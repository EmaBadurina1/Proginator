import { React } from "react";
import "./DenyAppointment.css";
import TherapyInfo from "../components/TherapyInfo";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton, CircularProgress } from "@mui/material";
import AppointmentInfo from "../components/AppointmentInfo";
import { useParams } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DenyAppointment = () => {
  //inicijalizacija varijabli
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [comment, setComment] = useState("");
  const nav = useNavigate();
  const toastShownRef = useRef(false);
  const [loading, setLoading] = useState(true);

  //stilovi
  const komentarStyle = {
    width: "100%",
  };
  const komentarDivStyle = {
    marginLeft: "1.8em",
    marginRight: "2em",
    width: "50%",
    marginBottom: "2em",
  };
  const buttonStyle1 = {
    backgroundColor: "orange",
    marginLeft: "2em",
  };
  const buttonStyle2 = {
    backgroundColor: "gray",
  };
  const buttonStyle3 = {
    backgroundColor: "blue",
    marginRight: "2em",
    marginLeft: "auto",
  };
  const iconButtonStyle = {
    backgroundColor: "#3498db",
    color: "white",
    float: "left",
  };

  //funkcija koja provjerava je li komentar prazan
  const isFilled = () => {
    if (comment === "") return false;
    return true;
  };

  //funkcija za ažuriranje termina
  const updateAppointment = async () => {
    //ako termin nije zakazan ili na čekanju, onemogućavanje otkazivanje termina
    if (
      appointment &&
      !(
        appointment.status.status_id === 1 || appointment.status.status_id === 2
      )
    ) {
      toast.error(
        "Ne mogu se otkazati termini koji nisu zakazani ili na čekanju!",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
      return false;
    }

    //onemogućavanje otkazivanja termina sa praznim komentarom
    let filled = isFilled();
    if (!filled) {
      toast.error("Treba unijeti komentar!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    //ažurirani podatci
    const updatedData = {
      comment: comment,
      status_id: 4,
    };

    //ažuriranje termina
    try {
      const resp = await EmployeeService.attendanceAppointment(
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
      toast.error("Greska!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
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
          if (
            !(
              resp.data.status.status_id === 1 ||
              resp.data.status.status_id === 2
            ) &&
            !toastShownRef.current
          ) {
            toast.error(
              "Ne mogu se otkazati termini koji nisu zakazani ili na čekanju!",
              {
                position: toast.POSITION.TOP_RIGHT,
              }
            );
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

  //funkcija koja provjerava je li otkazivanje termina uspjelo
  const provjeraUspjehaUpdatea = async () => {
    const updBool = await updateAppointment();
    if (updBool) {
      nav(-1);
    }
  };

  return (
    <div className="main-container7_1">
      {loading && (
        <div className="circural-progress">
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <div>
          <div className="iconButtonDiv7_1">
            <IconButton style={iconButtonStyle} onClick={() => nav(-1)}>
              <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
            </IconButton>
          </div>
          <div className="mini-container7_1">
            <div className="title-div7_1">
              <h2>Otkazivanje termina</h2>
            </div>
            <div className="border-container7_1">
              <div className="big-div7_1">
                <div className="mid-div7_1">
                  {appointment && appointment.therapy && (
                    <AppointmentInfo appointment={appointment} />
                  )}
                </div>
                <div className="mid-div7_2">
                  {appointment && appointment.therapy && (
                    <TherapyInfo therapy={appointment.therapy} />
                  )}
                </div>
              </div>
              <div className="big-div7_2" style={komentarDivStyle}>
                <TextField
                  autoComplete="false"
                  className="komentar-text"
                  label="Komentar za pacijenta"
                  variant="outlined"
                  name="komentar"
                  multiline
                  rows={4}
                  style={komentarStyle}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="button-div-container7_1">
                <div className="button-div7_1">
                  {appointment && (
                    <Button
                      variant="contained"
                      size="medium"
                      className="gumb7_1"
                      style={buttonStyle1}
                      onClick={() => {
                        if (
                          appointment.status &&
                          (appointment.status.status_id === 1 ||
                            appointment.status.status_id === 2)
                        ) {
                          nav(
                            `/change-appointment/${appointment.appointment_id}`
                          );
                        } else {
                          toast.error(
                            "Ne mogu se promijeniti termini koji nisu zakazani ili na čekanju!",
                            {
                              position: toast.POSITION.TOP_RIGHT,
                            }
                          );
                        }
                      }}
                    >
                      Premjesti termin
                    </Button>
                  )}
                </div>
                <div className="button-div7_2">
                  <div className="small-button-div7_1">
                    <Button
                      variant="contained"
                      size="medium"
                      className="gumb7_2"
                      style={buttonStyle2}
                      onClick={() => {
                        nav(-1);
                      }}
                    >
                      Odustani
                    </Button>
                  </div>
                  <div className="small-button-div7_2">
                    {appointment && (
                      <Button
                        variant="contained"
                        size="medium"
                        className="gumb7_3"
                        style={buttonStyle3}
                        onClick={() => {
                          provjeraUspjehaUpdatea();
                        }}
                      >
                        Potvrdi
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DenyAppointment;
