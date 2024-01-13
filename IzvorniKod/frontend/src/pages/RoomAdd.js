import React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import RoomService from "../services/roomService";

const RoomAdd = () => {

  const [values, setValues] = useState({
    room_num: "",
    capacity: "",
    in_use: true,
  });

  /* Object for highlighting the error fields */
  const [errors, setErrors] = useState({
    room_num: false,
   capacity: false
  });

  /* Object for error description on error fields */
  const [helperText, setHelperText] = useState({
    room_num: "",
      capacity: ""
  });

  /* Disable submit button if form is not filled correctly */
  const [disableSubmit, setDisableSubmit] = useState(true);

  /* Text that is shown on submit button */
  const [submitMessage, setSubmitMessage] = useState("Unesi podatke");

  const nav = useNavigate();
  
  useEffect(() => {
    const isFilled = () => {
      if (values.capacity === "") return false;
      if (values.room_num === "") return false;
      return true;
    };

    let filled = isFilled();
    setDisableSubmit(!filled);
    if (filled) {
      setSubmitMessage("Potvrdi");
    } else {
      setSubmitMessage("Unesi podatke");
    }
  }, [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    /* Check if changed value is ok */
    validateInput(name, value);
  };

   const handleSwitchChange = (e) => {
      const { name, checked } = e.target;
      setValues({ ...values, [name]: checked });
   }

  /* Check if value is like regex, update
   errors and helperText after checking */
  const checkRegex = (name, value, regex, message) => {
    if (!regex.test(value) && value !== "") {
      setErrors((oldErrors) => ({
        ...oldErrors,
        [name]: true,
      }));
      setHelperText((oldText) => ({
        ...oldText,
        [name]: message,
      }));
    } else {
      setErrors((oldErrors) => ({
        ...oldErrors,
        [name]: false,
      }));
      setHelperText((oldText) => ({
        ...oldText,
        [name]: "",
      }));
    }
  };

   /* Check if input is valid */
  const validateInput = (name, value) => {
      if(name === "capacity"){
         checkRegex(name, value, /^(?:[0-9]|[1-9][0-9]{1,3}|10000)$/, "Kapacitet mora biti broj od 0 do 10000");
      }
  };

  const handleRoomAdd = async (e) => {
    e.preventDefault();
    let resp;

      const data = {
         room_num: values.room_num,
         capacity: values.capacity,
         in_use: values.in_use
      };
      
      resp = await RoomService.addRoom(
        data
      );
    
    if (resp.success) {
      nav("/rooms");
    } else {
      window.location.reload();
    }
  };

   const quitEdit = () => {
      nav("/rooms");
   }

  return (
    <>
      <Container maxWidth="sm" className="profile-form">
        <div>
          <h1 className="mb-4">Nova prostorija</h1>
          <hr />
          <form onSubmit={handleRoomAdd}>
            <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Typography variant="h6" className="mt-2" align="center">
                        {values.in_use ? "Dostupna" : "Nedostupna"}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                      <Switch
                        checked={values.in_use}
                        onChange={handleSwitchChange}
                        name="in_use"
                        label="Dostupnost"
                        inputProps={{ "aria-label": "controlled" }}
                        />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      className="mt-2"
                      sx={{ width: "100%" }}
                      autoComplete="false"
                      label="Broj sobe"
                      variant="outlined"
                      name="room_num"
                      onChange={handleChange}
                      error={errors.room_num}
                      helperText={helperText.room_num}
                      value={values.room_num}
                    />     
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      className="mt-2"
                      sx={{ width: "100%" }}
                      autoComplete="false"
                      label="Kapacitet"
                      variant="outlined"
                      name="capacity"
                      onChange={handleChange}
                      error={errors.capacity}
                      helperText={helperText.capacity}
                      value={values.capacity}
                    />
                  </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                    <>
                      <Button
                        key="cancelBtn"
                        color="error"
                        variant="contained"
                        size="medium"
                        className="mx-4"
                        onClick={quitEdit}
                      >
                        Odustani
                      </Button>
                      <Button
                        key="submitBtn"
                        type="submit"
                        className="reg-form-submit"
                        variant="contained"
                        size="medium"
                        // onClick={submitEdit}
                        disabled={disableSubmit}
                      >
                        {submitMessage}
                      </Button>
                    </>
                </Box>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default RoomAdd;
