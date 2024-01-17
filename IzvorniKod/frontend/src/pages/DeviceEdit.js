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
import { useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import RoomService from "../services/roomService";

const DeviceEdit = () => {
  const { deviceId } = useParams();

  const [deviceData, setDeviceData] = useState(null);

  const [deviceTypes, setDeviceTypes] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [values, setValues] = useState({
    device_id: "",
    device_type_id: "",
    room: "",
  });

  /* Object for highlighting the error fields */
  const [errors, setErrors] = useState({
    device_id: false,
    device_type_id: false,
    room: false,
  });


  /* Disable submit button if form is not filled correctly */
  const [disableSubmit, setDisableSubmit] = useState(true);

  /* Text that is shown on submit button */
  const [submitMessage, setSubmitMessage] = useState("Unesi podatke");

  const nav = useNavigate();

  useEffect(() => {
    const getDeviceData = async () => {
      const response = await DeviceService.getDeviceById(deviceId);
      response.room = JSON.stringify({capacity: response.room.capacity, room_num: response.room.room_num});
      setDeviceData(response);
    };
    const getDeviceTypes = async () => {
      const deviceTypesFromServer = await DeviceService.getAllDeviceTypes();
      setDeviceTypes(deviceTypesFromServer);
    };
    const getRooms = async () => {
      const roomsFromServer = await RoomService.getAllRooms();
      for (let i = 0; i < roomsFromServer.length; i++) {
        delete roomsFromServer[i].devices;
        delete roomsFromServer[i].in_use;
        delete roomsFromServer[i].therapy_types;
      }
      setRooms(roomsFromServer);
    }
    getDeviceTypes();
    getRooms();
    getDeviceData();
  }, [deviceId]);

  useEffect(() => {
    // set values from user data if user data is not null
    if (deviceData === null) return;
    setValues({
      device_id: deviceData.device_id,
      device_type_id: deviceData.device_type.device_type_id,
      room: deviceData.room,
    });
  }, [deviceData]);

  useEffect(() => {
    const isFilled = () => {
      if (values.device_id === "") return false;
      if (values.device_type_id === "") return false;
      if (values.room === "") return false;
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
  const checkRegex = (name, value, regex) => {
    if (!regex.test(value) && value !== "") {
      setErrors((oldErrors) => ({
        ...oldErrors,
        [name]: true,
      }));
    } else {
      setErrors((oldErrors) => ({
        ...oldErrors,
        [name]: false,
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

  const handleDeviceChange = async (e) => {
    e.preventDefault();
    let resp;

    const data = {
      device_id: values.device_id,
      device_type_id: values.device_type_id,
      room_num: JSON.parse(values.room).room_num,
    };

    resp = await DeviceService.updateDevice(deviceId, data);

    if (resp.success) {
      setDeviceData(resp.data);
      nav("/devices");
    }
  };

  const quitEdit = () => {
    setValues({
      device_id: deviceData.device_id,
      device_type_id: deviceData.device_type.device_type_id,
      room: deviceData.room,
    });
    nav("/devices");
  };
  
  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <>
      <Container maxWidth="sm" className="profile-form">
        <div>
          <h1 className="mb-4">Uređivanje uređaja</h1>
          <hr />
          <form onSubmit={handleDeviceChange}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="ID"
                  variant="outlined"
                  name="device_id"
                  disabled={true}
                  onChange={handleChange}
                  value={values.device_id}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{width: "100%", padding: "0", margin: "0!important"}}>
                <InputLabel id="demo-simple-select-helper-label">
                  Vrsta uređaja
                </InputLabel>
                <Select
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={values.device_type_id}
                  label="Vrsta uređaja"
                  name="device_type_id"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Odaberite vrstu</em>
                  </MenuItem>
                  {deviceTypes && deviceTypes.map((deviceType) => (
                    <MenuItem key={deviceType.device_type_id} value={deviceType.device_type_id}>
                      {deviceType.device_type_name}
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{width: "100%", padding: "0", margin: "0!important"}}>
                <InputLabel id="room-num-label">
                  Soba
                </InputLabel>
                <Select
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  labelId="room-num-label"
                  value={values.room}
                  label="Soba"
                  name="room"
                  error={errors.room}
                  onChange={handleRoomChange}
                >
                  <MenuItem value="">
                    <em>Odaberite sobu</em>
                  </MenuItem>
                  {rooms && rooms.map((room) => (
                    <MenuItem key={room.room_num} value={JSON.stringify(room)}>
                      {room.room_num}
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{ width: "100%", padding: "0", margin: "0!important" }}
                  autoComplete="false"
                  className="reg-form-input"
                  label="Kapacitet sobe"
                  variant="outlined"
                  name="room.capacity"
                  disabled={true}
                  value={values.room == "" ? "" : JSON.parse(values.room).capacity}
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

export default DeviceEdit;
