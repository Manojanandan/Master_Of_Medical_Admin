import React, { useEffect, useMemo, useState } from "react";
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
import {
  SupportAgent as SupportAgentIcon,
  DeliveryDining as DeliveryDiningIcon,
  ProductionQuantityLimits as ProductionQuantityLimitsIcon,
  Web as WebIcon,
  Home as HomeIcon,
  Support as SupportIcon,
  ViewList as ViewListIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Biotech as BiotechIcon,
  ExitToApp as ExitToAppIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Storefront as StorefrontIcon,
  Business as BusinessIcon,
  LocalOffer as LocalOfferIcon,
  BrandingWatermark as BrandingWatermarkIcon
} from "@mui/icons-material";
// import BusinessIcon from '@mui/icons-material/Business';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/routes/AuthContext";
import Modal from "../modal/Modal";

const drawerWidth = 300;

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const { logout } = useAuth();

  // ✅ Menu List based on role
  const menuList = useMemo(() => {
    if (role === "admin") {
      return [
        { menuName: "Dashboard", pageUrl: "/dashboard", icon: <HomeIcon /> },
        { menuName: "Customer", pageUrl: "/customer", icon: <SupportAgentIcon /> },
        { menuName: "Vendors", pageUrl: "/vendor", icon: <StorefrontIcon /> },
        { menuName: "Products", pageUrl: "/productmanagement", icon: <ProductionQuantityLimitsIcon /> },
        { menuName: "Orders", pageUrl: "/orders", icon: <DeliveryDiningIcon /> },
        { menuName: "Blog", pageUrl: "/blog", icon: <WebIcon /> },
        { menuName: "Support", pageUrl: "/support", icon: <SupportIcon /> },
        { menuName: "Testimonials", pageUrl: "/testimonials", icon: <BiotechIcon /> },
        { menuName: "Admin Users", pageUrl: "/adminUser", icon: <AdminPanelSettingsIcon /> },
        {
          menuName: 'Banners',
          pageUrl: '/banners',
          icon: <BusinessIcon />
        },
        {
          menuName: 'Offers',
          pageUrl: '/offerBanners',
          icon: <LocalOfferIcon />
        },
        {
          menuName: 'Brands',
          pageUrl: '/brand',
          icon: <BrandingWatermarkIcon />
        },

      ];
    } else if (role === "support") {
      return [
        { menuName: "Orders", pageUrl: "/orders", icon: <DeliveryDiningIcon /> },
        { menuName: "Blog", pageUrl: "/blog", icon: <WebIcon /> },
        { menuName: "Support", pageUrl: "/support", icon: <SupportIcon /> },
        { menuName: "Testimonials", pageUrl: "/testimonials", icon: <BiotechIcon /> },
      ];
    } else {
      return [];
    }
  }, [role]);

  // ✅ Set selected menu on URL change
  useEffect(() => {
    for (const item of menuList) {
      if (item.submenu) {
        for (const sub of item.submenu) {
          if (location.pathname.startsWith(sub.pageUrl)) {
            setSelectedMenu(sub.menuName);
            setOpenMenus((prev) => ({ ...prev, [item.menuName]: true }));
            return;
          }
        }
      } else if (location.pathname === item.pageUrl) {
        setSelectedMenu(item.menuName);
        return;
      }
    }
  }, [location.pathname, menuList]);

  const handleMenuChange = (item) => {
    if (item.submenu) {
      setOpenMenus((prev) => ({
        ...prev,
        [item.menuName]: !prev[item.menuName],
      }));
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
          <List sx={{ minHeight: '82%' }}>
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
                      backgroundColor: isItemSelected ? "#1e1e1e" : "transparent",
                      borderRadius: "10px",
                    }}
                  >
                    <ListItemIcon sx={{ color: isItemSelected ? "#fff" : "#bdb9b0" }}>
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
                          const isSubItemSelected = selectedMenu === subItem.menuName;
                          return (
                            <ListItemButton
                              key={subItem.menuName}
                              onClick={() =>
                                handleSubmenuClick(subItem, item.menuName)
                              }
                              sx={{
                                pl: 4,
                                mb: 1,
                                backgroundColor: isSubItemSelected ? "#1e1e1e" : "transparent",
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
                                    color: isSubItemSelected ? "#fff" : "#bdb9b0",
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

          {/* Logout */}
          <List sx={{ marginTop: "15%" }} onClick={() => setDialogOpen(true)}>
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
                <ExitToAppIcon />
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
      </Drawer>

      {/* Logout Confirmation Modal */}
      <Modal
        open={dialogOpen}
        close={() => setDialogOpen(false)}
        content={"Are you sure you want to logout this application?"}
        success={logout}
      />
    </React.Fragment>
  );
};

export default Sidebar;
