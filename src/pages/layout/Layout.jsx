import React, { useState } from 'react'
import { Box, IconButton, Toolbar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from "../../comnponents/sidebar/Sidebar"
import Navbar from '../../comnponents/navbar/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const [openDrawer, setOpenDrawer] = useState(true)
  return (
    <React.Fragment>
      <Box sx={{ display: "flex",height: '100vh'}}>
        <Box sx={{ height: '100vh', width: openDrawer ? '22%' : '6%', border: 'solid 2px black', transition: 'width 0.3s ease', position: 'fixed', }}>
          <Sidebar openDrawer={openDrawer} />
        </Box>
        <Box sx={{ height: '100vh', width: '100%',marginLeft: openDrawer ? '22%' : '6%',transition: 'margin-left 0.3s ease',}}>
          <Toolbar elevation={3} sx={{ height: '50px', width: '100%', display: 'flex', alignItems: 'center',position:'fixed',top:0,borderBottom:'solid 1.5px #2424',backgroundColor:'#fff',zIndex:'2'}}>
            <IconButton
              onClick={() => setOpenDrawer(!openDrawer)}
              edge="start"
              sx={{margin:'0 1%'}}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
          <Box sx={{backgroundColor:'#f4f7fb',marginTop:'50px',}}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default Layout