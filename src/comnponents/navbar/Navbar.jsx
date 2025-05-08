import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import React from 'react'


const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1,borderBottom:"solid 1px #f09407" }}>
      <AppBar position='fixed' sx={{backgroundColor: "#ffffff"}}>
        <Toolbar>
          <Typography variant="h6" color="black" component="div" sx={{ flexGrow: 1}}>
            Pharma
          </Typography>
          <Typography variant="h5" color="black" component="div" >
            Manoj
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar