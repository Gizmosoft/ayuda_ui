import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import UserService from "../../api/UserService.js";
import { isAuthenticated, removeUserFromSession, getAuthToken } from "../../utils/SessionHandler.js";
import ResumeUpload from "../../components/ResumeUpload/ResumeUpload.jsx";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

export const Dashboard = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('Dashboard: Checking authentication...');
    const token = sessionStorage.getItem('access_token');
    const isAuth = isAuthenticated();

    if (!token || !isAuth) {
      console.log('Dashboard: Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    const validateToken = async () => {
      try {
        console.log('Dashboard: Validating token...');
        const userData = await UserService.getCurrentUser();
        console.log('Dashboard: User data received:', userData);
        
        if (userData) {
          setUser(userData);
          setLoading(false);
        } else {
          console.log('Dashboard: No user data, clearing session');
          sessionStorage.clear();
          navigate('/login');
        }
      } catch (error) {
        console.error('Dashboard: Token validation error:', error);
        sessionStorage.clear();
        navigate('/login');
      }
    };

    validateToken();
  }, [navigate]);

  if (loading) {
    return (
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  // Check if user profile is enhanced
  const isProfileEnhanced = user?.profile_enhanced === true;

  // Render new user flow if profile is not enhanced
  if (!isProfileEnhanced) {
    return (
      <Container component="main" maxWidth="lg">
        <ResumeUpload />
      </Container>
    );
  }

  // Render regular dashboard for enhanced users
  if (isProfileEnhanced) {
    return (
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 10, // Increased from 4 to 10 for more space below navbar
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          {/* Go to Recommendations Section */}
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              width: "100%",
              borderRadius: 2,
              mb: 3,
              textAlign: "center",
              backgroundColor: '#f5f5f5',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              Want to see your previous recommendations?
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                
                // Use user ID if available, otherwise use email
                const userId = user?.id || user?.email;
                
                if (!userId) {
                  console.error("No user ID or email available");
                  return;
                }
                
                navigate("/recommendations", { 
                  state: { 
                    fromGoTo: true, 
                    userId: userId
                  } 
                });
              }}
              sx={{ fontWeight: 600, backgroundColor: '#c19bff', color: '#fff', '&:hover': { backgroundColor: '#a47be5' } }}
            >
              Go to your recommendations
            </Button>
          </Paper>

          {/* Usual Dashboard Workflow */}
          <Box sx={{ width: '100%' }}>
            <ResumeUpload />
          </Box>
        </Box>
      </Container>
    );
  }

  // Render regular dashboard for enhanced users
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            width: "100%",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>
        </Box>

        {/* Welcome message */}
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
            Welcome back, {user?.first_name || "User"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You are successfully authenticated with a valid JWT token.
          </Typography>
        </Paper>

        {/* Placeholder content */}
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#666" }}>
            🚧 Dashboard Content Coming Soon 🚧
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is a placeholder for the dashboard content. 
            The actual dashboard features will be implemented based on your requirements.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
