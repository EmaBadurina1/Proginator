import { useState, React, useEffect, useContext, useRef } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TextField, Button } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import './CreateTherapy.css';
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

const CreateTherapy = () => {
    const context = useContext(LoginContext);

    const [types, setTypes] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [submitMessage, setSubmitMessage] = useState("Popuni obrazac");
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [autocomplete, setAutocomplete] = useState({
        types: null,
        doctors: null
    });
    const [form, setForm] = useState({
        "therapy_type_id": null,
        "doctor_id": null,
        "disease_descr": "",
        "patient_id": context.userData.user_id,
        "date_from": null,
        "req_treatment": ""
    });

    const fetched = useRef({
        doctors: false,
        types: false
    });

    const nav = useNavigate();

    useEffect(() => {
        const getTherapyTypes = async () => {
            try {
                const res = await axiosInstance.get("/therapy-types", {
                    "page": 1,
                    "page_size": 20
                });
                setTypes(res.data.data.therapy_types);
                fetched.types = true
            }
            catch (err) {
                toast.error("Dogodila se greška!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }

        const getDoctors = async () => {
            try {
                const res = await axiosInstance.get("/doctors");
                setDoctors(res.data.data.doctors);
                fetched.doctors = true
            }
            catch (err) {
                toast.error("Dogodila se greška!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }

        if (!fetched.types)
            getTherapyTypes();
        if (!fetched.doctors)
            getDoctors();

        const isFilled = () => {
            if (form.doctor_id === null) return false;
            if (form.disease_descr === "") return false;
            if (form.date_from === null) return false;
            if (form.patient_id === null) return false;
            return true;
        }

        let disabled = !isFilled();
        setDisableSubmit(disabled);
        if (disabled) {
            setSubmitMessage("Popuni obrazac");
        } else {
            setSubmitMessage("Dodaj terapiju");
        }
    }, [form]);

    const onChangeDate = (date) => {
        let value = date.toFormat("yyyy-MM-dd");
        setForm(oldForm => ({
            ...oldForm,
            "date_from": value
        }));
    }

    const onChange = (event) => {
        const { name, value } = event.target;

        setForm(oldForm => ({
            ...oldForm,
            [name]: value
        }));
    }

    const createTherapy = async (data) => {
        setDisableSubmit(true);
        try {
            const res = await axiosInstance.post("/therapies", {...data});
            if(res.status === 201) {
                toast.success("Dodana terapija!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                nav("/my-therapies");
            }
        }
        catch (err) {
            toast.error("Dogodila se greška!", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
        setDisableSubmit(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let data = { ...form };
        if(data.req_treatment === "") delete data.req_treatment;
        if(data.therapy_type_id === null) delete data.therapy_type_id;

        createTherapy(data);
    }

    return (
        <div className="create-therapy">
            <div className="form">
                <h3>Nova terapija</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <Autocomplete
                            className="autocomplete"
                            disablePortal
                            name="therapy_type_id"
                            disabled={!fetched.types}
                            options={types.map((e) => {
                                return {
                                    label: e.therapy_type_name,
                                    id: e.therapy_type_id
                                }
                            })}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField {...params} label="Vrsta terapije" />}
                            onChange={(event, newValue) => {
                                setAutocomplete(old => ({
                                    ...old,
                                    "types": newValue
                                }));
                                setForm(oldForm => ({
                                    ...oldForm,
                                    "therapy_type_id": newValue === null ? null : newValue.id
                                }));
                            }}
                            value={autocomplete.types}
                        />

                        <Autocomplete
                            className="autocomplete"
                            disablePortal
                            disableClearable
                            disabled={!fetched.doctors}
                            options={doctors.map((e) => {
                                return {
                                    label: e.name + " " + e.surname,
                                    id: e.doctor_id
                                }
                            })}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField {...params} label="Liječnik" />}
                            onChange={(event, newValue) => {
                                setAutocomplete(old => ({
                                    ...old,
                                    "doctors": newValue
                                }));
                                setForm(oldForm => ({
                                    ...oldForm,
                                    "doctor_id": newValue === null ? null : newValue.id
                                }));
                            }}
                            value={autocomplete.doctors}
                        />
                    </div>

                    <div className="form-row date-picker">
                        <LocalizationProvider dateAdapter={AdapterLuxon}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    format="dd/MM/yyyy"
                                    label="Datum terapije"
                                    onChange={onChangeDate}
                                    disablePast
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>

                    <div className="form-row">
                        <TextField
                            className="text-area"
                            autoComplete="false"
                            label="Opis oboljenja"
                            variant="outlined"
                            name="disease_descr"
                            multiline
                            rows={4}
                            onChange={onChange}
                            value={form.disease_descr}
                        />
                    </div>

                    <div className="form-row">
                        <TextField
                            className="text-area"
                            autoComplete="false"
                            label="Zahtjevani postupak liječenja"
                            variant="outlined"
                            name="req_treatment"
                            multiline
                            rows={4}
                            onChange={onChange}
                            value={form.req_treatment}
                        />
                    </div>
                    <div className="form-row submit">
                        <Button
                            type="submit"
                            className="submit-btn"
                            variant="contained"
                            size="medium"
                            disabled={disableSubmit}
                        >
                            {submitMessage}
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default CreateTherapy;