import {React, useState} from "react";
import "./Login.css";

import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const form = useRef(null);
  // const checkBtn = useRef(null);
  const nav = useNavigate();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    AuthService.login(email, password).then(() => {
      nav("/home");
      window.location.reload();
    });
  };
  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-center h-full">
        <div className="col-4">
          <form className="login-border">
            <h3>Prijava</h3>

            <div className="mb-3 mt-5">
              <label>Email adresa</label>
              <input
                type="email"
                className="form-control"
                placeholder="Unesi email"
                value={email}
                onChange={(event) => onChangeEmail(event)}
              />
            </div>
            <div className="mb-3">
              <label>Lozinka</label>
              <input
                type="password"
                className="form-control"
                placeholder="Unesi lozinku"
                value={password}
                onChange={(event) => onChangePassword(event)}
              />
            </div>
            <div className="mb-5">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label
                  className="custom-control-label ms-1"
                  htmlFor="customCheck1"
                >
                  Zapamti me
                </label>
              </div>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary w-auto"
                onClick={(event) => handleLogin(event)}
              >
                Prijava
              </button>
            </div>
          </form>
        </div>
        <div className="col-3">
          <div className="registration-border text-center">
            <h5>Nemaš korisnički račun?</h5>
            <p>Registriraj se ovdje i postani naš pacijent:</p>
            <a href="/registration" className="btn btn-info">
              Registracija
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
