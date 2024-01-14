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
import DeviceService from "../services/deviceService";

const DeviceDialog = ({ device, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm(
      "Jeste li sigurni da želite izbrisati ovaj uređaj?"
    );

    // If the user confirms, call the onDelete callback
    if (isConfirmed) {
      await DeviceService.deleteDevice(id);
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
      <DialogTitle id="scroll-dialog-title">Uređaj</DialogTitle>
      <DialogContent>
        <div className="dialog-content">
          <span>
            <strong>ID:</strong> {device.device_id}
          </span>
          <span>
            <strong>Soba u kojoj se uređaj nalazi:</strong> {device.room.room_num}
          </span>
          <span>
            <strong>Dostupnost sobe:</strong> {device.room.in_use ? "Dostupna" : "Nedostupna"}
          </span>
          <span>
            <strong>Kapacitet sobe:</strong> {device.room.capacity}
          </span>
            <span>
               <strong>Tip uređaja:</strong> {device.device_type.device_type_name}
            </span>
            <span>
               <strong>Opis uređaja:</strong> {device.device_type.device_type_descr}
            </span>
          
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => nav(`/edit-device/${device.device_id}`)}
        >
          Uredi
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDelete(device.device_id)}
        >
          Izbriši
        </Button>
        <Button onClick={handleClose}>Izađi</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceDialog;

DeviceDialog.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  device: PropTypes.object.isRequired,
};
