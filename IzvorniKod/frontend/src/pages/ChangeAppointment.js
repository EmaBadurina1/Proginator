import { React } from "react";
import "./ChangeAppointment.css";
import AppointmentInfo from "../components/AppointmentInfo";
import TherapyInfo from "../components/TherapyInfo";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EmployeeService from "../services/employeeService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Link } from "react-router-dom";

const ChangeAppointment = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const iconButtonStyle = {
    backgroundColor: "black",
    color: "white",
    float: "left",
  };

  const buttonStyle = {
    backgroundColor: "orange",
    float: "right",
    marginRight: "5em",
    marginBottom: "2em",
  };

  const komentarStyle = {
    marginTop: "0.8em",
    width: "60%",
  };

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

  const updateAppointment = async () => {
    const timeAsDate = new Date(time);

    const hour = timeAsDate.getHours();
    const minute = timeAsDate.getMinutes();

    const formattedDate = `${date} ${hour}:${minute}`;
    const formattedDate2 = `${date} ${hour + 1}:${minute}`;
    console.log(formattedDate);

    const updatedData = {
      date_from: formattedDate,
      date_to: formattedDate2,
    };

    await EmployeeService.updateAppointment(appointmentId, updatedData)
      .then((resp) => {
        if (resp.success) {
          console.log("Update uspio", resp.message);
        } else {
          console.error("greska", resp.message);
        }
      })
      .catch((error) => {
        console.error("API Error:", error.response.data);
      });
  };

  function onChangeDate(date) {
    let value = date.toFormat("yyyy-MM-dd");
    setDate(value);
  }

  return (
    <div className="container-div2">
      <div className="iconButtonDiv2">
        <IconButton style={iconButtonStyle}>
          <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
        </IconButton>
      </div>
      <div className="mini-container3">
        <div className="title-div3">
          <h2>Promjena termina</h2>
        </div>
        <div className="border-container2">
          <div className="big-div1">
            <div className="mid-div1">
              {appointment && appointment.therapy && (
                <AppointmentInfo appointment={appointment} />
              )}
            </div>
            <div className="mid-div2">
              {appointment && appointment.therapy && (
                <TherapyInfo therapy={appointment.therapy} />
              )}
            </div>
          </div>
          <div className="big-div4">
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  format="dd/MM/yyyy"
                  label="Datum terapije"
                  onChange={onChangeDate}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="big-div5">
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="Vrijeme terapije"
                  onChange={(newTime) => setTime(newTime)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="big-div3">
            Komentar za pacijenta:
            <br></br>
            <TextField
              autoComplete="false"
              className="komentar-text"
              label="Komentar"
              variant="outlined"
              name="komnetar"
              style={komentarStyle}
            />
          </div>
          <div className="button-div">
            {appointment && (
              <Link
                to={"../appointment-requests-preview"}
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
                  Premjesti
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAppointment;
