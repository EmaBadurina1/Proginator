import { React, useContext } from "react";
import "./PatientPreview.css";
import {
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from "@mui/material";
//import TextField from "@mui/material/TextField";
import TableCell from "@mui/material/TableCell";
import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
//import SearchIcon from "@mui/icons-material/Search";
//import ForwardIcon from '@mui/icons-material/Forward';
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";


const MyTherapies = () => {
    const context = useContext(LoginContext);
    const user_id = useRef({ value: context.userData.user_id });
    const cellStyle = {
        textAlign: "center",
    };

    const cellStyle2 = {
        textAlign: "center",
        border: "0.1em solid black",
    };

    const buttonStyle = {
        backgroundColor: "purple",
    };

    //const [searchInput, setSearchInput] = useState("");

    //test podatci
    const [therapies, setTherapies] = useState([]);

    useEffect(() => {
        const getTherapies = async () => {
            try {
                const res = await axiosInstance.get("/therapies/by-patient/" + user_id.current.value, {
                    params: {
                        page: 1,
                        page_size: 20
                    }
                });
                setTherapies(res.data.data.therapies);
            }
            catch (err) {
                toast.error("Dogodila se greška!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
        getTherapies();
    }, []);

    //   const onChangeSearch = (e) => {
    //     setSearchInput(e.target.value);
    //     getFilteredTherapies(e.target.value);
    //   };

    //   const getFilteredTherapies = (v) => {
    //     fetch("http://localhost:8000/therapies")
    //       .then((res) => {
    //         return res.json();
    //       })
    //       .then((data) => {
    //         const getFilteredTherapies = data.filter((patient) => {
    //           return (
    //             therapy &&
    //             (
    //               patient.name.toLowerCase() +
    //               " " +
    //               patient.surname.toLowerCase()
    //             ).includes(v.toLowerCase())
    //           );
    //         });
    //         setTherapies(filteredTherapies);
    //       });
    //   };

    return (
        <div className="main-container">
            <div className="header">
                <div className="title-div">
                    <h2>Moje terapije</h2>
                </div>
                {/* <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon style={searchIconStyle} />
              </InputAdornment>
            ),
          }}
          autoComplete="false"
          className="pretraga"
          label="Pretraga"
          variant="outlined"
          name="pretraga"
          onChange={(event) => onChangeSearch(event)}
          value={searchInput}
        /> */}
            </div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow className="prviRed">
                            <TableCell style={cellStyle}>Datum početka</TableCell>
                            <TableCell style={cellStyle}>Datum završetka</TableCell>
                            <TableCell style={cellStyle}>Vrsta terapije</TableCell>
                            {/* <TableCell style={cellStyle}>Liječnik koji vas je uputio</TableCell> */}
                            <TableCell style={cellStyle}>Zahtjev za postupkom liječenja</TableCell>
                            <TableCell style={cellStyle}>Opis oboljenja</TableCell>
                            <TableCell style={cellStyle}>Akcija</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {therapies &&
                            therapies.map((therapy) => (
                                <TableRow key={therapy.therapy_id}>
                                    <TableCell style={cellStyle2}>{therapy.date_from}</TableCell>
                                    <TableCell style={cellStyle2}>{therapy.date_to}</TableCell>
                                    <TableCell style={cellStyle2}>{therapy.therapy_type.therapy_type_name}</TableCell>
                                    {/* <TableCell style={cellStyle2}>{therapy.doctor.name + ' ' + therapy.doctor.surname}</TableCell> */}
                                    <TableCell style={cellStyle2}>{therapy.req_treatment}</TableCell>
                                    <TableCell style={cellStyle2}>{therapy.disease_descr}</TableCell>
                                    <TableCell style={cellStyle2}>
                                        <div>

                                            <Link to={`/my-therapies/${therapy.therapy_id}`}>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    className="reg-btn"
                                                    style={buttonStyle}
                                                >
                                                    Prikaži terapiju
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );

};

export default MyTherapies;