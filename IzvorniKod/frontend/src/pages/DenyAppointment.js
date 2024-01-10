import { React } from "react";
import "./DenyAppointment.css";
import TherapyInfo from "../components/TherapyInfo";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import AppointmentInfo from "../components/AppointmentInfo";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import EmployeeService from "../services/employeeService";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const komentarStyle = {
  width: "100%",
};
const komentarDivStyle = {
  marginLeft: "auto",
  marginRight: "2em",
  width: "40%",
  marginBottom: "2em",
};
const buttonStyle1 = {
  backgroundColor: "orange",
  width: "18em",
  float: "left",
  marginLeft: "2em",
};
const buttonStyle2 = {
  backgroundColor: "gray",
  width: "8em",
  float: "left",
};
const buttonStyle3 = {
  backgroundColor: "blue",
  marginRight: "2em",
  marginLeft: "auto",
  float: "right",
};
const iconButtonStyle = {
  backgroundColor: "black",
  color: "white",
  float: "left",
};

const DenyAppointment = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [comment, setComment] = useState("");
  const nav = useNavigate();

  const isFilled = () => {
    if (comment === "") return false;
    return true;
  };

  const updateAppointment = async () => {
    try {
      let filled = isFilled();
      if (!filled) {
        throw new Error("Komentar je" + filled);
      }
    } catch (err) {
      toast.error("Treba unijeti komentar!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    const updatedData = {
      comment: comment,
      status_id: 4,
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

  const provjeraUspjehaUpdatea = async () => {
    const updBool = await updateAppointment();
    console.log("updBool:", updBool);
    if (updBool) {
      nav(-1);
    }
  };

  return (
    <div className="main-container7_1">
      <div className="iconButtonDiv7_1">
        <IconButton style={iconButtonStyle} onClick={() => nav(-1)}>
          <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
        </IconButton>
      </div>
      <div className="mini-container7_1">
        <div className="title-div7_1">
          <h2>Odbijanje zahtjeva za terminom</h2>
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
              <Link to={`/change-appointment/${appointmentId}`}>
                <Button
                  variant="contained"
                  size="medium"
                  className="gumb7_1"
                  style={buttonStyle1}
                >
                  Premjesti ovaj termin
                </Button>
              </Link>
            </div>
            <div className="button-div7_2">
              <Link to={"../appointment-requests-preview"}>
                <Button
                  variant="contained"
                  size="medium"
                  className="gumb7_1"
                  style={buttonStyle2}
                >
                  Odustani
                </Button>
              </Link>
              {appointment && (
                <Button
                  variant="contained"
                  size="medium"
                  className="gumb7_1"
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
  );
};

export default DenyAppointment;
