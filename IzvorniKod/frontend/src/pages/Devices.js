import React from "react";
import "./UserAccounts.css";
import DataDisplay from "../components/DataDisplay";
import Container from "@mui/material/Container";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TableRow, TableCell } from "@mui/material";
import DeviceDialog from "../components/DeviceDialog"

const Devices = () => {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {}, [data]);

  const openDialog = (content) => {
    setContent(content);
    setOpen(true);
  };

  return (
    <Container maxWidth="xl">
    <Box
      sx={{
        boxShadow: 2,
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h4"
            align="left"
            className="mb-2"
            gutterBottom
          >
            Popis opreme
          </Typography>
        </Grid>
      </Grid>
      <DataDisplay
        url="/devices" // url from where to fetch data
        setData={setData} // function for setting data declared with useState() hook
        tableHead={tableHead} // array of objects representing table header
        buttonLabel="Novi uređaj" // text on button/link
        buttonUrl="/new-device" // link to adding new element page
      >
        {/* adding table rows as children to DataDisplay component */}
        {data !== null &&
          data.data.devices.map((device) => (
            <TableRow
              key={device.device_id}
              onClick={() => openDialog(device)}
            >
              <TableCell>{device.device_id}</TableCell>
              <TableCell className="hide-sm">{device.room.room_num}</TableCell>
              <TableCell>{device.device_type.device_type_name}</TableCell>
              <TableCell className="hide-sm">{device.device_type.device_type_descr}</TableCell>
            </TableRow>
          ))}
      </DataDisplay>
    </Box>
    {open && <DeviceDialog open={open} setOpen={setOpen} device={content} />}
  </Container>
  );
};

export default Devices;

const tableHead = [
  {
    name: "ID",
    orderBy: "device.device_id",
    align: "left",
    classes: "show-sm" 
  },
  {
    name: "Soba",
    orderBy: "room.room_num",
    align: "left",
    classes: "hide-sm" 
  },
  {
    name: "Tip uređaja",
    orderBy: "device_type.device_type_name",
    align: "left",
    classes: "show-sm" 
  },
  {
    name: "Opis uređaja",
    orderBy: "device_type.device_type_descr",
    align: "left",
    classes: "hide-sm" 
  },
];
