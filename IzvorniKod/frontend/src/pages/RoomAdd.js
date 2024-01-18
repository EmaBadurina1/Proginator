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
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

const RoomAdd = () => {
  const [values, setValues] = useState({
    room_num: "",
    capacity: "",
    in_use: true,
    therapy_types: [],
  });

  const [therapyTypes, setTherapyTypes] = useState([]);

  /* Object for highlighting the error fields */
  const [errors, setErrors] = useState({
    room_num: false,
    capacity: false,
  });

  /* Object for error description on error fields */
  const [helperText, setHelperText] = useState({
    room_num: "",
    capacity: "",
  });

  /* Disable submit button if form is not filled correctly */
  const [disableSubmit, setDisableSubmit] = useState(true);

  /* Text that is shown on submit button */
  const [submitMessage, setSubmitMessage] = useState("Unesi podatke");

  const nav = useNavigate();

  useEffect(() => {
    const getTherapyTypes = async () => {
      const response = await RoomService.getAllTherapyTypes();
      setTherapyTypes(response);
    };
    getTherapyTypes();
  }, []);

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
  };

  const handleMultiSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setValues({...values, therapy_types:(typeof value === 'string' ? value.split(',') : value)}
    );
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

  /* Check if input is valid */
  const validateInput = (name, value) => {
    if (name === "capacity") {
      checkRegex(
        name,
        value,
        /^(?:[0-9]|[1-9][0-9]{1,3}|10000)$/,
        "Kapacitet mora biti broj od 0 do 10000"
      );
    }
  };

  const handleRoomAdd = async (e) => {
    e.preventDefault();
    let resp;

    const data = {
      room_num: values.room_num,
      capacity: values.capacity,
      in_use: values.in_use,
      therapy_types: values.therapy_types,
    };

    resp = await RoomService.addRoom(data);

    if (resp.success) {
      nav("/rooms");
    }
  };

  const quitEdit = () => {
    nav("/rooms");
  };

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
                <FormControl sx={{ width: "100%", padding: "0", margin: "0!important" }}>
                  <InputLabel id="demo-multiple-checkbox-label">Vrste terapija</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    sx={{ width: "100%", padding: "0", margin: "0!important" }}
                    multiple
                    value={values.therapy_types}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput label="Vrste terapija" />}
                    renderValue={(selected) => selected.join(", ")}
                    // MenuProps={MenuProps}
                  >
                    {therapyTypes && therapyTypes.map((therapyType) => (
                      <MenuItem key={therapyType.therapy_type_id} value={therapyType.therapy_type_id}>
                        <Checkbox checked={values.therapy_types.indexOf(therapyType.therapy_type_id) > -1} />
                        <ListItemText primary={therapyType.therapy_type_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
