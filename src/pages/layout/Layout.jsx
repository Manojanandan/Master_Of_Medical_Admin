import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Toolbar,
  Typography
} from '@mui/material';

import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Sidebar from '../../comnponents/sidebar/Sidebar';
import { jwtDecode } from "jwt-decode";


const Layout = () => {
  const tokenDecode = jwtDecode(sessionStorage.getItem("jwt"))
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#ffffff',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <img height={50} src={logo} alt="logo" />
          </Box>
          <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',gap:'12px'}}>
            <Avatar sx={{textTransform:'uppercase'}} src={tokenDecode?.profile} alt={tokenDecode?.name.charAt(0)} />
            <Box sx={{height:'auto',width:'auto',lineHeight:'20px',textTransform:'capitalize'}}>
              <Typography variant='p' component='div' sx={{color:'black',fontSize:'19px'}}>{tokenDecode?.name} |<span style={{color:'gray',fontSize:'16px'}}> {tokenDecode?.role}</span></Typography>
              <Typography variant='p' component='div' sx={{color:'gray',fontSize:'15px'}}>{tokenDecode?.phone}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Sidebar role={tokenDecode?.role} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#fafafa',
          overflowY: 'auto',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
