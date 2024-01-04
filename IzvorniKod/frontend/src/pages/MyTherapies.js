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
                        <h2>moja_terapija</h2>
                        <p>Lijecnik ili sta vec: lijecnik</p>
                    </Link>
                </div>
            </div>

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    {...data}
                    initialState={{
                        ...data.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </div>

            <div className="links">
                {/* <a href="/">Home</a> */}
                <a href="/create" style={{
                    color: "white",
                    backgroundColor: '#f1356d',
                    borderRadius: '8px'
                }}>Nova terapija</a>
            </div>
        </div>
    );
};


export default MyTherapies;