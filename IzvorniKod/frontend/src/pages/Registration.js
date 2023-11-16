import React from "react";
import "./Registration.css";

export default function Registration() {
  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-center h-full">
        <div className="col-6">
          <form className="registration-border">
            <h3>Registracija - novi pacijent</h3>

            <div className="mb-3 mt-3">
              <label>Ime</label>
              <input type="text" className="form-control" placeholder="Ime" />
            </div>
            <div className="mb-3">
              <label>Prezime</label>
              <input
                type="text"
                className="form-control"
                placeholder="Prezime"
              />
            </div>
            <div className="mb-3">
              <label>MBO</label>
              <input
                type="text"
                className="form-control"
                placeholder="Unesi matični broj osiguranika"
              />
            </div>
            <div className="mb-3">
              <label>Email adresa</label>
              <input
                type="email"
                className="form-control"
                placeholder="Unesi email"
              />
            </div>
            <div className="mb-5">
              <label>Lozinka</label>
              <input
                type="password"
                className="form-control"
                placeholder="Unesi lozinku"
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
