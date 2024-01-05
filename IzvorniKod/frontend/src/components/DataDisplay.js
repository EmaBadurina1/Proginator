import { React, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import "./DataDisplay.css";

const DataDisplay = ({ url, columns, options, identificator, dataName }) => {
   const [data, setData] = useState([]);
   const [page, setPage] = useState(0);
   const [rows, setRows] = useState(20);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const getData = async () => {
         try {
            const res = await axiosInstance.get(url, {
               params: {
                  page: page + 1,
                  page_size: rows
               }
            });
            setData(res.data);
            setLoading(false);
            console.log(res.data);
         }
         catch (err) {
            toast.error("Dogodila se greška!", {
               position: toast.POSITION.TOP_RIGHT,
            });
         }
      }
      getData();
   }, [page, rows, url]);

   const handleChangePage = (event, newPage) => {
      setLoading(true);
      setPage(newPage);
   }

   const handleChangeRowsPerPage = (event) => {
      setLoading(true);
      setRows(parseInt(event.target.value, 10));
      setPage(0);
   }

   const labelDisplayedRows = ({ from, to, count }) => {
      return `${from}–${to} od ${count !== -1 ? count : `više od ${to}`}`;
   }

   const getAriaLabel = (type) => {
      let signature = ""
      switch (type) {
         case "first":
            signature = "prvu";
            break;
         case "last":
            signature = "zadnju";
            break;
         case "previous":
            signature = "prošlu";
            break;
         case "next":
            signature = "sljedeću";
            break;
         default:
            break;
      }
      return `Idi na ${signature} stranicu`;
   }

   return (
      <div className="data-display">
         {loading && 
            Array.apply(null, { length: rows + 2 }).map((e, i) => (
               <Skeleton key={i}/>
            ))
         }
         {!loading &&
            <>
            <TableContainer>
               <Table aria-label="simple table">
                  <TableHead>
                     <TableRow>
                        {
                           columns.map(column => (
                              <TableCell align="center" key={column}>{column}</TableCell>
                           ))
                        }
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {
                        data.data[dataName].map(row => (
                           <TableRow key={row[identificator]}>
                              {options.map((option, index) => (
                                 <TableCell
                                    key={row[identificator].toString() + "-" + index.toString()}
                                    align="center"
                                 >
                                    {row[option]}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))
                     }
                  </TableBody>
               </Table>
               <TablePagination
                  className="paginate"
                  component="div"
                  count={data.elements}
                  page={page}
                  rowsPerPage={rows}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Redaka po stranici"
                  rowsPerPageOptions={[5, 10, 15, 20]}
                  showFirstButton={true}
                  showLastButton={true}
                  labelDisplayedRows={labelDisplayedRows}
                  getItemAriaLabel={getAriaLabel}
               />
            </TableContainer>
            </>
         }
      </div>
   );
}
 
DataDisplay.propTypes = {
   columns: PropTypes.arrayOf(PropTypes.string).isRequired,
   url: PropTypes.string.isRequired,
   dataName: PropTypes.string.isRequired,
   options: PropTypes.arrayOf(PropTypes.string).isRequired,
   identificator: PropTypes.string.isRequired
};

export default DataDisplay;