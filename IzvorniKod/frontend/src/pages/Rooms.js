import React from "react";
import DataDisplay from "../components/DataDisplay";
import Container from "@mui/material/Container";
import { Box, Grid, Typography } from "@mui/material";
import { TableRow, TableCell } from "@mui/material";
import RoomDialog from "../components/RoomDialog";
import { useEffect, useState } from "react";


const Rooms = () => {
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
              align="start"
              className="mb-4"
              gutterBottom
            >
              Popis soba
            </Typography>
          </Grid>
        </Grid>
        <DataDisplay
          url="/rooms" // url from where to fetch data
          setData={setData} // function for setting data declared with useState() hook
          tableHead={tableHead} // array of objects representing table header
          buttonLabel="Nova soba" // text on button/link
          buttonUrl="/new-room" // link to adding new element page
        >
          {/* adding table rows as children to DataDisplay component */}
          {data !== null &&
            data.data.rooms.map((room) => (
              <TableRow
                key={room.room_num}
                onClick={() => openDialog(room)}
              >
                <TableCell>{room.room_num}</TableCell>
                <TableCell>{room.in_use}</TableCell>
                <TableCell>{room.capacity}</TableCell>
              </TableRow>
            ))}
        </DataDisplay>
      </Box>
      {open && <RoomDialog open={open} setOpen={setOpen} room={content} />}
    </Container>
  );
};

export default Rooms;

const tableHead = [
  {
    name: "Broj sobe",
    orderBy: "room_num",
    align: "left",
    classes: "show-sm" 
  },
  {
    name: "Soba Zauzeta",
    orderBy: "in_use",
    align: "left",
    classes: "show-sm" 
  },
  {
    name: "Kapacitet sobe",
    orderBy: "capacity",
    align: "left",
    classes: "show-sm" 
  },
];
