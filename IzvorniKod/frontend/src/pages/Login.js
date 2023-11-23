import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import PropTypes from "prop-types";
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import AuthService from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(
    localStorage.rememberMe &&
    localStorage.rememberMe === "true" &&
    localStorage.email ?
    localStorage.email :
    ""
  );
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    localStorage.rememberMe &&
    localStorage.rememberMe === "true" ? 
    true : 
    false
  );
  /* Show or hide password */
  const [showPass, setShowPass] = useState(false);
  /* Disable submit button if form is not filled correctly */
  const [disableSubmit, setDisableSubmit] = useState(true);
  /* Text that is shown on submit button */
  const [submitMessage, setSubmitMessage] = useState("Unesi podatke");

  // const form = useRef(null);
  // const checkBtn = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    const isFilled = () => {
      if(password === "") return false;
      if(email === "") return false;
      return true;
    }

    let filled = isFilled();
    setDisableSubmit(!filled);
    if(filled) {
      setSubmitMessage("Prijava");
    } else {
      setSubmitMessage("Unesi podatke");
    }
  }, [email, password])

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  /* Show/hide password when called */
  const onClickShowPassword = () => {
    setShowPass(!showPass);
  };

  /* Allowing password visibility button to be clicked */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setDisableSubmit(true);
    setSubmitMessage("Učitavanje...");

    await AuthService.login(email, password).then((resp) => {
      if (resp.success) {
        onLogin();
        nav("/home");
        // window.location.reload();

        /* Add email to local storage if remember me is true */
        localStorage.rememberMe = rememberMe;
        if(rememberMe) {
          localStorage.email = email;
        } else {
          localStorage.email = "";
        }
      } else {
        setDisableSubmit(false);
        setSubmitMessage("Prijava");
      }
    });
  };

  return (
    <div className="login-page">
      <div className="login-border">
        <form
          onSubmit={handleLogin}
        >
          <h3>Prijava</h3>

          <div className="login-form-row">
            <TextField
              autoComplete="false"
              className="login-form-input"
              label="E-mail"
              variant="outlined"
              name="email"
              onChange={(event) => onChangeEmail(event)}
              value={email}
            />
          </div>
          <div className="login-form-row">
            <TextField
              autoComplete="false"
              className="login-form-input"
              label="Lozinka"
              variant="outlined"
              name="password"
              onChange={(event) => onChangePassword(event)}
              value={password}
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
          <div className="login-form-row">
            <FormControlLabel
              className="login-form-checkbox"
              control={
                <Checkbox
                  aria-label="Checkbox demo"
                  checked={rememberMe}
                  onChange={onChangeRememberMe}
                />
              } label="Zapamti me"
            />
          </div>
          <div className="login-form-row login-form-submit">
            <Button
              type="submit"
              className="login-form-button"
              variant="contained"
              size="medium"
              disabled={disableSubmit}
            >
              {submitMessage}
            </Button>
          </div>
        </form>
      </div>
      <div className="registration-border">
        <h5>Nemaš korisnički račun?</h5>
        <p>Registriraj se ovdje i postani naš pacijent</p>
        <Link to="/registration" className="btn btn-info">
          Registracija
        </Link>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func,
};

export default Login;
