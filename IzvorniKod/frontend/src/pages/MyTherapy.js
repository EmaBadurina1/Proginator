import "./AppointmentsPreview.css";
import {
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    CircularProgress,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { useParams } from "react-router-dom";
import { useEffect, useState, React, useContext, useRef } from "react";
import { LoginContext } from "../contexts/LoginContext";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

const MyTherapy = () => {
    const { patientId } = useParams();
    const context = useContext(LoginContext);
    const user_id = useRef({ value: context.userData.user_id });
    //const setAppointments = useState(null);
    //const setPatient = useState(null);
    const [therapy, setTherapy] = useState(null);
    const [loading, setLoading] = useState(true);

    const cellStyle3 = {
        textAlign: "center",
        border: "0.2em solid black",
        color: "white",
    };

    const cellStyle4 = {
        textAlign: "center",
        border: "0.1em solid black",
    };

    useEffect(() => {
        const getTherapy = async () => {
            try {
                const res = await axiosInstance.get("/therapies/" + user_id.current.value, {
                    "page": 1,
                    "page_size": 20
                });
                setTherapy(res.data.data.therapy);
                setLoading(false);
            }
            catch (err) {
                toast.error("Dogodila se greška!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
        getTherapy();

    }, [patientId]);

    return (
        <div className="main-container">
            <div className="title-div">
                <h2>
                    Moja terapija
                </h2>
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow className="prviRed2">
                            <TableCell style={cellStyle3}>Od</TableCell>
                            <TableCell style={cellStyle3}>Do</TableCell>
                            <TableCell style={cellStyle3}>Soba</TableCell>
                            <TableCell style={cellStyle3}>Vaš liječnik</TableCell>
                            <TableCell style={cellStyle3}>Komentar</TableCell>
                            <TableCell style={cellStyle3}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && <CircularProgress></CircularProgress>}
                        {!loading && therapy.appointments.map((appointment) => (
                            <TableRow key={appointment.appointment_id}>
                                <TableCell style={cellStyle4}>{appointment.date_from}</TableCell>
                                <TableCell style={cellStyle4}>{appointment.date_to}</TableCell>
                                <TableCell style={cellStyle4}>{appointment.room === null ? "" : appointment.room.room_num}</TableCell>
                                <TableCell style={cellStyle4}>
                                    {appointment.employee === null ? "" : appointment.employee.name + ' ' + appointment.employee.surname}
                                </TableCell>
                                <TableCell style={cellStyle4}>{appointment.comment}</TableCell>
                                <TableCell style={cellStyle4}>{appointment.status.status_name}</TableCell>

                                {/* <TableCell style={cellStyle4}>
                                    {therapy.appointments.status.status_name === "Čeka na odobrenje" && (
                                        <Link to={`/attendance/${appointment.appointment_id}`}>
                                            <Button
                                                variant="contained"
                                                size="medium"
                                                className="reg-btn"
                                                style={buttonStyle}
                                            >
                                                Evidentiraj
                                            </Button>
                                        </Link>
                                    )}
                                    {appointment.status.status_name !== "Na čekanju" && (
                                        <div>
                                            <div className="ev1">EVIDENTIRANO</div>
                                            <div>
                                                <Link
                                                    to={`/attendance-display/${appointment.appointment_id}`}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        size="medium"
                                                        className="reg-btn2"
                                                        style={buttonStyle2}
                                                    >
                                                        Prikaži evidenciju
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default MyTherapy;
