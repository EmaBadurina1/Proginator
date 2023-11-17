import React, { useState } from "react";
import "./Registration.css";

import AuthService from "../services/authService";
import { useNavigate } from "react-router-dom";

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

  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    AuthService.register(values).then((resp) => {
      if (resp.success) {
        nav("/login");
        // window.location.reload();
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-center h-full">
        <div className="col-6">
          <form className="registration-border" onSubmit={handleRegister}>
            <h3>Registracija - novi pacijent</h3>

            <div className="mb-3 mt-3">
              <div className="row">
                <div className="col-6">
                  <label>Ime</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Ime"
                    value={values.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label>Prezime</label>
                  <input
                    type="text"
                    name="surname"
                    className="form-control"
                    placeholder="Prezime"
                    value={values.surname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label>Email adresa</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Unesi email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Broj telefona</label>
              <input
                type="text"
                name="phone_number"
                className="form-control"
                placeholder="Unesi broj telefona"
                value={values.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Datum rođenja</label>
              <input
                type="date"
                name="date_of_birth"
                className="form-control"
                value={values.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>MBO</label>
              <input
                type="text"
                name="MBO"
                className="form-control"
                placeholder="Unesi matični broj osiguranika"
                value={values.MBO}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label>Lozinka</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Unesi lozinku"
                value={values.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-flex justify-content-end">
              <a href="/login" className="btn btn-secondary">
                Odustani
              </a>
              <button type="submit" className="btn btn-primary ms-3">
                Registracija
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
