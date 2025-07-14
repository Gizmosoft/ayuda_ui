import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  School,
  CheckCircle,
  Warning,
  TrendingUp,
  Schedule,
  Psychology,
  ArrowBack,
} from '@mui/icons-material';
import CourseExplanation from '../../components/Analysis/CourseExplanation.jsx';
import './Recommendations.css';
import UserService from '../../api/UserService.js';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [explanationData, setExplanationData] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);

  useEffect(() => {
    const fetchPreviousRecommendations = async () => {
      try {
        console.log('Recommendations: Fetching previous recommendations...');
        
        // Check if we have recommendations from navigation state (new workflow)
        if (location.state?.recommendations) {
          console.log('Recommendations: Using recommendations from navigation state');
          setRecommendations(location.state.recommendations);
          setLoading(false);
          return;
        }
        
        // Check if we have userId from dashboard navigation (stored recommendations)
        const userId = location.state?.userId;
        if (userId) {
          console.log('Recommendations: Fetching stored recommendations for userId:', userId);
          
          const token = sessionStorage.getItem('access_token');
          const response = await fetch(`/recommendations/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Recommendations: Stored recommendations fetched:', data);
            setRecommendations(data);
            setLoading(false);
          } else {
            console.error('Recommendations: Failed to fetch stored recommendations, redirecting to dashboard');
            setLoading(false);
            navigate('/dashboard');
          }
        } else {
          console.log('Recommendations: No recommendations data or userId, redirecting to dashboard');
          setLoading(false);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Recommendations: Error fetching recommendations:', error);
        setLoading(false);
        navigate('/dashboard');
      }
    };

    fetchPreviousRecommendations();
  }, [location.state, navigate]);

  const handleExplainCourse = async (courseId) => {
    console.log('Explaining course:', courseId);
    setExplanationLoading(true);
    setExplanationError(null);
    setExplanationData(null);
    setExplanationOpen(true);

    try {
      // Get the auth token from sessionStorage (not localStorage)
      const token = sessionStorage.getItem('access_token');
      
      if (!token) {
        setExplanationError('Authentication required. Please log in again.');
        return;
      }
      
      const requestBody = {
        course_id: courseId
      };
      
      const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      
      console.log('Sending explanation request:', requestBody);
      
      const response = await fetch('/recommendations/explain', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Explanation received:', data);
        setExplanationData(data);
      } else {
        console.error('Explanation failed:', response.status);
        setExplanationError('Failed to get explanation');
      }
    } catch (error) {
      console.error('Explanation error:', error);
      setExplanationError('Error getting explanation');
    } finally {
      setExplanationLoading(false);
    }
  };

  const handleCloseExplanation = () => {
    setExplanationOpen(false);
    setExplanationData(null);
    setExplanationError(null);
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="lg">
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
            Loading Recommendations...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!recommendations) {
    return (
      <Container component="main" maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          No recommendations data found. Please try again.
        </Alert>
      </Container>
    );
  }

  const { eligible_matches, ineligible_matches, total_matches, prerequisite_analysis } = recommendations;

  const CourseCard = ({ course, isEligible }) => (
    <Card 
      className={`course-card ${isEligible ? 'eligible' : 'ineligible'}`}
      elevation={3}
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
              {course.metadata.course_name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={course.id} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                label={course.metadata.major} 
                size="small" 
                color="secondary" 
                variant="outlined"
              />
            </Box>
          </Box>
          
          {/* Status Icon and Intelligence Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Analyze recommendation">
              <IconButton
                onClick={() => handleExplainCourse(course.id)}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease',
                }}
                size="small"
              >
                <Psychology sx={{ fontSize: 24 }} />
              </IconButton>
            </Tooltip>
            {isEligible ? (
              <CheckCircle color="success" sx={{ fontSize: 28 }} />
            ) : (
              <Warning color="warning" sx={{ fontSize: 28 }} />
            )}
          </Box>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {course.metadata.description && course.metadata.description.length > 100 
            ? `${course.metadata.description.substring(0, 100)}...`
            : course.metadata.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
          }
        </Typography>

        {/* Skills */}
        {course.metadata.skills_associated && course.metadata.skills_associated.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {/* <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Skills:
            </Typography> */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {course.metadata.skills_associated[0].map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Domains */}
        {course.metadata.domains && course.metadata.domains.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'left', mb: 1 }}>
              Domains:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {course.metadata.domains[0].filter(domain => domain !== 'nan').map((domain, index) => (
                <Chip
                  key={index}
                  label={domain}
                  size="small"
                  color="info"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'left', mb: 1 }}>
              Prerequisites:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {course.prerequisites.map((prereq, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left', gap: 1 }}>
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                    {prereq.courses.map((c, courseIndex) => (
                      <Typography key={courseIndex} variant="caption" color="text.secondary">
                        {c.course_id} : {c.name}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Scores */}
        {/* <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip
            label={`Semantic: ${(course.semantic_score * 100).toFixed(1)}%`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
          <Chip
            label={`Hybrid: ${(course.hybrid_score * 100).toFixed(1)}%`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box> */}
      </CardContent>
    </Card>
  );

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 2 }}>
            Your Course Recommendations
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Based on your profile, here are personalized course recommendations
          </Typography>
          
          {/* Summary Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4 }}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                {eligible_matches.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Eligible Courses
              </Typography>
            </Paper>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
                {ineligible_matches.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Require Prerequisites
              </Typography>
            </Paper>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                {total_matches}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Courses
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Eligible Courses */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <CheckCircle color="success" sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
              Recommended Courses
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {eligible_matches.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CourseCard course={course} isEligible={true} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Ineligible Courses */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Warning color="warning" sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'warning.main' }}>
              Courses Requiring Prerequisites
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {ineligible_matches.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CourseCard course={course} isEligible={false} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Processing Info */}
        <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: '#f8f9fa' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Processing Time:</strong> {prerequisite_analysis.prerequisite_checking_time.toFixed(2)}s | 
            <strong> Total Courses Checked:</strong> {prerequisite_analysis.total_courses_checked} | 
            <strong> System Status:</strong> All systems operational
          </Typography>
        </Paper>
      </Box>

      {/* Back to Dashboard Button - Bottom Left */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 3,
            backgroundColor: '#c19bff',
            color: '#fff',
            '&:hover': {
              boxShadow: 6,
              backgroundColor: '#a47be5',
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Course Explanation Chatbot */}
      <CourseExplanation
        open={explanationOpen}
        onClose={handleCloseExplanation}
        explanation={explanationData}
        loading={explanationLoading}
        error={explanationError}
      />
    </Container>
  );
};

export default Recommendations; 