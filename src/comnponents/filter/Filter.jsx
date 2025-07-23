import React from 'react'
import { Box, Paper } from '@mui/material'

const Filter = ({ children }) => {

  return (
    <React.Fragment>
      <Box sx={{ width: '98%', }}>
        <Box sx={{ padding: '20px 0 20px 20px' }}>
          {children}
          {/* <Button variant="contained" sx={{ margin: '2.5rem 1.5rem 1rem', height: '33px', backgroundColor: "#009e92", fontWeight: 'bold', padding: '20px 25px' }} onClick={onClick}>SEARCH</Button> */}
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default React.memo(Filter)
