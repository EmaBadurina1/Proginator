import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import AuthService from "../services/authService";
import "./Registration.css";

export default function Registration() {
  const [values, setValues] = useState({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    MBO: "",
    password: "",
  });

  /* Object for highlighting the error fields */
  const [errors, setErrors] = useState({
    "email": false,
    "phone_number": false,
    "MBO": false
  });

  /* Object for error description on error fields */
  const [helperText, setHelperText] = useState({
    "email": "",
    "phone_number": "",
    "MBO": ""
  });

  /* Show or hide password */
  const [showPass, setShowPass] = useState(false);

  /* Disable submit button if form is not filled correctly */
  const [disableSubmit, setDisableSubmit] = useState(true);

  /* Text that is shown on submit button */
  const [submitMessage, setSubmitMessage] = useState("Unesi podatke");

  const nav = useNavigate();

  useEffect(() => {
    const isFilled = () => {
      if(values.name === "") return false;
      if(values.surname === "") return false;
      if(values.email === "") return false;
      if(values.phone_number === "") return false;
      if(values.date_of_birth === "") return false;
      if(values.MBO === "") return false;
      if(values.password === "") return false;
      return true;
    }

    let filled = isFilled();
    setDisableSubmit(!filled);
    if(filled) {
      setSubmitMessage("Registriraj se");
    } else {
      setSubmitMessage("Unesi podatke");
    }
  }, [values])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    /* Check if changed value is ok */
    validateInput(name, value);
  };

  /* Check if value is like regex, update
   errors and helperText after checking */
  const checkRegex = (name, value, regex, message) => {
    if(!regex.test(value) && value !== "") {
      setErrors(oldErrors => ({
        ...oldErrors,
        [name]: true
      }));
      setHelperText(oldText => ({
        ...oldText,
        [name]: message
      }));
    } else {
      setErrors(oldErrors => ({
        ...oldErrors,
        [name]: false
      }));
      setHelperText(oldText => ({
        ...oldText,
        [name]: ""
      }));
    }
  };

 /* Validate OIB, MBO, email and phone_number,
 the rest don't need validation because they
 are guaranteed in correct pattern or it's not
 possible to check their pattern */
 const validateInput = (name, value) => {
    if(name === "MBO") {
      checkRegex(
        name,
        value,
        /^[0-9]{9}$/,
        "MBO mora biti niz od 9 znamenki"
      );
    }
    if(name === "email") {
      checkRegex(
        name,
        value,
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Pogrešan email"
      );
    }
    if(name === "phone_number") {
      checkRegex(
        name,
        value,
        /^[\d\s\-+()/]{1,50}$/,
        "Pogrešan broj telefona"
      );
    }
  };

  /* Show/hide password when called */
  const onClickShowPassword = () => {
    setShowPass(!showPass);
  };

  /* Allowing password visibility button to be clicked */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /* Set form object values whenever
   date input is changed */
  const onChangeDate = (date) => {
    let value = date.toFormat("yyyy-MM-dd");
    setValues(oldForm => ({
      ...oldForm,
      "date_of_birth": value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setDisableSubmit(true);
    setSubmitMessage("Učitavanje...");

    AuthService.register(values).then((resp) => {
      if (resp.success) {
        nav("/registrated/" + values.email);
        // window.location.reload();
      } else {
        setDisableSubmit(false);
        setSubmitMessage("Registriraj se");
      }
    });
  };

  return (
    <div className="registration">
      <div className="reg-form">
        <h3>Registracija</h3>
        <h4>novi pacijent</h4>
        <form onSubmit={handleRegister}>
          <div className="reg-form-row">
            <TextField
              autoComplete="false"
              className="reg-form-input"
              label="Ime"
              variant="outlined"
              name="name"
              onChange={handleChange}
              value={values.name}
            />
            <TextField
              autoComplete="false"
              className="reg-form-input"
              label="Prezime"
              variant="outlined"
              name="surname"
              onChange={handleChange}
              value={values.surname}
            />
          </div>
          <div className="reg-form-row">
            <TextField
              autoComplete="false"
              className="reg-form-input"
              label="E-mail"
              variant="outlined"
              name="email"
              onChange={handleChange}
              error={errors.email}
              helperText={helperText.email}
              value={values.email}
            />
            <TextField
              autoComplete="false"
              className="reg-form-input"
              label="Telefon"
              variant="outlined"
              name="phone_number"
              onChange={handleChange}
              error={errors.phone_number}
              helperText={helperText.phone_number}
              value={values.phone_number}
            />
          </div>
          <div className="reg-form-row reg-form-date">
            <div className="reg-form-input reg-date-picker">
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      disableFuture
                      format="dd/MM/yyyy"
                      label="Datum rođenja"
                      onChange={onChangeDate}
                    />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="reg-form-input reg-MBO-input">
              <TextField
                autoComplete="false"
                label="MBO"
                variant="outlined"
                name="MBO"
                onChange={handleChange}
                error={errors.MBO}
                helperText={helperText.MBO}
                value={values.MBO}
              />
            </div>
          </div>
          <div className="reg-form-row reg-password">
            <TextField
              autoComplete="false"
              className="reg-form-input"
              label="Lozinka"
              variant="outlined"
              name="password"
              onChange={handleChange}
              value={values.password}
              type={showPass ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <IconButton
                    size="medium"
                    aria-label="toggle password visibility"
                    onClick={onClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPass ? (
                      <VisibilityOff fontSize="medium" />
                    ) : (
                      <Visibility fontSize="medium" />
                    )}
                  </IconButton>
                )
              }}
            />
          </div>
          <div className="reg-form-row reg-form-buttons">
            <Button
              variant="contained"
              size="medium"
              className="reg-btn-cancel"
              onClick={() => nav("/login")}
            >
              Odustani
            </Button>
            <Button
              type="submit"
              className="reg-form-submit"
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
