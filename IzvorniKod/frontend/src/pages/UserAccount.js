import React from "react";
import { LoginContext } from "../contexts/LoginContext";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import "./UserAccount.css";
import { Typography } from "@mui/material";
import { DateTime } from "luxon";
import Box from "@mui/material/Box";
import UserAccountUpdateService from "../services/userAccountUpdateService";
import { useNavigate } from "react-router-dom";

const UserAccount = () => {
  const { userData, userRole, setUserData } = React.useContext(LoginContext);

  const [values, setValues] = useState({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    MBO: "",
    OIB: "",
  });

  /* Object for highlighting the error fields */
  const [errors, setErrors] = useState({
    email: false,
    phone_number: false,
    MBO: false,
    OIB: false,
  });

  /* Object for error description on error fields */
  const [helperText, setHelperText] = useState({
    email: "",
    phone_number: "",
    MBO: "",
    OIB: "",
  });


  /* Disable submit button if form is not filled correctly */
  const [disableSubmit, setDisableSubmit] = useState(true);

  /* Text that is shown on submit button */
  const [submitMessage, setSubmitMessage] = useState("Unesi podatke");

  const [isEditing, setIsEditing] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    // set values from user data if user data is not null
    if (userData === null) return;
    setValues({
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      phone_number: userData.phone_number,
      date_of_birth: new Date(userData.date_of_birth).toISOString(),
      MBO: userData.MBO,
      OIB: userData.OIB,
    });
  }, [userData]);

  useEffect(() => {

    const isFilled = () => {
      if (values.name === "") return false;
      if (values.surname === "") return false;
      if (values.email === "") return false;
      if (values.phone_number === "") return false;
      if (values.date_of_birth === "") return false;
      if (values.MBO === "") return false;
      if (values.OIB === "") return false;
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
      checkRegex(name, value, /^[0-9]{11}$/, "OIB mora biti niz od 11 znamenki");
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


  /* Set form object values whenever
   date input is changed */
  const onChangeDate = (date) => {
    let value = date.toFormat("yyyy-MM-dd");
    setValues((oldForm) => ({
      ...oldForm,
      date_of_birth: value,
    }));
  };

  const handleProfileChange = async (e) => {
    e.preventDefault();
    let resp;
    
    if(userRole === "patient"){
      const data = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone_number: values.phone_number,
        date_of_birth: values.date_of_birth,
        MBO: values.MBO,
      };
      setIsEditing(false);
      resp = await UserAccountUpdateService.updatePatientProfile(userData.user_id, data);
    }
    else{
      const data = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone_number: values.phone_number,
        date_of_birth: values.date_of_birth,
        OIB: values.OIB,
      };
      setIsEditing(false);
      resp = await UserAccountUpdateService.updateEmployeeProfile(userData.user_id, data);
    }
    if(resp.success){
      setUserData(resp.user_data);
      localStorage.setItem("user_data", JSON.stringify(resp.user_data));
    }
    else{
      window.location.reload();
    }
  };

  const enableEdit = () => {
    setIsEditing(true);
  };

  const quitEdit = () => {
    setIsEditing(false);
  };

  const changePassword = () => {
    nav("/change-password");
  }

  return (
    <>
      <Container maxWidth="md" className="profile-form">
        <div>
          <h1 className="mb-4">Moji korisnički podaci</h1>
          <Typography variant="h6" className="mt-2" align="right">
            {userRole == "admin"
              ? "Administrator"
              : userRole == "employee"
              ? "Djelatnik"
              : "Pacijent"}
          </Typography>
          <hr />
          <form onSubmit={handleProfileChange}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="Ime"
                  variant="outlined"
                  name="name"
                  disabled={!isEditing}
                  onChange={handleChange}
                  value={values.name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="Prezime"
                  variant="outlined"
                  name="surname"
                  disabled={!isEditing}
                  onChange={handleChange}
                  value={values.surname}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="E-mail"
                  variant="outlined"
                  name="email"
                  disabled={!isEditing}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={helperText.email}
                  value={values.email}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="Telefon"
                  variant="outlined"
                  name="phone_number"
                  disabled={!isEditing}
                  onChange={handleChange}
                  error={errors.phone_number}
                  helperText={helperText.phone_number}
                  value={values.phone_number}
                />
              </Grid>

              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      sx={{
                        width: "100%",
                        padding: "0!important",
                        margin: "0!important",
                      }}
                      disableFuture
                      format="dd/MM/yyyy"
                      label="Datum rođenja"
                      disabled={!isEditing}
                      value={DateTime.fromISO(values.date_of_birth)}
                      onChange={onChangeDate}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              {userRole == "patient" ? (
                <Grid item xs={6}>
                  <TextField
                    className="mt-2"
                    sx={{ width: "100%" }}
                    autoComplete="false"
                    label="MBO"
                    variant="outlined"
                    name="MBO"
                    disabled={!isEditing}
                    onChange={handleChange}
                    error={errors.MBO}
                    helperText={helperText.MBO}
                    value={values.MBO}
                  />
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <TextField
                    className="mt-2"
                    sx={{
                      width: "100%",
                    }}
                    autoComplete="false"
                    label="OIB"
                    variant="outlined"
                    name="OIB"
                    disabled={!isEditing}
                    onChange={handleChange}
                    error={errors.OIB}
                    helperText={helperText.OIB}
                    value={values.OIB}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  {isEditing ? (
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
                  ) : (
                    <>
                    <Button
                      key="changePasswordBtn"
                      color="primary"
                      variant="contained"
                      size="medium"
                      className="mx-4"
                      onClick={changePassword}
                    >
                      Promijeni lozinku
                    </Button>
                    <Button
                      key="editBtn"
                      color="primary"
                      variant="contained"
                      size="medium"
                      className="mx-4"
                      onClick={enableEdit}
                    >
                      Promijeni podatke
                    </Button>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default UserAccount;
