import { React } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import "./UserDialog.css";
import { useNavigate } from "react-router-dom";
import UserAccountService from "../services/userAccountService";

// samo za employee za sad
const UserDialog = ({ employee, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm(
      "Jeste li sigurni da želite izbrisati ovaj korisnički račun?"
    );

    // If the user confirms, call the onDelete callback
    if (isConfirmed) {
      await UserAccountService.deleteEmployee(id);
      handleClose();
      window.location.reload();
    }
  };

  const nav = useNavigate();

  const formatDate = (inputString) => {
    const inputDate = new Date(inputString);
    const options = { day: "numeric", month: "numeric", year: "numeric" };

    return inputDate.toLocaleDateString("hr-HR", options);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Korisnički račun</DialogTitle>
      <DialogContent>
        <div className="dialog-content">
          <span>
            <strong>Ime:</strong> {employee.name}
          </span>
          <span>
            <strong>Prezime:</strong> {employee.surname}
          </span>
          <span>
            <strong>OIB:</strong> {employee.OIB}
          </span>
          <span>
            <strong>Datum rođenja:</strong> {formatDate(employee.date_of_birth)}
          </span>
          <span>
            <strong>E-mail:</strong> {employee.email}
          </span>
          <span>
            <strong>Broj telefona:</strong> {employee.phone_number}
          </span>
          <span>
            <strong>Administrator?</strong> {employee.is_admin ? "DA" : "NE"}
          </span>
          <span>
            <strong>Aktivan?</strong> {employee.is_active ? "DA" : "NE"}
          </span>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => nav(`/edit-user/${employee.user_id}`)}
        >
          Uredi
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDelete(employee.user_id)}
        >
          Izbriši
        </Button>
        <Button onClick={handleClose}>Izađi</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;

UserDialog.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  employee: PropTypes.object.isRequired,
};
