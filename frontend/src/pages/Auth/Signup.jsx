import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserToSessionStorage } from "../../utils/SessionHandler.js";
import UserService from "../../api/UserService.js";
import { validateSignupForm } from "../../utils/validation.js";
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
  Person,
  Email,
  School,
  CalendarToday,
  VpnKey,
  Lock,
} from "@mui/icons-material";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    university: "",
    email: "",
    major: "",
    dob: "",
    password: "",
    access_code: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const response = await UserService.signup(formData);
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.first_name.trim() &&
      formData.last_name.trim() &&
      formData.university.trim() &&
      formData.email.trim() &&
      formData.major.trim() &&
      formData.dob &&
      formData.password.trim() &&
      formData.access_code.trim()
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
            Create Account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={handleInputChange("first_name")}
                  error={!!fieldErrors.first_name}
                  helperText={fieldErrors.first_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={handleInputChange("last_name")}
                  error={!!fieldErrors.last_name}
                  helperText={fieldErrors.last_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* University */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="University"
                  value={formData.university}
                  onChange={handleInputChange("university")}
                  error={!!fieldErrors.university}
                  helperText={fieldErrors.university}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Major */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Major"
                  value={formData.major}
                  onChange={handleInputChange("major")}
                  error={!!fieldErrors.major}
                  helperText={fieldErrors.major}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange("dob")}
                  error={!!fieldErrors.dob}
                  helperText={fieldErrors.dob}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
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

              {/* Access Code */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Access Code"
                  type="text"
                  value={formData.access_code}
                  onChange={handleInputChange("access_code")}
                  error={!!fieldErrors.access_code}
                  helperText={fieldErrors.access_code}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey color="action" />
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
                "Create Account"
              )}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ 
                mt: 1,
                color: "#c19bff",
                "&:hover": {
                  backgroundColor: "rgba(193, 155, 255, 0.1)"
                }
              }}
            >
              Already have an account? Sign in
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
