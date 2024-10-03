import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AboutComponent = ({setShowSettings}) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        console.log("in handleBackClick")
        setShowSettings(true); // Keep the settings open
        navigate('/');         // Navigate to the main page ("/")
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            width: { xs: '90%', md: '70%' }, mb:3, mt:3, bgcolor: 'background.paper', p:3 }}>
    <Typography variant="h5" component="h1" color="primary.main" gutterBottom 
        sx={{ fontWeight: 'bold' }}>
        About CheckMates
    </Typography>
    {/* <Typography sx={{ , fontWeight: 400, color: 'text.primary', textDecoration: 'none',
                        fontSize: isMobile ? '.8rem' : '1rem', m: isMobile ? 1 : 2
                     }}> */}
    <Typography variant="body1" component="p" sx={{ mb: 2, lineHeight: 1.8, fontFamily: 'monospace', color: 'text.primary' }}>
    CheckMates is a web application designed to simplify splitting expenses with friends, especially when one person covers the bill for a group. The app allows users to upload a picture of a receipt and quickly determine how much each person owes. I developed this app as a personal side project to solve a common problem I’ve faced and to enhance my skills as a developer.
    </Typography>
    <Typography variant="body1" component="p" sx={{ mb: 2, lineHeight: 1.8 , fontFamily: 'monospace', color: 'text.primary'}}>
        Built from the ground up using React, ASP.NET Core, and MongoDB, CheckMates is fully open-source and hosted on Azure. It leverages Azure Document Intelligence to accurately parse receipt data, and features real-time collaboration powered by SignalR. The app is also configured as a Progressive Web App (PWA) for seamless mobile use. Future updates aim to integrate payment services and enhance the overall experience.
    </Typography>
    <Typography variant="body1" component="p" sx={{ mt: 3, fontStyle: 'italic', lineHeight: 1.8, fontFamily: 'monospace', color: 'text.primary' }}>
        This project has been a passion of mine, and I’m excited to continue improving it. I hope it helps others as much as it has helped me!
    </Typography>
    <Button size="large" color="primary" onClick={() => handleBackClick()} sx={{ mt: 3, mb:3 }}>
                Back
            </Button>
        </Box>
    );
};

export default AboutComponent;