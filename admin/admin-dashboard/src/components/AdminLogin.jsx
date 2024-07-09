import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { EmailOutlined, LockOutlined } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../AuthContext";
import backgroundImage from '../assets/sidibou.jpg';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://192.168.100.4:3000/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        setOpenSuccessSnackbar(true);
        setTimeout(() => {
          login(response.data.token);
          navigate("/dashboard");
        }, 1500);
      } else {
        setError("Login failed. Please check your credentials.");
        setOpenErrorSnackbar(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Wrong info. Please try again.");
      setOpenErrorSnackbar(true);
    }
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorSnackbar(false);
  };

  const handleCloseSuccessSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  return (
    <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundImage: `url(${backgroundImage})`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '600px',
          m: 2,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 4,
            color: "#000000",
            fontWeight: "bold",
            fontSize: "2.5rem",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#000000",
                },
                "&:hover fieldset": {
                  borderColor: "#00aacc",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#000000",
              },
            }}
            InputProps={{
              startAdornment: (
                <EmailOutlined sx={{ color: "#000000", mr: 1 }} />
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#000000",
                },
                "&:hover fieldset": {
                  borderColor: "#00aacc",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#000000",
              },
            }}
            InputProps={{
              startAdornment: <LockOutlined sx={{ color: "#000000", mr: 1 }} />,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 2,
              fontSize: "1.2rem",
              bgcolor: "#00aacc",
              "&:hover": { bgcolor: "#008ca8" },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Login successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin;