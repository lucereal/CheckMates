import React, { useEffect, useState, useRef } from 'react';
import InputImage from '../Shared/InputImage/InputImage';
import {Modal, Row, Col} from 'react-bootstrap';
import axios from 'axios';

import { mock } from './mockReceipt';
import ReceiptBreakdown from '../Shared/ReceiptBreakdown/ReceiptBreakdown';

import { Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getUrlId } from '../Shared/HelperFunctions';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import AdbIcon from '@mui/icons-material/Adb';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  });

const MainContainer = () => {
    const [receiptImg, setReceiptImg] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [existingReceiptId, setExistingReceiptId] = useState(getUrlId());
    const inputRef = useRef();
    const [showJoin, setShowJoin] = useState(false); // Share modal
    const [value, setValue] = React.useState(0);
    const ref = React.useRef(null);

    React.useEffect(() => {
        console.log("ref: ", ref);
        //ref.current.ownerDocument.body.scrollTop = 0;
        //setMessages(refreshMessages());
      }, [value]);

    const joinReceiptInitiate = (inputRef) => {
        console.log("inputRef: ", inputRef.current.value);
        const receiptId = inputRef.current.value;
        navigate(`/input/?receiptId=${receiptId}`);
    }
    const joinReceiptModal = () => {
        if(showJoin){
            console.log('opening dialog showJoin: ', showJoin);
            return (
                <Dialog open={showJoin} onClose={() => setShowJoin(false)}>
                    <DialogTitle>Join Receipt</DialogTitle>
                    <DialogContent>
                    <TextField
                      autoFocus
                      required
                      margin="dense"
                      id="name"
                      name="joinCode"
                      label="Join Code"
                      variant="standard"
                      inputRef={inputRef}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setShowJoin(false)}>Cancel</Button>
                    <Button onClick={() => joinReceiptInitiate(inputRef)}>Join</Button>
                  </DialogActions>
                </Dialog>
                
               
            )
        }

    }

    if (receiptLoading) {
        return (
            <div id='loading-receipt-spinner'>
                <Spinner />
            </div>
        )
    } else {
        if (receiptData !== null && receiptData !== undefined) {
            console.log('-- MainContainer.js|79 >> ', receiptData);
            return (
                <div id="receipt-breakdown-container">
                    <ReceiptBreakdown data={receiptData} />
                </div>
            )
        } else {
            return (
                <>
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar position="fixed" sx={{ bgcolor: 'background.paper', boxShadow: 'none' }}>
                            <Toolbar>
                            <Typography variant="h6" noWrap component="a" href="/" sx={{ mr: 2, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'primary', textDecoration: 'none' }}>
                                    CheckMates
                                </Typography>
                                <Box sx={{ flexGrow: 1 }} />

                            <Button color="primary"  >Login</Button>
                            </Toolbar>
                        </AppBar>
                    </Box>
                
                    {/* <Container fixed>

                <Button size="large" className='menu-body-button'  >New Receipt</Button>
                </Container> */}
                <div id="menu-container" className="d-flex flex-column align-items-center justify-content-center vh-100">
                    
                    
                        <Row className="d-flex justify-content-center mb-3 w-100">
                            
                        <Col xs={12} md={6} lg={4} xl={4} xxl={4}>
                                    <Button  id="join-receipt-btn" onClick={() => { navigate(`/input`)}}  >New Receipt</Button>
                                </Col>
                            
                        </Row>
                        <Row className="justify-content-center mb-3 w-100">
                            <Col xs={12} md={6} lg={4} xl={4} xxl={4}>
                                <Button id="join-receipt-btn"  onClick={() => setShowJoin(true)}>Join Receipt</Button>
                            </Col>
                        </Row>
                   
                    
                        {joinReceiptModal()}
                </div>
                
                
                </>
            );
        }
    }
}

export default MainContainer;