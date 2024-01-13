import { React } from "react";
import "./ChangeAppointment.css";
import AppointmentInfo from "../components/AppointmentInfo";
import TherapyInfo from "../components/TherapyInfo";
import { IconButton } from "@mui/material";
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

const ChangeAppointment = () => {

  //inicijalizacija varijabli
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const nav = useNavigate();
  const toastShownRef = useRef(false);

  //stilovi
  const iconButtonStyle = {
    backgroundColor: "black",
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
      (appointment.status.status_id === 3 || appointment.status.status_id === 5)
    ) {
      toast.error("Ne može se promijeniti propušten ili odrađen termin!", {
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
      status_id: 1,
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

  //fetchanje appointmenta po renderu
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const resp = await EmployeeService.getAppointmentById(appointmentId);
        if (resp.success) {
          setAppointment(resp.data);
          if (
            (resp.data.status.status_id === 3 ||
              resp.data.status.status_id === 5) &&
            !toastShownRef.current
          ) {
            toast.error(
              "Ne može se promijeniti propušten ili odrađen termin!",
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
        toast.error(`API Error:${err.response.data}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    fetchAppointment();
  }, [appointmentId]);

    //funkcija koja provjerava je li ažuriranje termina uspjelo
    const provjeraUspjehaUpdatea = async () => {
      const updBool = await updateAppointment();
      console.log("updBool:", updBool);
      if (updBool) {
        nav(-1);
      }
    };

  //prilikom odabiranja datuma termina, ažuriraj varijablu date
  function onChangeDate(date) {
    let value = date.toFormat("yyyy-MM-dd");
    setDate(value);
  }

  return (
    <div className="main-container6_1">
      <div className="iconButtonDiv6_1">
        <IconButton style={iconButtonStyle} onClick={() => nav(-1)}>
          <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
        </IconButton>
      </div>
      <div className="mini-container6_1">
        <div className="title-div6_1">
          <h2>Promjena termina</h2>
        </div>
        <div className="border-container6_1">
          <div className="big-div6_1">
            <div className="mid-div6_1">
              {appointment && appointment.therapy && (
                <AppointmentInfo appointment={appointment} />
              )}
            </div>
            <div className="mid-div6_2">
              {appointment && appointment.therapy && (
                <TherapyInfo therapy={appointment.therapy} />
              )}
            </div>
          </div>
          <div className="big-div6_4">
            <LocalizationProvider
              dateAdapter={AdapterLuxon}
              dateLibInstance={DateTime}
            >
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  format="dd/MM/yyyy"
                  label="Datum terapije"
                  onChange={onChangeDate}
                  minDate={DateTime.local()}
                  className="date-picker6_1"
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="big-div6_5">
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="Vrijeme terapije"
                  className="time-picker6_1"
                  onChange={(newTime) => setTime(newTime)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="button-div-container6_1">
            <div className="button-div6_1">
              {appointment && (
                <Button
                  variant="contained"
                  size="medium"
                  className="gumb6_2"
                  style={buttonStyle2}
                  onClick={() => {
                    if (appointment.status && (appointment.status.status_id === 1
                       || appointment.status.status_id === 2)) {
                      nav(`/deny-appointment/${appointment.appointment_id}`);
                    } else {
                      toast.error("Ne mogu se otkazati termini koji nisu zakazani ili na čekanju!", {
                        position: toast.POSITION.TOP_RIGHT,
                      });
                    }
                  }}
                >
                  Otkaži termin
                </Button>
              )}
            </div>
            <div className="button-div6_2">
              <div className="small-button-div6_1">
                {appointment && (
                  <Button
                    variant="contained"
                    size="medium"
                    className="gumb6_3"
                    style={buttonStyle3}
                    onClick={() => {
                      nav(-1);
                    }}
                  >
                    Odustani
                  </Button>
                )}
              </div>
              <div className="small-button-div6_2">
                {appointment && (
                  <Button
                    variant="contained"
                    size="medium"
                    className="gumb6_1"
                    style={buttonStyle1}
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
  );
};

export default ChangeAppointment;
