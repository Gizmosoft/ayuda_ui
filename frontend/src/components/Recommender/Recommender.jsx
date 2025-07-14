import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import UserService from '../../api/UserService.js';
import './Recommender.css';

const Recommender = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRecommendations = async () => {
    console.log('Getting recommendations...');
    setLoading(true);
    setError('');

    try {
      const response = await UserService.getRecommendations();
      console.log('Recommendations response:', response);
      
      // Check if response is HTML (error page)
      if (typeof response === 'string' && response.includes('<html>')) {
        setError('Server returned HTML instead of JSON. Please check the API endpoint.');
        setLoading(false);
        return;
      }
      
      // Check if response is an object with expected structure
      if (response && typeof response === 'object') {
        console.log('✅ Valid JSON response received');
        console.log('Response structure:', {
          hasEligibleMatches: !!response.eligible_matches,
          hasIneligibleMatches: !!response.ineligible_matches,
          totalMatches: response.total_matches,
          hasPrerequisiteAnalysis: !!response.prerequisite_analysis
        });
      }
      
      // Redirect to recommendations page with data
      navigate('/recommendations', { state: { recommendations: response } });
      
    } catch (error) {
      console.error('Recommendations Error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error headers:', error.response?.headers);
      
      // Check if the error response is HTML
      if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<html>')) {
        console.error('Received HTML error page:', error.response.data.substring(0, 500));
        setError('Server returned HTML error page. The API endpoint may be incorrect or the server may be down.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 404) {
        setError('API endpoint not found. Please check the server configuration.');
      } else if (error.response?.status === 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(error.message || 'Failed to get recommendations.');
      }
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} className="recommender-section">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Get Your Recommendations
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Based on your resume and profile, we'll provide personalized course recommendations.
      </Typography>
      
      <Button
        variant="contained"
        onClick={handleGetRecommendations}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TrendingUp />}
        sx={{
          backgroundColor: '#f16d2c',
          '&:hover': {
            backgroundColor: '#e55a1a',
          },
        }}
      >
        {loading ? 'Getting Recommendations...' : 'See Your Recommendations'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default Recommender; 