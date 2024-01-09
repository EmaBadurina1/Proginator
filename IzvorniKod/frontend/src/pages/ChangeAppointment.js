import { React } from "react";
import "./ChangeAppointment.css";
import AppointmentInfo from "../components/AppointmentInfo";
import TherapyInfo from "../components/TherapyInfo";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EmployeeService from "../services/employeeService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangeAppointment = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const nav = useNavigate();

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

  const isFilled = () => {
    if (date === "") return false;
    if (time === "") return false;
    return true;
  };

  const provjeraUspjehaUpdatea = async () => {
    const updBool = await updateAppointment();
    console.log('updBool:', updBool);
    if(updBool) {
      nav(-1);
    }
  }

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
    try {
      let filled = isFilled();
      if (!filled) {
        throw new Error("Datum ili vrijeme je" + filled);
      }
    } catch (err) {
      toast.error("Treba unijeti datum i vrijeme!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  
    const timeAsDate = new Date(time);
  
    const hour = timeAsDate.getHours();
    const minute = timeAsDate.getMinutes();
  
    const formattedDate = `${date} ${hour}:${minute}`;
    const formattedDate2 = `${date} ${hour + 1}:${minute}`;
  
    const updatedData = {
      date_from: formattedDate,
      date_to: formattedDate2,
      status_id: 2,
    };
  
    try {
      const resp = await EmployeeService.updateAppointment(appointmentId, updatedData);
  
      if (resp.success) {
        return true; 
      } else {
        console.error("greska", resp.message);
        return false;
      }
    } catch (error) {
      console.error("API Error:", error.response.data);
      return false;
    }
  };
  

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
          <div className="big-div6_5">
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="Vrijeme terapije"
                  onChange={(newTime) => setTime(newTime)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="button-div6_1">
            {appointment && (
              <Button
                variant="contained"
                size="medium"
                className="gumb6_1"
                style={buttonStyle}
                onClick={() => {
                  provjeraUspjehaUpdatea();
                }}
              >
                Premjesti
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAppointment;
