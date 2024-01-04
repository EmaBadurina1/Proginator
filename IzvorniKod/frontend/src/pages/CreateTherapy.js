import { useState, React, useEffect } from "react";
import './CreateTherapy.css';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TextField } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";




const CreateTherapy = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    //const [lijecnik, setLijecnik] = useState('prviL');
    //const [lijecnici, setLijecnici] = useState([]);
    const [vrste, setVrste] = useState([]);
    const [isPending, setIsPending] = useState(false);

    //const navigate = useNavigate();
    // const [date, setDate] = useState(new Date());

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsPending(true);
    }

    useEffect(() => {
        const getTherapyTypes = async () => {
            try {
                const res = await axiosInstance.get("/therapy-types", {
                    "page": 1,
                    "page_size": 20
                })
                setVrste(res.data.data.therapy_types)
            }
            catch (err) {
                toast.error("Dogodila se greška!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        }
        getTherapyTypes();
    }, []);


    /*function dohvatiLiječnike() {
        axios
            .get("http://127.0.0.1/5000/therapies")
            .then(res => console.log(setLijecnici(res.data.lijecnici)))
            .catch(err => alert(err));
    }*/

    return (
        <div className="create">
            <h2>Prijavljivanje nove terapije</h2>
            <form onSubmit={handleSubmit}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={vrste.map((e) => {
                        return {
                            label: e.therapy_type_name,
                            id: e.therapy_type_id
                        }
                    })}
                    renderInput={(params) => <TextField {...params} label="Vrsta terapije" />}
                />


                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={['a', 'b']}

                    renderInput={(params) => <TextField {...params} label="Liječnik" />}
                />

                <div>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                disableFuture
                                format="dd/MM/yyyy"
                                label="Datum terapije"
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>

                <div className="postupak-lijecenja">
                    <TextField
                        autoComplete="false"
                        label="Zahtjevani postupak liječenja:"
                        variant="outlined"
                        name="OpisOboljenja"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                </div>

                <div className="postupak-lijecenja">
                    <TextField
                        autoComplete="false"
                        label="Zahtjevani postupak liječenja:"
                        variant="outlined"
                        name="OpisOboljenja"
                        onChange={(e) => setBody(e.target.value)}
                        value={body}
                    />
                </div>

                {!isPending && <button>Predaj zahtjev</button>}
                {isPending && <button disabled>Predaja...</button>}

            </form>
        </div>
    );
}

export default CreateTherapy;