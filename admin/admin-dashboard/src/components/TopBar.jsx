import React from "react";
import { AppBar, Toolbar, IconButton, Box, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "../AuthContext";
const API_URL = import.meta.env.VITE_API_URL;
function TopBar() {
  const { username, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      position="static"
      sx={{ width: "100%", bgcolor: "#0a1929", boxShadow: "none" }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
        <Typography variant="body1" sx={{ ml: 2 }}>
          {username}
        </Typography>
        <IconButton color="inherit" onClick={handleLogout}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
