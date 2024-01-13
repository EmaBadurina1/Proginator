import { React } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { parseDateTimeInterval } from "../services/utils";
import PropTypes from 'prop-types';
import "./AppointmentDialog.css"

const AppointmentDialog = ({ appointment, open, setOpen }) => {

   const handleClose = () => {
      setOpen(false);
   };

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
            <Button onClick={handleClose}>Izađi</Button>
         </DialogActions>
      </Dialog>
   );
}
 
export default AppointmentDialog;

AppointmentDialog.propTypes = {
   setOpen: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
   appointment: PropTypes.object.isRequired
};