import { React, useState } from "react";
import "./ChangeAppointment.css";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import Button from "@mui/material/Button";
const NewAppointment = () => {
    const [form, setForm] = useState({
        "therapy_id": null,
        "date_from": null
    });

    const buttonStyle = {
        backgroundColor: "orange",
        float: "right",
        marginRight: "5em",
        marginBottom: "2em",
    };


    const onChangeDate = (date) => {
        let value = date.toFormat("yyyy-MM-dd HH:mm");
        setForm(oldForm => ({
            ...oldForm,
            "date_from": value
        }));
    }

    const onSubmit = () => {
        console.log(form);
    }

    return (
        <div className="container-div2">
            <form action={onSubmit}>
                <div className="mini-container3">
                    <div className="title-div3">
                        <h2>Zahtjev za novim terminom</h2>
                    </div>
                    <div className="border-container2">
                        <br></br>
                        <div className="form-row date-picker">
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                                <DemoContainer components={['DatePicker']}>
                                    <DateTimePicker
                                        format="dd/MM/yyyy HH:mm"
                                        label="  Prilagođen odabir termina"
                                        onChange={onChangeDate}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>

                        <br></br>

                    </div>
                    <div className="button-div">
                        <Button
                            type="submit"
                            variant="contained"
                            size="medium"
                            className="reg-btn"
                            style={buttonStyle}
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
