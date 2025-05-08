import React from 'react'
import { Pagination, Paper, Stack } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'


const CommonTable = ({ rows, columns, count, page, handlePageChange }) => {
  return (
    <React.Fragment>
      <Paper elevation={5} sx={{ width: '95%', margin: '25px', height: "auto", }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination={false}
          disableSelectionOnClick
          disableColumnMenu
          hideFooter
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              fontSize: '16px', // Adjust font size
              fontWeight: 'bolder', // Adjust font weight
            },
            // '& .MuiDataGrid-cell': {
            //   fontSize: '14px', // Adjust cell font size
            //   fontWeight: '500', // Adjust cell font weight
            // },
          }}
        />
      </Paper>
      <Stack spacing={2} sx={{ alignItems: 'center', }}>
        <Pagination count={count ?? "5"} color="secondary" size='large' page={page}  onChange={handlePageChange} />
      </Stack>
    </React.Fragment>
  )
}

export default CommonTable