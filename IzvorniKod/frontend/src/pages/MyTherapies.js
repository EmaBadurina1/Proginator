import { Link } from 'react-router-dom';
import React from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';



const MyTherapies = () => {
    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100,
        maxColumns: 6,
    });
    return (
        <div>
            <div className="my-therapies">
                <div className='therapy' key={''}>
                    <Link to={`/my-therapies/`}>
                        {/* <h2>moja_terapija</h2> */}
                        {/* <p>Lijecnik ili sta vec: lijecnik</p> */}
                    </Link>
                </div>
            </div>

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    columns={[
                        { field: 'date_from', headerName: 'Datum početka' },
                        { field: 'date_to', headerName: 'Datum završetka' },
                        { field: 'date_to', headerName: 'Vrsta terapije' },
                        { field: 'name', headerName: 'Liječnik koji vas je uputio' },
                        // { field: 'date_to', headerName: 'Zahtjev za postupkom liječenja' },
                        // { field: 'therapy_type_descr', headerName: 'Opis oboljenja' },
                        // { field: 'date_to', headerName: 'Akcija' }
                    ]}
                    {...data}
                    initialState={{
                        ...data.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </div>

            <div className="links" style={{ marginTop: '20px', border: '2px solid blue', display: 'inline-block', padding: '10px', borderRadius: '10px' }}>
                {/* <a href="/">Home</a> */}
                <a href="/create-therapy" style={{
                    color: "white",
                    backgroundColor: 'blue',
                    padding: '10px 25px',
                    fontSize: '20px',
                    display: 'block',
                    fontFamily: 'Arial, sans-serif',
                    textDecoration: 'none'
                }}>NOVA TERAPIJA</a>
            </div>

        </div>
    );
};


export default MyTherapies;