import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Toolbar
} from '@mui/material';

import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Sidebar from '../../comnponents/sidebar/Sidebar';


const Layout = () => {
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
          <Box>
            <Avatar src="/broken-image.jpg" />
          </Box>
        </Toolbar>
      </AppBar>

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
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
