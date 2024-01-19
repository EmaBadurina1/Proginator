import { React } from "react";
import "./ChangeAppointment.css";
import AppointmentInfo from "../components/AppointmentInfo";
import TherapyInfo from "../components/TherapyInfo";
import { IconButton, CircularProgress } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import EmployeeService from "../services/employeeService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { useCallback } from "react";

//funkcija koja dobavlja slobodne termine u odabranom datumu
const fetchAvailableHours = async (date, appointment, setFreeAppointments) => {
  if (!date || !appointment || !appointment.therapy) {
    return;
  }
  try {
    const resp = await EmployeeService.getAvailableHours(
      appointment.therapy.therapy_id,
      date
    );
    if (resp.success) {
      setFreeAppointments(resp.data);
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

const ChangeAppointment = () => {
  //inicijalizacija varijabli
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [freeAppointments, setFreeAppointments] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const nav = useNavigate();
  const toastShownRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [timePickerKey, setTimePickerKey] = useState(0);
  const [potvrdiButtonDisabled, setPotvrdiButtonDisabled] = useState(false);

  //stilovi
  const iconButtonStyle = {
    backgroundColor: "#3498db",
    color: "white",
    float: "left",
  };

  const buttonStyle1 = {
    backgroundColor: "blue",
  };
  const buttonStyle2 = {
    backgroundColor: "red",
    color: "white",
    marginLeft: "2em",
    marginBottom: "1em",
  };
  const buttonStyle3 = {
    backgroundColor: "gray",
    width: "8em",
    marginBottom: "1em",
  };

  //funkcija koja provjerava jesu datum ili vrijeme prazni
  const isFilled = () => {
    if (date === "") return false;
    if (time === "") return false;
    return true;
  };

  //funkcija za ažuriranje termina
  const updateAppointment = async () => {
    //ako je termin odrađen ili propušten, onemogućavanje promjene datuma termina
    if (
      appointment &&
      (appointment.status.status_id === 3 ||
        appointment.status.status_id === 4 ||
        appointment.status.status_id === 5)
    ) {
      toast.error("Ne mogu se promijeniti termini koji nisu zakazani ili na čekanju!!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    //onemogućavanje ažuriranja datuma termina sa praznim komentarom
    let filled = isFilled();
    if (!filled) {
      toast.error("Treba unijeti datum i vrijeme!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    //onemogućavanje ažuriranja termina ako je datum subota ili nedjelja
    const selectedDateTime = DateTime.fromFormat(date, "yyyy-MM-dd");
    if (selectedDateTime.weekday === 6 || selectedDateTime.weekday === 7) {
      toast.error("Morate odabrati radni dan!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    //onemogućavanje ažuriranja termina ako odabrano vrijeme nije validno
    const currentDateTime = DateTime.now();
    const hoursNow = currentDateTime.hour;
    if (time.hour >= 8 && time.hour < 20) {
      if (selectedDateTime.hasSame(currentDateTime, "day")) {
        if (time.hour <= hoursNow) {
          toast.error("Morate odabrati validno vrijeme!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return false;
        }
      }
      if (!freeAppointments.includes(time.hour + ":00")) {
        toast.error("Morate odabrati validno vrijeme!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return false;
      }
    } else {
      toast.error("Morate odabrati validno vrijeme!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    //formatiranje datuma i vremena da bude u ispravnom formatu za ažuriranje termina
    const timeAsDate = new Date(time);

    const hour = timeAsDate.getHours();
    const minute = "00";

    const formattedDate = `${date} ${hour}:${minute}`;
    const formattedDate2 = `${date} ${hour + 1}:${minute}`;

    //ažurirani podatci
    const updatedData = {
      date_from: formattedDate,
      date_to: formattedDate2,
      status_id: 2,
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
      toast.error("Greska!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  };

  //fetchanje appointmenta po renderu
  useEffect(() => {
    setLoading(true);
    const fetchAppointment = async () => {
      try {
        const resp = await EmployeeService.getAppointmentById(appointmentId);
        if (resp.success) {
          setAppointment(resp.data);
          setLoading(false);
          if (
            (resp.data.status.status_id === 3 ||
              resp.data.status.status_id === 4 ||
              resp.data.status.status_id === 5) &&
            !toastShownRef.current
          ) {
            toast.error(
              "Ne mogu se promijeniti termini koji nisu zakazani ili na čekanju!",
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

  //funkcija koja provjerava je li ažuriranje termina uspjelo
  const provjeraUspjehaUpdatea = async () => {
    setPotvrdiButtonDisabled(true);
    const updBool = await updateAppointment();
    if (updBool) {
      nav(-1);
    } else {
      setPotvrdiButtonDisabled(false);
    }
  };

  //prilikom odabiranja datuma termina, ažuriraj varijablu date
  function onChangeDate(date) {
    let value = date.toFormat("yyyy-MM-dd");
    setDate(value);
  }

  const fetchAvailableHoursCallback = useCallback(() => {
    fetchAvailableHours(date, appointment, setFreeAppointments);
  }, [date, appointment, setFreeAppointments]);

  //onemogućenje biranja vikenda za datum termina
  const shouldDisableDate = (day) => {
    if (
      DateTime.fromISO(day).weekday === 6 ||
      DateTime.fromISO(day).weekday === 7
    )
      return true;
    return false;
  };

  //funkcionalnost da se može odabrati samo slobodno vrijeme
  const shouldDisableTime = (newTime) => {
    if (!freeAppointments) return false;
    const currentDateTime = DateTime.now();
    const hoursNow = currentDateTime.hour;
    const selectedDateTime = DateTime.fromFormat(date, "yyyy-MM-dd");
    if (selectedDateTime.hasSame(currentDateTime, "day")) {
      if (newTime.hour <= hoursNow) {
        return true;
      }
    }
    if (newTime.hour < 8 || newTime.hour >= 20) return true;
    return !freeAppointments.includes(newTime.hour + ":00");
  };

  //prilikom promjene datuma zovi funkciju koja dobavlja slobodne termine u odabranom datumu
  //ako se promijeni datum, resetiraj TimePicker
  useEffect(() => {
    if (date !== "") {
      setTime("");
      setTimePickerKey((prevKey) => prevKey + 1);
      fetchAvailableHoursCallback();
    }
  }, [date, fetchAvailableHoursCallback]);

  return (
    <div className="main-container9_1">
      {loading && (
        <div className="circural-progress">
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <div>
          <div className="iconButtonDiv9_1">
            <IconButton style={iconButtonStyle} onClick={() => nav(-1)}>
              <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
            </IconButton>
          </div>
          <div className="mini-container9_1">
            <div className="title-div9_1">
              <h2>Premještaj termina</h2>
            </div>
            <div className="border-container9_1">
              <div className="big-div9_1">
                <div className="mid-div9_1">
                  {appointment && appointment.therapy && (
                    <AppointmentInfo appointment={appointment} />
                  )}
                </div>
                <div className="mid-div9_2">
                  {appointment && appointment.therapy && (
                    <TherapyInfo therapy={appointment.therapy} />
                  )}
                </div>
              </div>
              <div className="big-div9_4">
                <LocalizationProvider
                  dateAdapter={AdapterLuxon}
                  dateLibInstance={DateTime}
                >
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Datum terapije"
                      onChange={(date) => onChangeDate(date)}
                      className="date-picker9_1"
                      disablePast
                      shouldDisableDate={shouldDisableDate}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className="big-div9_5">
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      key={timePickerKey}
                      label="Vrijeme terapije"
                      className="time-picker9_1"
                      onChange={(newTime) => setTime(newTime)}
                      ampm={false}
                      hours={freeAppointments}
                      mask="__:00"
                      views={["hours"]}
                      view="hours"
                      shouldDisableTime={shouldDisableTime}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className="button-div-container9_1">
                <div className="button-div9_1">
                  {appointment && (
                    <Button
                      variant="contained"
                      size="medium"
                      className="gumb9_2"
                      style={buttonStyle2}
                      onClick={() => {
                        if (
                          appointment.status &&
                          (appointment.status.status_id === 1 ||
                            appointment.status.status_id === 2)
                        ) {
                          nav(
                            `/deny-appointment/${appointment.appointment_id}`
                          );
                        } else {
                          toast.error(
                            "Ne mogu se otkazati termini koji nisu zakazani ili na čekanju!",
                            {
                              position: toast.POSITION.TOP_RIGHT,
                            }
                          );
                        }
                      }}
                    >
                      Otkaži termin
                    </Button>
                  )}
                </div>
                <div className="button-div9_2">
                  <div className="small-button-div9_1">
                    {appointment && (
                      <Button
                        variant="contained"
                        size="medium"
                        className="gumb9_3"
                        style={buttonStyle3}
                        onClick={() => {
                          nav(-1);
                        }}
                      >
                        Odustani
                      </Button>
                    )}
                  </div>
                  <div className="small-button-div9_2">
                    {appointment && (
                      <Button
                        variant="contained"
                        size="medium"
                        className="gumb9_1"
                        style={buttonStyle1}
                        onClick={() => {
                          provjeraUspjehaUpdatea();
                        }}
                        disabled={potvrdiButtonDisabled}
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

export default ChangeAppointment;
