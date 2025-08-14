import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

const menuItems = isLoggedIn
  ? [
      { text: "Home", path: "/" },
      { text: "Appointments", path: "/appointments" },
      { text: "Profile", path: "/profile" },
      { text: "Logout", action: handleLogout },
    ]
  : [
      { text: "Home", path: "/" },
      { text: "Login", path: "/login" },
      { text: "Signup", path: "/signup" },
    ];

  return (
    <AppBar
      position="sticky"
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        background: "linear-gradient(135deg, #4A90E2, #145DA0)",
        boxShadow: "none",
        paddingY: 1,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer", color: "white" }}
          onClick={() => navigate("/")}
        >
          Telemedicine
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              onClick={() => (item.action ? item.action() : navigate(item.path))}
              component={motion.button}
              whileHover={{ scale: 1.1, color: "#ffeb3b" }}
              whileTap={{ scale: 0.9 }}
              sx={{
                color: "white",
                fontWeight: "bold",
                marginX: 1,
                transition: "0.3s",
                borderRadius: 2,
                paddingX: 2,
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </Toolbar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        component={motion.div}
        initial={{ x: -200 }}
        animate={{ x: mobileOpen ? 0 : -200 }}
        transition={{ duration: 0.5 }}
        sx={{
          "& .MuiDrawer-paper": {
            background: "linear-gradient(135deg, #4A90E2, #145DA0)",
            color: "white",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
                handleDrawerToggle();
              }}
              component={motion.div}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <ListItemText primary={item.text} sx={{ fontWeight: "bold", color: "white" }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;