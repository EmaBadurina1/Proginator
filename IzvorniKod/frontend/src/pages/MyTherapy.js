import { useEffect, useState, React } from "react";
import { useParams } from "react-router-dom";
import { TableRow, TableCell, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { parseDateTime, parseDate } from "../services/utils";
import axiosInstance from "../axiosInstance";
import DataDisplay from "../components/DataDisplay";
import DataBox from "../components/DataBox";
import "./MyTherapy.css";
import AppointmentDialog from "../components/AppointmentDialog";


const MyTherapy = () => {
    const [therapy, setTherapy] = useState(null);
    const [appointments, setAppointments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState(null);

    const { therapy_id } = useParams();

    useEffect(() => {
        setLoading(true);
        const getTherapy = async () => {
            try {
                const res = await axiosInstance.get("/therapies/" + therapy_id);
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

    }, [therapy_id]);

    const openDialog = (content) => {
        setContent(content);
        setOpen(true);
    }

    return (
        <div className="my-therapy">
            <h2>
                Moja terapija
            </h2>
            {loading &&
                <div className="circural-progress">
                    <CircularProgress />
                </div>
            }
            {!loading && (
                <>
                <div className="date-interval">
                    <span>
                        {parseDate(therapy.date_from)}
                    </span>
                    <span> - </span>
                    <span>
                        {therapy.date_to === null
                            ? ("Traje")
                            : (parseDate(therapy.date_to))
                        }
                    </span>
                </div>
                <div className="data-conteiner">
                    <div className="data">
                        <DataBox label="Vrsta" tooltip="Vrsta terapije" big={false}>
                            {therapy.therapy_type === null
                                ? ("Nema vrste")
                                : (therapy.therapy_type.therapy_type_name)
                            }
                        </DataBox>
                        <DataBox label="Liječnik" tooltip="Liječnik koji je uputio na rehabilitaciju" big={false}>
                            {therapy.doctor === null
                                ? ("Nema doktora")
                                : ("dr. " + therapy.doctor.name + " " + therapy.doctor.surname)
                            }
                        </DataBox>
                        <DataBox label="Opis" tooltip="Opis oboljenja pacijenta" big={true}>
                            {therapy.disease_descr === null || therapy.disease_descr === ""
                                ? ("Nema opisa")
                                : (therapy.disease_descr)
                            }
                        </DataBox>
                        <DataBox label="Zaht. tretman" tooltip="Zahtjevani postupak liječenja pacijenta" big={true}>
                            {therapy.req_treatment === null || therapy.req_treatment === ""
                                ? ("Nema zahtjeva")
                                : (therapy.req_treatment)
                            }
                        </DataBox>
                    </div>
                </div>
                <div>
                    <h3>Termini</h3>
                    <DataDisplay
                        url={"/appointments/by-therapy/" + therapy.therapy_id}
                        setData={setAppointments}
                        tableHead={tableHead}
                        buttonLabel="Dodaj termin"
                        buttonUrl={"/new-appointment/" + therapy.therapy_id}
                        buttonRemove={therapy.date_to !== null && therapy.date_to !== ""}
                    >
                        { appointments !== null && appointments.data.appointments.map(appointment => (
                            <TableRow
                                key={appointment.appointment_id}
                                onClick={() => openDialog(appointment)}
                            >
                                <TableCell>{parseDateTime(appointment.date_from)}</TableCell>
                                <TableCell className="hide-sm">{parseDateTime(appointment.date_to)}</TableCell>
                                <TableCell>
                                    {appointment.room &&
                                    appointment.room.room_num}
                                </TableCell>
                                <TableCell className="hide-sm">
                                    {appointment.status &&
                                    appointment.status.status_name}
                                </TableCell>
                            </TableRow>
                        ))}
                    </DataDisplay>
                </div>
                {open && (
                    <AppointmentDialog
                        open={open}
                        setOpen={setOpen}
                        appointment={content}
                    />
                )}
                </>
            )}
        </div>
    );
};

export default MyTherapy;

const tableHead = [
    {
        name: "Od",
        orderBy: "date_from",
        align: "left",
        classes: "show-sm" 
    },
    {
        name: "Do",
        orderBy: "date_to",
        align: "left",
        classes: "hide-sm" 
    },
    {
        name: "Soba",
        orderBy: "room_num",
        align: "left",
        classes: "show-sm"  
    },
    {
        name: "Status",
        orderBy: "status_id",
        align: "left",
        classes: "hide-sm" 
    }
]