import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Switch, FormControlLabel, Box, AppBar, Toolbar, Typography } from '@mui/material';
import MainContainer from './Components/MainComponent'; // Adjust the import according to your project structure
import InputComponent from './Components/InputComponent'; // Adjust the import according to your project structure
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutComponent from './Components/AboutComponent'

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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
                                    color: 'primary.main',
                                    textDecoration: 'none'
                                }}
                            >
                                CheckMates
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                        
                        </Toolbar>
                    </AppBar>
                </Box>
                <div className="app-container" style={{ marginTop: '64px',  }}>
                    <Routes>
                        <Route path="/" element={<MainContainer showSettings={showSettings} setShowSettings={setShowSettings} darkMode={darkMode} setDarkMode={setDarkMode} />} />
                        <Route path="/input" element={<InputComponent />} />
                    
                        <Route path="/about" element={<AboutComponent setShowSettings={setShowSettings} />} />

                        <Route path="/receipt" element={<div><h1>NEW</h1></div>} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;