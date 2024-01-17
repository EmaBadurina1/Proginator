import { React, useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { Button, Autocomplete, TextField, CircularProgress } from "@mui/material";
import { DateTime } from 'luxon';
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";
import "./NewAppointment.css"

const NewAppointment = () => {
    const { therapy_id } = useParams();

    const [rooms, setRooms] = useState(null);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [auto, setAuto] = useState(null);
    const [times, setTimes] = useState(null);
    const [loadingTimes, setLoadingTimes] = useState(true);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [form, setForm] = useState({
        "therapy_id": therapy_id,
        "date_from": null,
        "room_num": null
    });

    const nav = useNavigate();

    useEffect(() => {
        const getTherapy = async () => {
            setLoadingRooms(true);
            try {
                const res1 = await axiosInstance.get("/therapies/" + therapy_id);
                if(res1.status === 200) {
                    let id = res1.data.data.therapy.therapy_type.therapy_type_id;
                    const res2 = await axiosInstance.get("/rooms/by-therapy-type/" + id);
                    if(res2.status === 200) {
                        setRooms(res2.data.data.rooms);
                    }
                }
                setLoadingRooms(false);
            }
            catch (err) {
                toast.error("Dogodila se greška!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setLoadingRooms(false);
            }
        }

        getTherapy();

    }, [therapy_id]);

    const onChangeDate = (date) => {
        let value = date.toFormat("yyyy-MM-dd HH:mm");

        value = validateDateTime(value);

        setForm(oldForm => ({
            ...oldForm,
            "date_from": value
        }));

        if(value && form.room_num && form.therapy_id) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }

    const shouldDisableDate = (day) => {
        if(day.toFormat("yyyy-MM-dd") === DateTime.now().toFormat("yyyy-MM-dd")) return true;
        return false;
    }

    const shouldDisableTime = useCallback((time, clockType) => {
        if(!times) return false;
        if(time.hour < 8 || time.hour >= 20) return true;
        const disabledTimes = times.map((dateTime) => DateTime.fromFormat(dateTime, "yyyy-MM-dd HH:mm"));
        if (disabledTimes.some((disabled) => disabled.toFormat("yyyy-MM-dd") === time.toFormat("yyyy-MM-dd"))) {
            if (clockType === "hours") {
                return disabledTimes.some(
                    (disabledTime) =>
                    disabledTime.toFormat("yyyy-MM-dd") === time.toFormat("yyyy-MM-dd") &&
                    disabledTime.hour === time.hour
                );
            }
        }
        return false;
    }, [times]);

    const getTimes = async (room_num) => {
        setLoadingTimes(true);
        try {
            if(room_num && room_num != form.room_num) { 
                const res = await axiosInstance.get("/occupied-appointments/room/" + room_num);
                if(res.status === 200) {
                    setTimes(res.data.data.times);
                }
                setLoadingTimes(false);
            }
        }
        catch (err) {
            toast.error("Dogodila se greška!", {
                position: toast.POSITION.TOP_RIGHT,
            });
            setLoadingTimes(false);
        }
    }

    const onChangeAuto = (event, newValue) => {
        setAuto(newValue);
        setForm(oldForm => ({
            ...oldForm,
            "room_num": newValue === null ? null : newValue.id
        }));

        if(validateDateTime(form.date_from) && form.room_num && form.therapy_id && form.room_num !== "") {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }

        getTimes(newValue === null ? null : newValue.id);

    }

    const validateDateTime = (time) => {
        if(time === null) return null;
        if(time === "") return null;
        const dateTime = DateTime.fromFormat(time, "yyyy-MM-dd HH:mm")
        if(dateTime.toFormat("yyyy-MM-dd") === DateTime.now().toFormat("yyyy-MM-dd")) return null;
        if(dateTime.minute !== 0) return null;
        if(dateTime.second !== 0) return null;
        if(dateTime.hour < 8) return null;
        if(dateTime.hour >= 20) return null;

        if(times) {
            const disabledTimes = times.map((dTime) => DateTime.fromFormat(dTime, "yyyy-MM-dd HH:mm"));
            if (disabledTimes.some((disabled) => disabled.toFormat("yyyy-MM-dd HH") === dateTime.toFormat("yyyy-MM-dd HH"))) {
                return null
            }
        }
        return time;
    }

    const sendData = async () => {
        setDisableSubmit(true);
        try {
            const res = await axiosInstance.post("/appointments", {...form});
            if(res.status === 201) {
                setDisableSubmit(false);
                toast.success("Termin uspješno dodan!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                nav("/my-therapies/" + therapy_id);
            }
            setLoadingRooms(false);
        }
        catch (err) {
            toast.error("Dogodila se greška!", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            setDisableSubmit(false);
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        sendData();
    }

    return (
        <div className="container-div2">
            <form onSubmit={onSubmit}>
                <div className="mini-container3">
                    <div className="title-div3">
                        <h2>Novi termin</h2>
                    </div>
                    <div className="border-container2">
                        {loadingRooms &&
                            <CircularProgress className="progr" size={70} ></CircularProgress>
                        }
                        {!loadingRooms && (
                            <>
                            <div className="form-row">
                                <Autocomplete
                                    className="autocomplete"
                                    disablePortal
                                    name="room_num"
                                    disabled={loadingRooms}
                                    options={rooms.map((r) => {
                                        return {
                                            label: r.room_num,
                                            id: r.room_num
                                        }
                                    })}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => <TextField {...params} label="Soba" />}
                                    onChange={onChangeAuto}
                                    value={auto}
                                />
                            </div>
                            <div className="form-row date-picker">
                                <LocalizationProvider dateAdapter={AdapterLuxon}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DateTimePicker
                                            format="dd/MM/yyyy HH:mm"
                                            label="  Prilagođen odabir termina"
                                            onChange={onChangeDate}
                                            disablePast
                                            ampm={false}
                                            shouldDisableTime={shouldDisableTime}
                                            shouldDisableDate={shouldDisableDate}
                                            views={['year', 'day', 'hours']}
                                            disabled={loadingTimes}
                                            disableHighlightToday={true}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                            </>
                        )}
                        
                    </div>
                    <div className="button-div">
                        <Button
                            type="submit"
                            variant="contained"
                            size="medium"
                            className="reg-btn"
                            disabled={disableSubmit}
                        >
                            Pošalji
                        </Button>
                    </div>
                </div>
            </form>
        </div>

    );
};

export default NewAppointment;
