import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import WebIcon from "@mui/icons-material/Web";
import HomeIcon from "@mui/icons-material/Home";
import SupportIcon from "@mui/icons-material/Support";
import ViewListIcon from "@mui/icons-material/ViewList";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BiotechIcon from "@mui/icons-material/Biotech";
import ExitToApp from "@mui/icons-material/ExitToApp";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useLocation, useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useAuth } from "../../pages/routes/AuthContext";
import Modal from "../modal/Modal";

const drawerWidth = 300;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const { logout } = useAuth();

  const menuList = [
    {
      menuName: "Dashboard",
      pageUrl: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      menuName: "Customer",
      pageUrl: "/customer",
      icon: <SupportAgentIcon />,
    },
    {
      menuName: "Vendors",
      pageUrl: "/vendor",
      icon: <StorefrontIcon />,
    },
    {
      menuName: "Products",
      pageUrl: "/productmanagement",
      icon: <ProductionQuantityLimitsIcon />,
    },
    {
      menuName: "Orders",
      icon: <DeliveryDiningIcon />,
      pageUrl: "/orders",
      // submenu: [
      //   {
      //     menuName: 'Order List',
      //     pageUrl: '/orders',
      //     icon: <ViewListIcon />
      //   },
      //   {
      //     menuName: 'Order Tracking',
      //     pageUrl: '/orders/tracking',
      //     icon: <ProductionQuantityLimitsIcon />
      //   }
      // ]
    },
    {
      menuName: "Blog",
      pageUrl: "/blog",
      icon: <WebIcon />,
    },
    {
      menuName: "Support",
      pageUrl: "/support",
      icon: <SupportIcon />,
    },
    {
      menuName: "Testimonials",
      icon: <BiotechIcon />,
      pageUrl: "/testimonials",
      // submenu: [
      //   {
      //     menuName: 'All Testimonials',
      //     pageUrl: '/testimonials',
      //     icon: <ViewListIcon />
      //   }
      // ]
    },
    {
      menuName: "Admin Users",
      pageUrl: "/adminUser",
      icon: <AdminPanelSettingsIcon />,
    },
  ];

  // Determine selected menu from current URL
  useEffect(() => {
    for (const item of menuList) {
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (location.pathname.startsWith(subItem.pageUrl)) {
            setSelectedMenu(subItem.menuName);
            setOpenMenus((prev) => ({ ...prev, [item.menuName]: true }));
            return;
          }
        }
      } else if (location.pathname === item.pageUrl) {
        setSelectedMenu(item.menuName);
        return;
      }
    }
  }, [location.pathname]);

  const handleMenuChange = (item) => {
    if (item.submenu) {
      setOpenMenus({
        [item.menuName]: !openMenus[item.menuName],
      });
    } else {
      navigate(item.pageUrl);
      setSelectedMenu(item.menuName);
      setOpenMenus({});
    }
  };

  const handleSubmenuClick = (subItem, parentMenuName) => {
    navigate(subItem.pageUrl);
    setSelectedMenu(subItem.menuName);
    setOpenMenus((prev) => ({ ...prev, [parentMenuName]: true }));
  };

  return (
    <React.Fragment>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#000000",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflowY: "auto",
            p: 2,
            height: `calc(100vh - 64px)`,
            scrollbarWidth: "thin",
            scrollbarColor: "#555 #000",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#000",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#555",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#888",
            },
          }}
        >
          <List>
            {menuList.map((item, index) => {
              const isItemSelected = selectedMenu === item.menuName;
              const isMenuOpen = openMenus[item.menuName];

              return (
                <div key={index}>
                  <ListItemButton
                    onClick={() => handleMenuChange(item)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#1e1e1e",
                        color: "#fff",
                        borderRadius: "10px",
                      },
                      mb: 1,
                      backgroundColor: isItemSelected
                        ? "#1e1e1e"
                        : "transparent",
                      borderRadius: "10px",
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: isItemSelected ? "#fff" : "#bdb9b0" }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.menuName}
                      primaryTypographyProps={{
                        sx: {
                          color: isItemSelected ? "#fff" : "#bdb9b0",
                          fontSize: "1.1rem",
                          fontWeight: 500,
                        },
                      }}
                    />
                    {item.submenu &&
                      (isMenuOpen ? (
                        <KeyboardArrowDownIcon sx={{ color: "#bdb9b0" }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ color: "#bdb9b0" }} />
                      ))}
                  </ListItemButton>

                  {/* Submenu Rendering */}
                  {item.submenu && (
                    <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.submenu.map((subItem, subIndex) => {
                          const isSubItemSelected =
                            selectedMenu === subItem.menuName;
                          return (
                            <ListItemButton
                              key={subItem.menuName}
                              onClick={() =>
                                handleSubmenuClick(subItem, item.menuName)
                              }
                              sx={{
                                pl: 4,
                                mb: 1,
                                backgroundColor: isSubItemSelected
                                  ? "#1e1e1e"
                                  : "transparent",
                                borderRadius: "10px",
                                "&:hover": {
                                  backgroundColor: "#1e1e1e",
                                  color: "#fff",
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  color: isSubItemSelected ? "#fff" : "#bdb9b0",
                                }}
                              >
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={subItem.menuName}
                                primaryTypographyProps={{
                                  sx: {
                                    color: isSubItemSelected
                                      ? "#fff"
                                      : "#bdb9b0",
                                    fontSize: "1.1rem",
                                    fontWeight: 500,
                                  },
                                }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </div>
              );
            })}
          </List>
          <List
            sx={{ marginTop: "15%" }}
            onClick={() => setDialogOpen(!dialogOpen)}
          >
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: "#1e1e1e",
                  color: "#fff",
                  borderRadius: "10px",
                },
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#bdb9b0" }}>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: {
                    color: "#bdb9b0",
                    fontSize: "1.1rem",
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </List>
        </Box>
        {/* <Box sx={{ overflow: 'auto', py: 1, px: 2, width: '100%', }} onClick={logout}>
          <List>
            <ListItemButton
              sx={{
                '&:hover': {
                  backgroundColor: '#1e1e1e',
                  color: '#fff',
                  borderRadius: '10px'
                },
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: '#bdb9b0' }}><ExitToApp /></ListItemIcon>
              <ListItemText
                primary='Logout'
                primaryTypographyProps={{
                  sx: {
                    color: '#bdb9b0',
                    fontSize: '1.1rem',
                    fontWeight: 500
                  }
                }}
              />
            </ListItemButton>
          </List>
        </Box> */}
      </Drawer>
      <Modal
        open={dialogOpen}
        close={() => setDialogOpen(!dialogOpen)}
        content={"Are you sure you want to logout this application."}
        success={logout}
      />
    </React.Fragment>
  );
};

export default Sidebar;
