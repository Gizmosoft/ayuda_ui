import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Popper,
  ClickAwayListener,
  Fade,
} from '@mui/material';
import { 
  Upload, 
  Description, 
  CheckCircle, 
  Search, 
  Close,
  Add 
} from '@mui/icons-material';
import UserService from '../../api/UserService.js';
import Recommender from '../Recommender/Recommender.jsx';
import './ResumeUpload.css';

const ResumeUpload = ({ onComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [error, setError] = useState('');
  const [additionalSkills, setAdditionalSkills] = useState('');
  
  // Course search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseSearchOpen, setCourseSearchOpen] = useState(false);

  // Course search API call
  const performCourseSearch = useCallback(async (query) => {
    setSearchLoading(true);
    try {
      const token = sessionStorage.getItem('access_token');
      
      const url = `/courses/search?q=${encodeURIComponent(query)}&limit=5&check_prerequisites=true`;
      console.log('Searching courses with URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Course search error response:', errorText);
        
        // Check if it's an HTML error page (likely backend not running or wrong endpoint)
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html>')) {
          setError('Course search service is currently unavailable. Please try again later.');
          return;
        }
        
        throw new Error(`Failed to search courses: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Course search results:', data);
      
      const allCourses = [
        ...(data.eligible_courses || []),
        ...(data.ineligible_courses || [])
      ];
      
      setSearchResults(allCourses);
      setCourseSearchOpen(allCourses.length > 0);
      
      // Clear any previous errors
      if (error) {
        setError('');
      }
    } catch (error) {
      console.error('Error in performCourseSearch:', error);
      setSearchResults([]);
      setCourseSearchOpen(false);
      
      // Set a user-friendly error message
      if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to course search service. Please check your internet connection.');
      } else {
        setError('Course search is temporarily unavailable. Please try again later.');
      }
    } finally {
      setSearchLoading(false);
    }
  }, [error]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim().length >= 2) {
            performCourseSearch(query);
          } else {
            setSearchResults([]);
            setCourseSearchOpen(false);
          }
        }, 800); // 800ms delay
      };
    })(),
    [performCourseSearch]
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setSearchAnchorEl(event.currentTarget);
    debouncedSearch(query);
  };

  // Handle course selection
  const handleCourseSelect = async (course) => {
    try {
      console.log('Adding course:', course);
      // Add course to backend
      const token = sessionStorage.getItem('access_token');
      const response = await fetch('/users/profile/completed-courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([course.course_id]), // Send as array directly
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add course: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Course added successfully:', responseData);

      // Refresh completed courses from backend instead of just updating local state
      await refreshCompletedCourses();
      
      setSearchQuery('');
      setSearchResults([]);
      setCourseSearchOpen(false);
      
      // Clear any previous errors
      if (error) {
        setError('');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setError(`Failed to add course: ${error.message}`);
    }
  };

  // Handle course removal
  const handleCourseRemove = async (courseId) => {
    try {
      console.log('Removing course with ID:', courseId);
      // Find the course to get its course_id
      const course = selectedCourses.find(c => c.id === courseId);
      if (!course) {
        console.error('Course not found for removal:', courseId);
        return;
      }

      // Remove course from backend
      const token = sessionStorage.getItem('access_token');
      const response = await fetch(`/users/profile/completed-courses/${course.course_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove course: ${response.status} ${errorText}`);
      }

      const responseData = await response.text();
      console.log('Course removed successfully:', responseData);

      // Refresh completed courses from backend instead of just updating local state
      await refreshCompletedCourses();
      
      // Clear any previous errors
      if (error) {
        setError('');
      }
    } catch (error) {
      console.error('Error removing course:', error);
      setError(`Failed to remove course: ${error.message}`);
    }
  };

  // Load existing completed courses on component mount - REMOVED to prevent automatic API calls
  // useEffect(() => {
  //   const loadCompletedCourses = async () => {
  //     try {
  //       const token = sessionStorage.getItem('access_token');
  //       const response = await fetch('/users/profile/completed-courses', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
          
  //         // Get the course IDs from the response
  //         const courseIds = data.completed_courses || [];
          
  //         // Fetch full course details for each completed course ID
  //         const fullCourseDetails = [];
  //         for (const courseId of courseIds) {
  //           try {
  //             const courseResponse = await fetch(`/courses/search/${courseId}`, {
  //               headers: {
  //                 'Authorization': `Bearer ${token}`,
  //                 'Content-Type': 'application/json',
  //               },
  //             });
            
  //             if (courseResponse.ok) {
  //               const courseData = await courseResponse.json();
  //               fullCourseDetails.push(courseData);
  //             } else {
  //               console.warn(`Failed to fetch details for course ${courseId}`);
  //               // Add a placeholder object with the course ID
  //               fullCourseDetails.push({
  //                 id: courseId,
  //                 course_id: courseId,
  //                 course_name: courseId,
  //                 course_description: 'Course details not available'
  //               });
  //             }
  //           } catch (error) {
  //             console.error(`Error fetching course details for ${courseId}:`, error);
  //             // Add a placeholder object with the course ID
  //             fullCourseDetails.push({
  //               id: courseId,
  //               course_id: courseId,
  //               course_name: courseId,
  //               course_description: 'Course details not available'
  //             });
  //           }
  //         }
          
  //         setSelectedCourses(fullCourseDetails);
  //       } else {
  //         const errorText = await response.text();
  //         console.error('Load completed courses error response:', errorText);
  //       }
  //     } catch (error) {
  //       console.error('Error loading completed courses:', error);
  //     }
  //   };
  //   if (parsed) {
  //     loadCompletedCourses();
  //   }
  // }, [parsed]);

  // Load additional skills on component mount - REMOVED to prevent automatic API calls
  // useEffect(() => {
  //   if (parsed) {
  //     refreshAdditionalSkills();
  //   }
  // }, [parsed]);

  // Function to refresh completed courses
  const refreshCompletedCourses = async () => {
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch('/users/profile/completed-courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Get the course IDs from the response
        const courseIds = data.completed_courses || [];
        
        // Fetch full course details for each completed course ID
        const fullCourseDetails = [];
        for (const courseId of courseIds) {
          try {
            const courseResponse = await fetch(`/courses/search/${courseId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (courseResponse.ok) {
              const courseData = await courseResponse.json();
              fullCourseDetails.push(courseData);
            } else {
              console.warn(`Failed to fetch details for course ${courseId}`);
              // Add a placeholder object with the course ID
              fullCourseDetails.push({
                id: courseId,
                course_id: courseId,
                course_name: courseId,
                course_description: 'Course details not available'
              });
            }
          } catch (error) {
            console.error(`Error fetching course details for ${courseId}:`, error);
            // Add a placeholder object with the course ID
            fullCourseDetails.push({
              id: courseId,
              course_id: courseId,
              course_name: courseId,
              course_description: 'Course details not available'
            });
          }
        }
        
        setSelectedCourses(fullCourseDetails);
      } else {
        const errorText = await response.text();
        console.error('Refresh completed courses error response:', errorText);
      }
    } catch (error) {
      console.error('Error refreshing completed courses:', error);
    }
  };

  // Handle submitting additional skills
  const handleSubmitSkills = async () => {
    if (!additionalSkills.trim()) {
      setError('Additional skills cannot be empty.');
      return;
    }

    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch('/users/profile/additional-skills', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ additional_skills: additionalSkills.trim() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit additional skills: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();

      // Clear the input field after successful submission
      setAdditionalSkills('');
      
      // Clear any previous errors
      if (error) {
        setError('');
      }
    } catch (error) {
      console.error('Error submitting additional skills:', error);
      setError(`Failed to submit additional skills: ${error.message}`);
    }
  };

  // Function to refresh additional skills
  const refreshAdditionalSkills = async () => {
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch('/users/profile/additional-skills', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdditionalSkills(data.additional_skills || '');
      } else {
        const errorText = await response.text();
        console.error('Refresh skills error response:', errorText);
        setAdditionalSkills(''); // Clear skills on error
      }
    } catch (error) {
      console.error('Error refreshing additional skills:', error);
      setAdditionalSkills(''); // Clear skills on error
    }
  };

  // REMOVED: Automatic call to refresh additional skills
  // useEffect(() => {
  //   refreshAdditionalSkills();
  // }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a PDF or DOCX file.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    console.log('Uploading file:', selectedFile.name);
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await UserService.uploadResume(formData);
      console.log('Resume uploaded successfully');
      setUploaded(true);
      setUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload resume.');
      setUploading(false);
    }
  };

  const handleParse = async () => {
    if (!selectedFile) {
      setError('No file to parse.');
      return;
    }

    console.log('Parsing file:', selectedFile.name);
    setParsing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await UserService.parseResume(formData);
      console.log('Resume parsed successfully');
      setParsed(true);
      setParsing(false);
    } catch (error) {
      console.error('Parse error:', error);
      setError(error.message || 'Failed to parse resume.');
      setParsing(false);
    }
  };

  return (
    <Box className="resume-upload-container">
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
        Welcome to Ayuda!
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
        Let's get started by uploading your resume to get personalized course recommendations.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Step 1: Upload Resume */}
      <Paper elevation={3} className="upload-section">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Step 1: Upload Your Resume
        </Typography>
        
        <Box className="file-upload-area">
          <input
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            id="resume-file-input"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="resume-file-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<Upload />}
              sx={{
                borderColor: '#f16d2c',
                color: '#f16d2c',
                '&:hover': {
                  borderColor: '#e55a1a',
                  backgroundColor: 'rgba(241, 109, 44, 0.1)',
                },
              }}
            >
              Browse Files
            </Button>
          </label>
          
          {selectedFile && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description color="primary" />
              <Typography variant="body2">
                {selectedFile.name}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          sx={{
            mt: 2,
            backgroundColor: '#f16d2c',
            '&:hover': {
              backgroundColor: '#e55a1a',
            },
          }}
        >
          {uploading ? <CircularProgress size={20} color="inherit" /> : 'Upload Resume'}
        </Button>

        {uploaded && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle color="success" />
            <Typography variant="body2" color="success.main">
              Resume uploaded successfully!
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Step 2: Parse Resume - COMMENTED OUT */}
      {/* {uploaded && (
        <Paper elevation={3} className="parse-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Step 2: Parse Resume
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleParse}
            disabled={parsing}
            sx={{
              backgroundColor: '#f16d2c',
              '&:hover': {
                backgroundColor: '#e55a1a',
              },
            }}
          >
            {parsing ? <CircularProgress size={20} color="inherit" /> : 'Parse Resume'}
          </Button>

          {parsed && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" />
              <Typography variant="body2" color="success.main">
                Resume parsed successfully!
              </Typography>
            </Box>
          )}
        </Paper>
      )} */}

      {/* Step 3: Additional Information - Now shown after upload instead of after parse */}
      {uploaded && (
        <>
          <Paper elevation={3} className="courses-section">
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Add Completed Coursework
            </Typography>
            
            <Box sx={{ position: 'relative', width: '100%' }}>
              <TextField
                fullWidth
                placeholder="Search from course catalog..."
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchQuery && (
                        <IconButton onClick={() => setSearchQuery('')} aria-label="clear">
                          <Close />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              
              {searchLoading && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={20} />
                </Box>
              )}

              {searchResults.length > 0 && (
                <ClickAwayListener onClickAway={() => setCourseSearchOpen(false)}>
                  <Popper
                    open={courseSearchOpen}
                    anchorEl={searchAnchorEl}
                    transition
                    disablePortal={false}
                    placement="bottom-start"
                    sx={{ 
                      zIndex: 9999,
                      width: '100%',
                      maxWidth: '600px', // Constrain maximum width
                      '& .MuiPaper-root': {
                        width: '100%',
                        maxWidth: '600px', // Constrain maximum width
                        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                        border: '1px solid rgba(0,0,0,0.15)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: 'background.paper',
                        backdropFilter: 'blur(8px)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'background.paper',
                          zIndex: -1
                        }
                      }
                    }}
                  >
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={350}>
                        <Paper 
                          sx={{ 
                            height: 'auto',
                            maxHeight: '280px', // Height for exactly 5 items (56px each)
                            overflow: 'auto',
                            width: '100%',
                            maxWidth: '600px', // Constrain maximum width
                            backgroundColor: 'background.paper',
                            border: '1px solid rgba(0,0,0,0.15)',
                            borderRadius: '8px',
                            position: 'relative',
                            '&::-webkit-scrollbar': {
                              width: '6px'
                            },
                            '&::-webkit-scrollbar-track': {
                              background: 'rgba(0,0,0,0.05)',
                              borderRadius: '3px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: 'rgba(0,0,0,0.2)',
                              borderRadius: '3px',
                              '&:hover': {
                                background: 'rgba(0,0,0,0.3)'
                              }
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'background.paper',
                              zIndex: -1
                            }
                          }}
                        >
                          <List sx={{ p: 0, position: 'relative', zIndex: 1 }}>
                            {searchResults.slice(0, 5).map((course) => (
                              <ListItem
                                key={course.id}
                                onClick={() => handleCourseSelect(course)}
                                sx={{ 
                                  cursor: 'pointer',
                                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                                  backgroundColor: 'background.paper',
                                  height: '56px', // Fixed height for each item
                                  minHeight: '56px',
                                  '&:last-child': {
                                    borderBottom: 'none'
                                  },
                                  '&:hover': { 
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    transition: 'background-color 0.2s ease'
                                  }
                                }}
                              >
                                <ListItemText 
                                  primary={`${course.course_id} - ${course.course_name}`}
                                  secondary={course.course_description}
                                  primaryTypographyProps={{ 
                                    fontSize: '0.9rem', 
                                    fontWeight: 500,
                                    noWrap: true,
                                    sx: { overflow: 'hidden', textOverflow: 'ellipsis' }
                                  }}
                                  secondaryTypographyProps={{ 
                                    fontSize: '0.8rem',
                                    sx: { 
                                      overflow: 'hidden', 
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: 'vertical'
                                    }
                                  }}
                                  sx={{ 
                                    flex: 1,
                                    minWidth: 0,
                                    mr: 1
                                  }}
                                />
                                <Chip
                                  label={course.prerequisites?.length > 0 ? `${course.prerequisites.length} Prereqs` : 'No Prereqs'}
                                  size="small"
                                  color={course.prerequisites?.length > 0 ? 'warning' : 'success'}
                                  variant="outlined"
                                  sx={{ 
                                    flexShrink: 0,
                                    fontSize: '0.7rem',
                                    height: '24px'
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Fade>
                    )}
                  </Popper>
                </ClickAwayListener>
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Search and add your completed courses to get better recommendations.
            </Typography>

            {selectedCourses.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedCourses.map((course) => (
                  <Chip
                    key={course.id}
                    label={`${course.course_id} - ${course.course_name}`}
                    onDelete={() => handleCourseRemove(course.id)}
                    color="primary"
                    variant="outlined"
                    size="small"
                    deleteIcon={<Close />}
                  />
                ))}
              </Box>
            )}
          </Paper>

          <Paper elevation={3} className="skills-section">
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Add Additional Skills
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter any additional skills, certifications, or experiences..."
                variant="outlined"
                value={additionalSkills}
                onChange={(e) => setAdditionalSkills(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSubmitSkills}
                disabled={!additionalSkills.trim()}
                sx={{
                  backgroundColor: '#f16d2c',
                  '&:hover': {
                    backgroundColor: '#e55a1a',
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </Paper>

          {/* Recommendations Component */}
          <Recommender />
        </>
      )}
    </Box>
  );
};

export default ResumeUpload; 