import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Fade,
  Slide,
} from '@mui/material';
import {
  Close,
  Psychology,
} from '@mui/icons-material';

const CourseExplanation = ({ open, onClose, explanation, loading, error }) => {
  if (!open) return null;

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 400,
          maxHeight: 500,
          zIndex: 1000,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              backgroundColor: '#c19bff',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Psychology sx={{ fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Course Explanation
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                  Analyzing course...
                </Typography>
              </Box>
            ) : error ? (
              <Typography variant="body2" color="error" sx={{ textAlign: 'center', py: 2 }}>
                {error}
              </Typography>
            ) : explanation ? (
              <Box>
                {explanation.course_name && (
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    {explanation.course_name}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2, textAlign: 'justify' }}>
                  {explanation.reasoning}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="caption" color="text.secondary">
                    Model: {explanation.model_used}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Response: {explanation.response_length} chars
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Paper>
      </Box>
    </Slide>
  );
};

export default CourseExplanation; 