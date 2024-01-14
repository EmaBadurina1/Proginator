import { React, useEffect, useState } from "react"
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";
import "./ResetPassword.css"
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
   const [email, setEmail] = useState("");
   const [disabled, setDisabled] = useState(true);
   const [error, setError] = useState("");

   const nav = useNavigate();

   useEffect(() => {
      const validEmail = () => {
         const invalid = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && email !== "";
         if(invalid) {
            setError("Pogrešan e-mail")
            return false;
         } else {
            setError("");
            return true;
         }
      }
      if(validEmail()) {
         if(email === "") setDisabled(true);
         else setDisabled(false);
      } else {
         setDisabled(true);
      }
   }, [email]);

   const sendPassword = async () => {
      setDisabled(true);
      try {
         const res = await axiosInstance.post("/reset-password", {
            "email": email
         });
         if(res.status == 200) {
            setDisabled(false);
            toast.info("Jednokratna lozinka je poslana na e-mail adresu: " + email, {
               position: toast.POSITION.BOTTOM_RIGHT,
            });
         }
         nav("/login");
      }
      catch (err) {
         setDisabled(false);
         toast.error(err.response.data.error + "!", {
            position: toast.POSITION.BOTTOM_RIGHT,
         });
      }
   }

   const onSubmit = (e) => {
      e.preventDefault();
      const confirm = window.confirm("Jeste li sigurni da želite resetirati svoju lozinku? Jednokratna lozinka bit će poslana na e-mail adresu: " + email);
      if(confirm) {
         sendPassword();
      }
   }

   const onChangeEmail = (event) => {
      const value = event.target.value;
      setEmail(value);

      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email !== "";
      if(!valid) {
         setError("Pogrešan e-mail")
      } else {
         setError("");
      }
   }

   return (
      <div className="reset-password">
         <form onSubmit={onSubmit} className="form">
            <h3>Zaboravljena lozinka</h3>
            <TextField
               autoComplete="false"
               className="form-input"
               label="E-mail"
               variant="outlined"
               name="email"
               onChange={(event) => onChangeEmail(event)}
               value={email}
               error={error !== ""}
               helperText={error}
            />
            <Button
               variant="contained"
               className="submit-btn"
               size="medium"
               disabled={disabled}
               type="submit"
            >
               Resetiraj lozinku
            </Button>
         </form>
      </div>
   );
}
 
export default ResetPassword;