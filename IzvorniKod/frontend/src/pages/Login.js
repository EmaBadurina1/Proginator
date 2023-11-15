/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import "./Login.css"

export default class Login extends Component {
  render() {
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
                />
              </div>
              <div className="mb-3">
                <label>Lozinka</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Unesi lozinku"
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
                <button type="submit" className="btn btn-primary w-auto">
                  Prijava
                </button>
              </div>
            </form>
          </div>
          <div className="col-3">
            <div className="registration-border text-center">
                <h5>Nemaš korisnički račun?</h5>
                <p>Registriraj se ovdje i postani naš pacijent:</p>
                <a href="/registration" class="btn btn-info">Registracija</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
