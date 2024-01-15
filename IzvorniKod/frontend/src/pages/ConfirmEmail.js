import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";
import "./ConfirmEmail.css";

const ConfirmEmail = () => {
   const { id } = useParams()

   const [loading, setLoading] = useState(true);
   const [allowed, setAllowed] = useState(false);

   const nav = useNavigate();

   useEffect(() => {
      setLoading(true);
      const confirm = async () => {
         try {
            const res = await axiosInstance.get("/confirm-email/" + id);
            if(res.status == 200) {
               setAllowed(true);
            }
            setLoading(false);
         }
         catch (err) {
            setLoading(false);
            setAllowed(false);
            toast.error(err.response.data.message + "!", {
               position: toast.POSITION.BOTTOM_RIGHT,
            });
         }
      }
      confirm();
   }, [id])

   return (
      <div className="confirm-email">
         {loading && (
            <CircularProgress size={60}/>
         )}
         {!loading && (
            <>
               {allowed ? (
                  <div className="conteiner">
                     <h2>Uspješno ste potvrdili svoj e-mail</h2>
                     <Button
                        type="submit"
                        variant="contained"
                        size="medium"
                        onClick={() => nav("/login")}
                     >
                        Prijava
                     </Button>
                  </div>
               ) : (
                  <div className="conteiner">
                     <h2>Nemate pristup ovoj stranici</h2>
                  </div>
               )}
            </>
         )}
      </div>
   );
}
 
export default ConfirmEmail;