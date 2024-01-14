import { React } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import "./RoomDialog.css";
import { useNavigate } from "react-router-dom";
import RoomService from "../services/roomService";

const RoomDialog = ({ room, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm(
      "Jeste li sigurni da želite izbrisati ovu sobu?"
    );

    // If the user confirms, call the onDelete callback
    if (isConfirmed) {
      await RoomService.deleteRoom(id);
      window.location.reload();
    }
  };

  const nav = useNavigate();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Soba</DialogTitle>
      <DialogContent>
        <div className="dialog-content">
          <span>
            <strong>Broj sobe:</strong> {room.room_num}
          </span>
          <span>
            <strong>Kapacitet:</strong> {room.capacity}
          </span>
          <span>
            <strong>Dostupna:</strong> {room.in_use ? "DA" : "NE"}
          </span>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => nav(`/edit-room/${room.room_num}`)}
        >
          Uredi
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDelete(room.room_num)}
        >
          Izbriši
        </Button>
        <Button onClick={handleClose}>Izađi</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomDialog;

RoomDialog.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  room: PropTypes.object.isRequired,
};
