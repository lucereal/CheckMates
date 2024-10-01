import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Switch, FormControlLabel, Box, AppBar, Toolbar, Typography } from '@mui/material';
import MainContainer from './Components/MainComponent'; // Adjust the import according to your project structure
import InputComponent from './Components/InputComponent'; // Adjust the import according to your project structure
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    const [darkMode, setDarkMode] = useState(false);

    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="fixed" sx={{ bgcolor: 'background.paper', boxShadow: 'none' }}>
                        <Toolbar>
                            <Typography
                                variant="h6"
                                noWrap
                                
                                component="a" href="/"
                                sx={{
                                    mr: 2,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'text.primary',
                                    textDecoration: 'none'
                                }}
                            >
                                CheckMates
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <FormControlLabel
                                control={<Switch checked={darkMode} onChange={handleThemeChange} />}
                                label="Dark Mode"
                            />
                        </Toolbar>
                    </AppBar>
                </Box>
                <div className="app-container" style={{ marginTop: '64px' }}>
                    <Routes>
                        <Route path="/" element={<MainContainer />} />
                        <Route path="/input" element={<InputComponent />} />
                        <Route path="/receipt" element={<div><h1>NEW</h1></div>} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;