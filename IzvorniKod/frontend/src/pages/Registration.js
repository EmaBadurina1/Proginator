import React from "react";
import "./Registration.css";

export default function Registration() {

  // const [values, setValues] = useState({
  //   Firstname: "", 
  //   Middlename: "", 
  //   Lastname: "",
  //   DOB: "",
  //   Gender: ""
  // });

  // const handleChange = e => {
  //   const {name, value} = e.target
  //   setValues({...values, [name]: value})
  // }

  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-center h-full">
        <div className="col-6">
          <form className="registration-border">
            <h3>Registracija - novi pacijent</h3>

            <div className="mb-3 mt-3">
              <label>Ime</label>
              <input type="text" name="Name" className="form-control" placeholder="Ime" />
            </div>
            <div className="mb-3">
              <label>Prezime</label>
              <input
                type="text"
                name = "Surname"
                className="form-control"
                placeholder="Prezime"
              />
            </div>
            <div className="mb-3">
              <label>MBO</label>
              <input
                type="text"
                name = "MBO"
                className="form-control"
                placeholder="Unesi matični broj osiguranika"
              />
            </div>
            <div className="mb-3">
              <label>Email adresa</label>
              <input
                type="email"
                name="Email"
                className="form-control"
                placeholder="Unesi email"
              />
            </div>
            <div className="mb-5">
              <label>Lozinka</label>
              <input
                type="password"
                name="Password"
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
