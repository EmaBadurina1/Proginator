import { React, Children, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableContainer, TablePagination, CircularProgress, TableRow, TableCell, TableHead, TableBody, TableSortLabel, Box, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PropTypes from 'prop-types';
import axiosInstance from "../axiosInstance";
import "./DataDisplay.css";

const DataDisplay = (props) => {
   const [page, setPage] = useState(0);
   const [rows, setRows] = useState(20);
   const [total, setTotal] = useState(0);
   const [loading, setLoading] = useState(true);
   const [orderBy, setOrderBy] = useState("");
   const [order, setOrder] = useState("asc");
   const [search, setSearch] = useState("");
   const [value, setValue] = useState("");
   
   const setData = useRef(props.setData);

   const nav = useNavigate();

   useEffect(() => {
      setLoading(true);
      const getData = async () => {
         try {
            var params = {
               page: page + 1,
               page_size: rows
            }
            if(orderBy !== "") {
               params["order_by"] = orderBy;
               params["order"] = order === "desc" ? "desc" : "asc";
            }
            if(search !== "") params["search"] = search;

            const res = await axiosInstance.get(props.url, {params: params});
            setData.current(res.data);
            setTotal(res.data.total);
            setLoading(false);
         }
         catch (err) {
            toast.error("Dogodila se greška!", {
               position: toast.POSITION.TOP_RIGHT,
            });
            setLoading(false);
         }
      }
      getData();
   }, [page, rows, orderBy, order, search, props.url]);

   const handleChangePage = (event, newPage) => {
      setLoading(true);
      setPage(newPage);
      setSearch(value);
   }

   const handleChangeRowsPerPage = (event) => {
      setLoading(true);
      setRows(parseInt(event.target.value, 10));
      setPage(0);
      setSearch("");
      setOrder("");
      setOrderBy("");
      setValue("");
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

   const handleSort = (column) => () => {
      const isAsc = orderBy === column && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(column);
      setSearch(value);
   }

   const handleMouseDown = (event) => {
      event.preventDefault();
   };

   const handleSearch = () => {
      setSearch(value);
   }

   const handleOnChangeValue = (event) => {
      setValue(event.target.value);
   }

   return (
      <div className="data-display">
         <TableContainer>
            <div className="top-conteiner">
               <Button
                  className="add-button"
                  color="success"
                  variant="contained"
                  size="medium"
                  onClick={() => nav(props.buttonUrl)}
               >
                  <span className="lg-button-label">{props.buttonLabel}</span>
                  <AddCircleIcon className="sm-button-label"/>
               </Button>
               <TextField
                  id="search-input"
                  type="text"
                  variant="standard"
                  autoComplete="false"
                  label="Traži"
                  value={value}
                  onChange={handleOnChangeValue}
                  onKeyDown={(event) => {
                     if (event.key === 'Enter') {
                        handleSearch();
                     }
                  }}
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end">
                           <IconButton
                              aria-label="search button"
                              onClick={handleSearch}
                              onMouseDown={handleMouseDown}
                              disabled={loading}
                           >
                              <SearchIcon />
                           </IconButton>
                        </InputAdornment>
                     )
                  }}
               />
            </div>
            <Table aria-label="simple table">
               <TableHead>
                  <TableRow>
                     {props.tableHead.map(column => (
                        <TableCell
                           align={column.align}
                           key={column.name}
                           sortDirection={orderBy === column.orderBy ? order : false}
                        >
                           <TableSortLabel
                              active={orderBy === column.orderBy}
                              direction={orderBy === column.orderBy ? order : 'asc'}
                              onClick={handleSort(column.orderBy)}
                              disabled={loading}
                           >
                              {column.name}
                              {orderBy === column.orderBy ? (
                                 <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                 </Box>
                              ) : null}
                           </TableSortLabel>
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {loading && 
                     <TableRow>
                        <TableCell colSpan={props.tableHead.length} align="center">
                           <CircularProgress className="loading"/>
                        </TableCell>
                     </TableRow>
                  }
                  {!loading &&
                     <>
                        {Children.count(props.children) === 0 || props.children === false
                           ? (
                              <TableRow>
                                 <TableCell colSpan={props.tableHead.length} align="center">
                                    Nema rezultata
                                 </TableCell>
                              </TableRow>
                           )
                           : <>{props.children}</>
                        }
                     </>
                  }
               </TableBody>
            </Table>
            <TablePagination
               className="paginate"
               component="div"
               count={total}
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
               disabled={loading}
            />
         </TableContainer>
      </div>
   );
}
 
DataDisplay.propTypes = {
   url: PropTypes.string.isRequired,
   children: PropTypes.node,
   setData: PropTypes.func.isRequired,
   tableHead: PropTypes.arrayOf(
      PropTypes.shape({
         name: PropTypes.string.isRequired,
         orderBy: PropTypes.string.isRequired,
         align: PropTypes.oneOf(['left', 'right', 'center']).isRequired
      })
   ).isRequired,
   buttonUrl: PropTypes.string.isRequired,
   buttonLabel: PropTypes.string.isRequired
};

export default DataDisplay;