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

import TextField from '@mui/material/TextField';
import ReceiptBreakdownWrapper from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { FormControlLabel, Switch } from '@mui/material';


const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  });

const MainContainer = ({ showSettings, setShowSettings, darkMode, setDarkMode }) => {
    const [receiptImg, setReceiptImg] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [receiptId, setReceiptId] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const chatHubUrl = backendApiUrl + "/chatHub";
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [existingReceiptId, setExistingReceiptId] = useState(getUrlId());
    const inputRef = useRef();
    const [showJoin, setShowJoin] = useState(false); // Share modal
    const [value, setValue] = React.useState(0);
    const ref = React.useRef(null);

   
    useEffect(() => {

        console.log("here in useEffect for loading existing receipt");
        
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('receiptId');
        setExistingReceiptId(id);

        console.log("id: " + id);
        console.log(existingReceiptId)

        if (id) {
            
            const getReceiptUrl = backendApiUrl + "/HandleReceipt/GetReceipt/" +id;
            console.log("makeing get request for existing receipt");
            //setReceiptLoading(true);
            axios.get(getReceiptUrl).then(res => {
                console.log("got response for existing receipt");
                setReceiptData(res?.data?.receipt);

                //setReceiptLoading(false);
            }).catch(e => {
                console.log('-- ERR', e);
                //setReceiptLoading(false);
            })
        }
    }, [receiptId]);

    React.useEffect(() => {
        console.log("ref: ", ref);
        //ref.current.ownerDocument.body.scrollTop = 0;
        //setMessages(refreshMessages());
      }, [value]);

    const handleExampleReceipt = () => {
        console.log("loading example receipt");
        const getReceiptUrl = backendApiUrl + "/HandleReceipt/GetReceiptExample"
            console.log("makeing get request for existing receipt");
            //setReceiptLoading(true);
            axios.get(getReceiptUrl).then(res => {
                console.log("got response for existing receipt");
                setReceiptData(res?.data?.receipt);

                //setReceiptLoading(false);
            }).catch(e => {
                console.log('-- ERR', e);
                //setReceiptLoading(false);
            })

    }
    const joinReceiptInitiate = (inputRef) => {
        console.log("inputRef: ", inputRef.current.value);
        const receiptId = inputRef.current.value;
        setReceiptId(receiptId);
        setShowJoin(false);
        navigate(`/?receiptId=${receiptId}`);
    }
    const joinReceiptModal = () => {
        if(showJoin){
            console.log('opening dialog showJoin: ', showJoin);
            return (
                <Dialog open={showJoin} onClose={() => setShowJoin(false)}>
                    <DialogTitle>Join Receipt</DialogTitle>
                    <DialogContent>
                    <TextField
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
            console.log("receiptData: ");
            console.log(receiptData);
            console.log("creating receipt breakdown");
            return (
                <div id="receipt-breakdown-container">
                    {/* <ReceiptBreakdown data={receiptData} setData={setReceiptData} />
                     */}
                     <ReceiptBreakdownWrapper data={receiptData} 
                        setData={setReceiptData}
                        chatHubUrl={chatHubUrl}
                        receiptId={receiptData._id}
                        />
                    
                </div>
            )
        } else {
            return (
                <>
                  
                <div id="menu-container" className="d-flex flex-column align-items-center justify-content-center vh-100">
                    
                    <Box sx={{ display: 'flex', width: '100%',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', bgcolor:'background.paper'}}>
                                
                                {!showSettings ? (
                            <>
                                <Button variant="text" size='large' color="primary" onClick={() => { navigate(`/input`) }}>New Receipt</Button>
                                <Button size='large' color="primary" onClick={() => setShowJoin(true)}>Join Receipt</Button>
                                {/* <Button size='large' color="primary" onClick={() => handleExampleReceipt()}>Load Example Receipt</Button> */}
                                <Button size='large' color="primary" onClick={handleExampleReceipt}>Demo Receipt</Button>
                                <IconButton color="primary" onClick={() => setShowSettings(true)}>
                                    <MoreHorizIcon />
                                </IconButton>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', width: '100%',  alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'column', bgcolor:'background.paper'}}>
                                <Button size='large' color="primary" onClick={() => navigate('/about')}>About</Button>
                                <Button disabled size='large' color="primary" onClick={() => setShowSettings(false)}>Support</Button>
                                <Button size='large' color="primary" onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Button>
                                
                                <Button size='large' color="primary" onClick={() => setShowSettings(false)}>Back</Button>
                            </Box>
                        )}
                   
                        </Box>
                        {joinReceiptModal()}
                        
                </div>
                
                
                </>
            );
        }
    }
}

export default MainContainer;