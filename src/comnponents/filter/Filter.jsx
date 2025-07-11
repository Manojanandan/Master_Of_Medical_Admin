import React from 'react'
import { Box, Paper } from '@mui/material'

const Filter = ({ children }) => {

  return (
    <React.Fragment>
      <Paper elevation={4} sx={{ width: '95%', margin: '25px 25px 0' }}>
        <Box sx={{ padding: '20px' }}>
          {children}
          {/* <Button variant="contained" sx={{ margin: '2.5rem 1.5rem 1rem', height: '33px', backgroundColor: "#009e92", fontWeight: 'bold', padding: '20px 25px' }} onClick={onClick}>SEARCH</Button> */}
        </Box>
      </Paper>
    </React.Fragment>
  )
}

export default React.memo(Filter)
