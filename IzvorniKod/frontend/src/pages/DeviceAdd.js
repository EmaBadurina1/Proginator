import React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import "./UserAccount.css";
import Box from "@mui/material/Box";
import DeviceService from "../services/deviceService";
import { useNavigate } from "react-router-dom";

const DeviceAdd = () => {

  const [values, setValues] = useState({
    device_id: "",
    device_type_id: "",
    room_num: "",
  });

  /* Object for highlighting the error fields */
  const [errors, setErrors] = useState({
    device_id: false,
    device_type_id: false,
    room_num: false,
  });

  /* Object for error description on error fields */
  const [helperText, setHelperText] = useState({
    device_id: "",
    device_type_id: "",
    room_num: "",
  });

  /* Disable submit button if form is not filled correctly */
  const [disableSubmit, setDisableSubmit] = useState(true);

  /* Text that is shown on submit button */
  const [submitMessage, setSubmitMessage] = useState("Unesi podatke");

  const [isEditing, setIsEditing] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    const isFilled = () => {
      if (values.device_id === "") return false;
      if (values.device_type_id === "") return false;
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

  /* Validate OIB, MBO, email and phone_number,
 the rest don't need validation because they
 are guaranteed in correct pattern or it's not
 possible to check their pattern */
  const validateInput = (name, value) => {
    if (name === "OIB") {
      checkRegex(
        name,
        value,
        /^[0-9]{11}$/,
        "OIB mora biti niz od 11 znamenki"
      );
    }
    if (name === "MBO") {
      checkRegex(name, value, /^[0-9]{9}$/, "MBO mora biti niz od 9 znamenki");
    }
    if (name === "email") {
      checkRegex(name, value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Pogrešan email");
    }
    if (name === "phone_number") {
      checkRegex(name, value, /^[\d\s\-+()/]{1,50}$/, "Pogrešan broj telefona");
    }
  };

  const handleDeviceAdd = async (e) => {
    e.preventDefault();
    let resp;

    const data = {
      device_id: values.device_id,
      device_type_id: values.device_type_id,
      room_num: values.room_num,
    };

    setIsEditing(false);
    resp = await DeviceService.addDevice(data);

    if (resp.success) {
      nav("/devices");
    } else {
      window.location.reload();
    }
  };

  const quitEdit = () => {
    nav("/devices");
  };

  return (
    <>
      <Container maxWidth="sm" className="profile-form">
        <div>
          <h1 className="mb-4">Novi uređaj</h1>
          <hr />
          <form onSubmit={handleDeviceAdd}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="ID"
                  variant="outlined"
                  name="device_id"
                  disabled={!isEditing}
                  onChange={handleChange}
                  value={values.device_id}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="Tip uređaja"
                  variant="outlined"
                  name="device_type_id"
                  disabled={!isEditing}
                  onChange={handleChange}
                  value={values.device_type_id}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="Soba"
                  variant="outlined"
                  name="room_num"
                  disabled={!isEditing}
                  onChange={handleChange}
                  error={errors.room_num}
                  helperText={helperText.room_num}
                  value={values.room_num}
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

export default DeviceAdd;
