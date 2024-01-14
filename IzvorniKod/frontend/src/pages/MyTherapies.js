import { React, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TableRow, TableCell } from "@mui/material";
import { parseDate } from "../services/utils";
import { LoginContext } from "../contexts/LoginContext";
import DataDisplay from "../components/DataDisplay";
import "./PatientPreview.css";


const MyTherapies = () => {
    const context = useContext(LoginContext);

    const user_id = useRef({ value: context.userData.user_id });
    
    const [therapies, setTherapies] = useState(null);

    const nav = useNavigate();

    useEffect(() => {
    }, [therapies, context]);

    return (
        <div className="main-container">
            <div className="header">
                <div className="title-div">
                    <h2>Moje terapije</h2>
                </div>
            </div>
            <DataDisplay
                url={"/therapies/by-patient/" + user_id.current.value}
                setData={setTherapies}
                tableHead={tableHead}
                buttonLabel="Dodaj terapiju"
                buttonUrl="/create-therapy"
            >
                {therapies !== null && therapies.data.therapies.map(therapy => (
                    <TableRow
                        key={therapy.therapy_id}
                        onClick={() => nav("/my-therapies/" + therapy.therapy_id)}
                    >
                        <TableCell>{parseDate(therapy.date_from)}</TableCell>
                        <TableCell>{parseDate(therapy.date_to)}</TableCell>
                        <TableCell>
                            {therapy.therapy_type &&
                                therapy.therapy_type.therapy_type_name}
                        </TableCell>
                        <TableCell className="hide-sm">{therapy.disease_descr}</TableCell>
                        <TableCell className="hide-sm">{therapy.req_treatment}</TableCell>
                    </TableRow>
                ))}
            </DataDisplay>
        </div >
    );

};

export default MyTherapies;

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
        classes: "show-sm"
    },
    {
        name: "Vrsta",
        orderBy: "therapy_type_id",
        align: "left",
        classes: "show-sm"
    },
    {
        name: "Opis oboljenja",
        orderBy: "disease_descr",
        align: "left",
        classes: "hide-sm"
    },
    {
        name: "Zahtjevani tretman",
        orderBy: "req_treatment",
        align: "left",
        classes: "hide-sm"
    }
]