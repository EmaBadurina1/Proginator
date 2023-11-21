import { React, useEffect, useState } from "react";
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { IconButton } from '@mui/material';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import axiosInstance from "../axiosInstance";
import "./UserAdd.css";

const UserAdd = () => {
   /* Object for sending to backend */
   const [form, setForm] = useState({
      "name": "",
      "surname": "",
      "email": "",
      "phone_number": "",
      "date_of_birth": "",
      "password": "",
      "OIB": "",
      "MBO": "",
      "role": ""
   });
   /* Object for highlighting the error fields */
   const [errors, setErrors] = useState({
      "email": false,
      "phone_number": false,
      "OIB": false,
      "MBO": false
   });
   /* Object for error description on error fields */
   const [helperText, setHelperText] = useState({
      "email": "",
      "phone_number": "",
      "OIB": "",
      "MBO": ""
   });
   /* Show or hide password */
   const [showPass, setShowPass] = useState(false);
   /* Disable OIB or MBO depending on which role is selected */
   const [disableOIB, setDisableOIB] = useState(true);
   const [disableMBO, setDisableMBO] = useState(true);
   /* Disable submit button if form is not filled correctly */
   const [disableSubmit, setDisableSubmit] = useState(true);
   /* Text that is shown on submit button */
   const [submitMessage, setSubmitMessage] = useState("Popuni obrazac");
   /* Navigate variable */
   const navigate = useNavigate();

   /* called after form is updated to
   check if form field are filled */
   useEffect(() => {
      /* Check if all required fields are filled */
      function isFilled() {
         if(form.name === "") return false;
         if(form.surname === "") return false;
         if(form.email === "") return false;
         if(errors.email === true) return false;
         if(form.phone_number === "") return false;
         if(errors.phone_number === true) return false;
         if(form.date_of_birth === "") return false;
         if(form.password === "") return false;
         if(form.role === "") return false;
         else {
            if(form.role === "patient") {
               if(form.MBO === "") return false;
               if(errors.MBO === true) return false;
            } else {
               if(form.OIB === "") return false;
               if(errors.OIB === true) return false;
            }
         }
         return true;
      }

      /* Set submit button to disable if
      all required fields are not filled
      and add text to submit button */
      let disabled = !isFilled();
      setDisableSubmit(disabled);
      if(disabled) {
         setSubmitMessage("Popuni obrazac");
      } else {
         setSubmitMessage("Dodaj korisnika");
      }
   }, [form, errors]);

   /* Set form object values whenever
   something in input form is changed */
   const onChange = (event) => {
      const {name, value} = event.target;

      setForm(oldForm => ({
         ...oldForm,
         [name]: value
      }));

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
      if(name === "OIB") {
         checkRegex(
            name,
            value,
            /^[0-9]{11}$/,
            "OIB mora biti niz od 11 znamenki"
         );
      }
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

   /* Set form object values whenever
   date input is changed */
   const onChangeDate = (date) => {
      let value = date.toFormat("yyyy-MM-dd");
      setForm(oldForm => ({
         ...oldForm,
         "date_of_birth": value
      }));
   };

   /* Set form object values whenever
   role select input is changed */
   const onChangeSelect = (event) => {
      let value = event.target.value;
      if(value == "patient") {
         setForm(oldForm => ({
            ...oldForm,
            "role": value,
            "OIB": ""
         }));
         setDisableMBO(false);
         setDisableOIB(true);
      }
      if(value == "doctor" || value == "admin") {
         setForm(oldForm => ({
            ...oldForm,
            "role": value,
            "MBO": ""
         }));
         setDisableMBO(true);
         setDisableOIB(false);
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

   /* Called on click on submit button,
   it's sending form data to backend */
   const onSubmit = async (e) => {
      e.preventDefault();
      setDisableSubmit(true);
      setSubmitMessage("Učitavanje...");
      try {
         let data = { ...form };
         let role = data["role"];
         let api = "";
         delete data.role;
         if(role == "patient") {
            delete data.OIB;
            api = "/patients";
         }
         if(role == "doctor") {
            delete data.MBO;
            data["is_active"] = true;
            data["is_admin"] = false;
            api = "/employees";
         }
         if(role == "admin") {
            delete data.MBO;
            data["is_active"] = true;
            data["is_admin"] = true;
            api = "/employees";
         }

         const response = await axiosInstance.post(api, data);
         
         if(response.ok) {
            toast.success(
               response.message,
               { position: toast.POSITION.TOP_RIGHT }
            );
            navigate("/home"); // kasnije skociti na rutu sa svim korisnicima
         }
      } catch (error) {
         if(error.response && error.response.status === 400) {
            toast.error(
               error.response.data.error,
               { position: toast.POSITION.TOP_RIGHT }
            );
         } else {
            toast.error(
               "Dogodila se greška prilikom dodavanja novog korisnika",
               { position: toast.POSITION.TOP_RIGHT }
            );
         }
         setSubmitMessage("Dodaj korisnika");
         setDisableSubmit(false);
      }
   };

   return (
      <div className="user-add">
         <div className="form">
            <form onSubmit={onSubmit}>
               <div className="form-row">
                  <TextField
                     autoComplete="false"
                     className="form-input"
                     label="Ime"
                     variant="outlined"
                     name="name"
                     onChange={onChange}
                     value={form.name}
                  />
                  <TextField
                     autoComplete="false"
                     className="form-input"
                     label="Prezime"
                     variant="outlined"
                     name="surname"
                     onChange={onChange}
                     value={form.surname}
                  />
               </div>
               <div className="form-row">
                  <TextField
                     autoComplete="false"
                     className="form-input"
                     label="E-mail"
                     variant="outlined"
                     name="email"
                     onChange={onChange}
                     value={form.email}
                     error={errors.email}
                     helperText={helperText.email}
                  />
               </div>
               <div className="form-row">
                  <TextField
                     autoComplete="false"
                     className="form-input"
                     label="Telefon"
                     variant="outlined"
                     name="phone_number"
                     onChange={onChange}
                     value={form.phone_number}
                     error={errors.phone_number}
                     helperText={helperText.phone_number}
                  />
               </div>
               <div className="form-row select-form">
                  <div className="form-input date-picker">
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
                  <div className="form-input select-role">
                     <FormControl>
                        <InputLabel htmlFor="role-select">
                           Uloga
                        </InputLabel>
                        <Select
                           labelId="role-select"
                           id="role-select"
                           name="role"
                           value={form.role}
                           label="Uloga"
                           onChange={onChangeSelect}
                        >
                           <MenuItem value="doctor">
                              Doktor
                           </MenuItem>
                           <MenuItem value="admin">
                              Admin
                           </MenuItem>
                           <MenuItem value="patient">
                              Pacijent
                           </MenuItem>
                        </Select>
                     </FormControl>
                  </div>
               </div>
               <div className="form-row">
                  <TextField
                     autoComplete="false"
                     className="form-input"
                     label="OIB"
                     variant="outlined"
                     name="OIB"
                     onChange={onChange}
                     value={form.OIB}
                     disabled={disableOIB}
                     error={errors.OIB}
                     helperText={helperText.OIB}
                  />
                  <TextField
                     autoComplete="false"
                     className="form-input"
                     label="MBO"
                     variant="outlined"
                     name="MBO"
                     onChange={onChange}
                     value={form.MBO}
                     disabled={disableMBO}
                     error={errors.MBO}
                     helperText={helperText.MBO}
                  />
               </div>
               <div className="form-row password">
                  <TextField
                     autoComplete="false"
                     className="form-input"
                     label="Lozinka"
                     variant="outlined"
                     name="password"
                     onChange={onChange}
                     value={form.password}
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
 
export default UserAdd;