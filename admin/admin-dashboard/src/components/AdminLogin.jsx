import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Paper, Typography, Alert, Snackbar } from '@mui/material';
import { EmailOutlined, LockOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://192.168.1.19:3000/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        setOpenSuccessSnackbar(true);
        setTimeout(() => {
          login(response.data.token);
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Login failed. Please check your credentials.');
        setOpenErrorSnackbar(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Wrong info. Please try again.');
      setOpenErrorSnackbar(true);
    }
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnackbar(false);
  };

  const handleCloseSuccessSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      bgcolor: '#1E90FF', 
    }}>
      <Paper elevation={6} sx={{
        p: 4,
        width: '100%',
        maxWidth: '500px',
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <Typography variant="h4" sx={{
          textAlign: 'center',
          mb: 4,
          color: '#FF4500',
          fontWeight: 'bold',
          fontSize: '2.5rem',
        }}>
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
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <EmailOutlined sx={{ color: '#1E90FF', mr: 1 }} />,
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
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: <LockOutlined sx={{ color: '#1E90FF', mr: 1 }} />,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 2,
              fontSize: '1.2rem',
              bgcolor: '#32CD32',
              '&:hover': { bgcolor: '#28A745' },
              borderRadius: '8px',
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
          Login successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin;