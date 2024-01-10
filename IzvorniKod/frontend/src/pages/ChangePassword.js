import React, { useState } from "react";
import { IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserAccountService from "../services/userAccountService";
import { LoginContext } from "../contexts/LoginContext";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "./ChangePassword.css";

const ChangePassword = () => {
  const { userData } = React.useContext(LoginContext);

  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });

  /* Show or hide password */
  const [showOldPass, setShowOldPass] = useState(false);

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the new password and repeat new password match
    if (values.newPassword !== values.repeatNewPassword) {
      toast.error("Unijeli ste različite lozinke za novu lozinku!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    await UserAccountService.updateUserPassword(
      userData.user_id,
      values.oldPassword,
      values.newPassword,
      values.repeatNewPassword
    );

    // Reset the form fields
    setValues({
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    });

    nav("/user-account");
  };

  const cancel = () => {
    nav("/user-account");
  };

  /* Show/hide password when called */
  const onClickShowOldPassword = () => {
    setShowOldPass(!showOldPass);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  /* Allowing password visibility button to be clicked */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit} className="password-form">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <h3 className="my-4">Promjena lozinke</h3>
          <Grid item xs={12}>
            <TextField
              sx={{ width: "100%", margin: "0px", padding: "0px" }}
              autoComplete="false"
              label="Trenutna lozinka"
              variant="outlined"
              name="oldPassword"
              onChange={handleChange}
              value={values.oldPassword}
              type={showOldPass ? "text" : "password"}
              InputProps={{
                // Rest of the code...

                endAdornment: (
                  <IconButton
                    size="medium"
                    aria-label="toggle password visibility"
                    onClick={onClickShowOldPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showOldPass ? (
                      <VisibilityOff fontSize="medium" />
                    ) : (
                      <Visibility fontSize="medium" />
                    )}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{ width: "100%", margin: "0px", padding: "0px" }}
              autoComplete="false"
              label="Nova lozinka"
              variant="outlined"
              name="newPassword"
              onChange={handleChange}
              value={values.newPassword}
              type="password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{ width: "100%", margin: "0px", padding: "0px" }}
              autoComplete="false"
              label="Ponovljena nova lozinka"
              variant="outlined"
              name="repeatNewPassword"
              onChange={handleChange}
              value={values.repeatNewPassword}
              type="password"
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" className="mt-4">
              <Button
                key="cancelBtn"
                color="error"
                variant="contained"
                size="medium"
                onClick={cancel}
              >
                Odustani
              </Button>
              <Button
                key="submitBtn"
                type="submit"
                className="reg-form-submit"
                variant="contained"
                size="medium"
              >
                Potvrdi
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ChangePassword;
