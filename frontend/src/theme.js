import { createTheme } from '@mui/material/styles';

// You can import custom fonts here if needed
// import '@fontsource/roboto'; // Example for Google Fonts

const theme = createTheme({
    typography: {
        fontFamily: [
            // 'Poppins', // Modern, funky yet professional - perfect for B2B!
            //   'Outfit', // Contemporary geometric - clean and modern
            // Alternative cool options:
            // 'DM Sans', // Modern with personality
            //   'Plus Jakarta Sans', // Friendly and modern
            'Inter',    // Professional
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(','),
        // You can also customize specific typography variants
        h1: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
        },
        h2: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
        },
        h3: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
        },
        h4: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
        },
        h5: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
        },
        h6: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
        },
        body1: {
            fontFamily: 'Inter, sans-serif',
        },
        body2: {
            fontFamily: 'Inter, sans-serif',
        },
        button: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
        },
    },
    // You can also customize other theme aspects here
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

export default theme; 