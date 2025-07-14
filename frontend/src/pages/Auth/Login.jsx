import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserToSessionStorage } from "../../utils/SessionHandler.js";
import UserService from "../../api/UserService.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { isAuthenticated } from "../../utils/SessionHandler.js";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";

export const Login = () => {
  const [formData, setFormData] = useState({
    username: "", // email as username
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({
        ...fieldErrors,
        [field]: ""
      });
    }
    
    // Clear general error
    if (error) {
      setError("");
    }
  };

  const validateLoginForm = (formData) => {
    const errors = {};
    let isValid = true;

    // Validate email/username
    if (!formData.username.trim()) {
      errors.username = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
      errors.username = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate password
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    }

    return {
      isValid,
      errors
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData);
      const response = await UserService.login(formData);
      console.log('Login response:', response);
      
      if (response.access_token) {
        sessionStorage.setItem('access_token', response.access_token);
        sessionStorage.setItem('token_type', response.token_type);
        
        // Get user data and update AuthContext
        const userData = await UserService.getCurrentUser();
        console.log('User data:', userData);
        if (userData) {
          sessionStorage.setItem('user', JSON.stringify(userData));
          setIsAuthenticated(true);
        }
        
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.username.trim() &&
      formData.password.trim()
    );
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 12,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontWeight: 600
            }}
          >
            Sign In
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              {/* Email/Username */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.username}
                  onChange={handleInputChange("username")}
                  error={!!fieldErrors.username}
                  helperText={fieldErrors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 500,
                borderRadius: 2,
                backgroundColor: "#f16d2c",
                "&:hover": {
                  backgroundColor: "#e55a1a"
                }
              }}
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/signup")}
              sx={{ 
                mt: 1,
                color: "#c19bff",
                "&:hover": {
                  backgroundColor: "rgba(193, 155, 255, 0.1)"
                }
              }}
            >
              Don't have an account? Sign up
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
