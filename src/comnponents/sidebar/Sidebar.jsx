import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse, Toolbar, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import WebIcon from '@mui/icons-material/Web';
import HomeIcon from '@mui/icons-material/Home';
import SupportIcon from '@mui/icons-material/Support';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BiotechIcon from '@mui/icons-material/Biotech';
import logo from '../../assets/logo.png'
import minilogo from '../../assets/minilogo.png'

const Sidebar = ({ openDrawer }) => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});
  // const [openDrawer,setOpenDrawer] = useState(false)

  const handleMenuChange = (menuName, pageUrl) => {
    if (pageUrl !== '') {
      navigate(pageUrl);
    } else {
      setOpenMenus((prev) => ({
        ...prev,
        [menuName]: !prev[menuName],
      }));
    }
  };

  const menuList = [
    {
      menuName: 'Customer Management',
      pageUrl: '/',
      icon: <SupportAgentIcon />,
    },
    {
      menuName: 'Product Management',
      pageUrl: '/productmanagement',
      icon: <ProductionQuantityLimitsIcon />,
    },
    {
      menuName: 'Order Management',
      pageUrl: '',
      icon: <DeliveryDiningIcon />,
      submenu: [
        {
          menuName: 'Order List',
          pageUrl: '/',
          icon: <ViewListIcon />,
        },
        {
          menuName: 'Order Tracking',
          pageUrl: '/',
          icon: <ProductionQuantityLimitsIcon />,
        },
      ],
    },
    {
      menuName: 'Blog Management',
      pageUrl: '/blog',
      icon: <WebIcon />,
    },
    {
      menuName: 'Support Management',
      pageUrl: '/',
      icon: <SupportIcon />,
    },
    {
      menuName: 'Testimonails',
      pageUrl: '',
      icon: <BiotechIcon />,
      submenu: [
        {
          menuName: 'All Testimonials',
          pageUrl: '/testimonials',
          icon: <ViewListIcon />,
        },
        
      ],
    },
  ];

  return (
    <div style={{ borderRight: 'solid 1px #36363c', height: '100%', backgroundColor: '#36363c', }}>
      <Box sx={{ margin: '0 0.7rem' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2%' }}>
          {openDrawer ? <img width={250} src={logo} alt={logo} /> :
            <img height={50} src={minilogo} alt={minilogo} />}
        </Toolbar>
        <Divider sx={{ backgroundColor: '#fff' }} />
        <List sx={{margin:'1rem 0'}}>
          <ListItemButton onClick={() => navigate('/')} sx={{
            '&:hover': {
              backgroundColor: '#1e1e1e',
              color: '#fff',
              borderRadius: '10px',

            }
          }}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <HomeIcon />
            </ListItemIcon>
            {openDrawer ?
              <>
                <ListItemText primary="Dashboards" sx={{ color: '#fff' }} />
                <KeyboardArrowRightIcon sx={{ color: '#fff' }} />
              </>
              : ""}
          </ListItemButton>
        </List>

        <Typography variant="button" gutterBottom sx={{ color: '#d50b51', fontWeight: 'bold', fontSize:'16px'}} ml={openDrawer ? 3 : 1} >
          Menu
        </Typography>

        <List sx={{margin:'1rem 0'}}>
          {menuList.map((menu, i) => (
            <div key={menu.menuName}>
              <ListItemButton onClick={() => handleMenuChange(menu.menuName, menu.pageUrl)} sx={{
                marginBottom: openDrawer ? '0.8rem' : '1.5rem',
                '&:hover': {
                  backgroundColor: '#1e1e1e',
                  color: '#fff',
                  borderRadius: '10px'
                }
              }}>
                <ListItemIcon sx={{ color: '#fff' }}>{menu.icon}</ListItemIcon>
                {openDrawer ?
                  <>
                    <ListItemText primary={menu.menuName} sx={{ color: '#fff' }} />
                    {menu.submenu ? (
                      openMenus[menu.menuName] ? (
                        <KeyboardArrowDownIcon sx={{ color: '#fff' }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ color: '#fff' }} />
                      )
                    ) : <KeyboardArrowRightIcon sx={{ color: '#fff' }} />}
                  </> : ""}
              </ListItemButton>

              {/* Submenu */}
              {openDrawer ?
                <>
                  {menu.submenu && (
                    <Collapse in={openMenus[menu.menuName]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {menu.submenu.map((subItem) => (
                          <ListItemButton
                            key={subItem.menuName}
                            sx={{
                              pl: 4, color: '#f09407',
                              '&:hover': {
                                backgroundColor: '#1e1e1e',
                                color: '#fff',
                                borderRadius: '10px'
                              }
                            }}
                            onClick={() => navigate(subItem.pageUrl)}
                          >
                            <ListItemIcon sx={{ color: '#fff' }}>{subItem.icon}</ListItemIcon>
                            <ListItemText primary={subItem.menuName} sx={{ color: '#fff' }} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </>
                : ""}

            </div>
          ))}
        </List>
      </Box>
    </div>
  );
};

export default Sidebar;
