import { React, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";
import "./Registrated.css";

const Registrated = () => {
   const { email } = useParams()

   const [allowed, setAllowed] = useState(false);
   const [disabled, setDisabled] = useState(false);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setLoading(true);
      const checkUser = async () => {
         try {
            const res = await axiosInstance.get("/check-account/" + email);
            if(res.status == 200) {
               setAllowed(true);
            }
            setLoading(false);
         }
         catch (err) {
            setAllowed(false);
            setLoading(false);
         }
      }
      checkUser();
   }, [email]);

   const buttonAction = async () => {
      setDisabled(true);
      try {
         const res = await axiosInstance.post("/resend-email", {
            "email": email
         });
         if(res.status == 200) {
            setDisabled(false);
            toast.success("E-mail uspješno poslan!", {
               position: toast.POSITION.BOTTOM_RIGHT,
            });
         }
      }
      catch (err) {
         setDisabled(false);
         toast.error("Dogodila se greška!", {
            position: toast.POSITION.BOTTOM_RIGHT,
         });
      }
   }

   return (
      <div className="registrated">
         {loading === false && (
            <>
               {allowed ? (
                  <div className="conteiner">
                     <h2>Potvrdite svoj e-mail - {email}</h2>
                     <p>Na vašu e-mail adresu poslan je link za verifikaciju vaše e-mail adrese.</p>
                     <p>Ukoliko niste zaprimili e-mail kliknite gumb ispod.</p>
                     <Button
                        type="submit"
                        variant="contained"
                        size="medium"
                        onClick={buttonAction}
                        disabled={disabled}
                     >
                        Pošalji ponovo
                     </Button>
                  </div>
               ) : (
                  <div className="conteiner">
                     <h2>Nemate pristup ovoj stranici</h2>
                  </div>
               )}
            </>
         )}
         {loading &&
            <CircularProgress size={60}/>
         }
      </div>
   );
}
 
export default Registrated;