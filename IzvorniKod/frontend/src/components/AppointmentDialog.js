import { React, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { parseDateTimeInterval } from "../services/utils";
import { toast } from "react-toastify";
import { DateTime } from 'luxon';
import axiosInstance from "../axiosInstance";
import PropTypes from 'prop-types';
import "./AppointmentDialog.css";

const AppointmentDialog = ({ appointment, open, setOpen, setRe, re }) => {

   const [disabled, setDisabled] = useState(false);

   const handleClose = () => {
      setOpen(false);
   };

   const cancelAppointment = async () => {
      setDisabled(true);
      try {
         const res = await axiosInstance.patch("/appointments/" + appointment.appointment_id,{
            "status_id": 4,
            "date_from": DateTime.fromRFC2822(appointment.date_from).toFormat("yyyy-MM-dd HH:mm")
         });
         if(res.status === 200) {
            toast.success("Uspješno ste otkazali termin!", {
               position: toast.POSITION.BOTTOM_RIGHT,
            });
            setOpen(false);
            setRe(!re);
         }
         setDisabled(false);
      }
      catch (err) {
         toast.error("Dogodila se greška!", {
            position: toast.POSITION.BOTTOM_RIGHT,
         });
         setDisabled(false);
      }
   }

   return (
      <Dialog
         open={open}
         onClose={handleClose}
         scroll="body"
         aria-labelledby="scroll-dialog-title"
         aria-describedby="scroll-dialog-description"
      >
         <DialogTitle id="scroll-dialog-title">Termin</DialogTitle>
         <DialogContent>
            <div className="dialog-content">
               <span><strong>Vrijeme:</strong> {parseDateTimeInterval(appointment.date_from, appointment.date_to)}</span>
               <span><strong>Soba:</strong> {appointment.room && appointment.room.room_num}</span>
               <span><strong>Liječnik:</strong> {appointment.employee && (appointment.employee.name + " " + appointment.employee.surname)}</span>
               <span><strong>Status:</strong> {appointment.status && appointment.status.status_name}</span>
               <span><strong>Komentar:</strong> {appointment.comment && appointment.comment}</span>
            </div>
         </DialogContent>
         <DialogActions>
            {DateTime.fromRFC2822(appointment.date_from) > DateTime.local()
            && appointment.status
            && (appointment.status.status_id === 1 || appointment.status.status_id === 2)
            && (
               <Button variant="contained" color="error" onClick={cancelAppointment} disabled={disabled}>
                  Otkaži
               </Button>
            )}
            <Button onClick={handleClose} variant="contained">Izađi</Button>
         </DialogActions>
      </Dialog>
   );
}
 
export default AppointmentDialog;

AppointmentDialog.propTypes = {
   setOpen: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
   appointment: PropTypes.object.isRequired,
   setRe: PropTypes.func.isRequired,
   re: PropTypes.bool.isRequired
};