import React, { useState, useEffect } from 'react';
import InputImage from '../Shared/InputImage/InputImage';
//import Button from 'react-bootstrap/Button';
import { Col, Navbar, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { mock } from './mockReceipt';
//import ReceiptBreakdown from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import ReceiptBreakdownWrapper from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import InputNames from '../Shared/InputNames/InputNames';
import NameTags from '../Shared/NameThings/NameTags';
//import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FaceIcon from '@mui/icons-material/Face';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

const InputComponent = () => {
    const [receiptImg, setReceiptImg] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [receiptId, setReceiptId] = useState(null);
    const navigate = useNavigate(); 
    const [existingReceiptId, setExistingReceiptId] = useState(null); 
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const chatHubUrl = backendApiUrl + "/chatHub";
    const [showUserField, setShowUserField] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const inputRef = useRef();
    const [fileName, setFileName] = useState('');
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [isImageEntry, setIsImageEntry] = useState(false);


    const getParticipantChips = () => {

        return (
            <>
        {participants.map((name, index) => (
            <Chip
                c 
                key={index}
                label={name}
                variant="outlined"
                size="small"
                onDelete={() => {
                    const temp = participants;
                    temp.splice(index, 1);
                    setParticipants([...temp]);
                }}
                
            />
        ))}
    </>
        )
        
    }

    const handleAddUser = () => {
        const userName = inputRef.current.value;
        if (userName.trim()) {
            const temp = participants;
            temp.push(userName);
            setParticipants([...temp]);

            // Now do this to clear the input field
            inputRef.current.value = "";
            setShowSubmitButton(true);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log("handleFileChange: ", file.name);
        if (file) {
            setReceiptImg(file);
            setFileName(file.name);
        }
    };
    const handleBackClick = () => {
        console.log("in handleBackClick")
        
        navigate('/');         // Navigate to the main page ("/")
    };

    const handleManualEntry = () => {
        setIsManualEntry(true);
        setIsImageEntry(false);
        setShowUserField(true);
        // setReceiptImg(null);
        // setFileName('');
    }
    const handleImageEntry = () => {
        setIsManualEntry(false);
        setIsImageEntry(true);
        setShowUserField(true);
        
    }
    const sendReceipt = () => {
        console.log("in send receipt")
        if(isManualEntry) {
            setLoading(true);
            const payload = {
                "users": participants
            }

            const createReceiptUrl = backendApiUrl + "/HandleReceipt/CreateEmptyReceipt";
            axios.post(createReceiptUrl, payload).then(res => {
                console.log('-- ReceiptBreakdown.js|109 >> res', res);
                
                if (res.status == "200") {
                    const id = res?.data?.receipt?._id;
                    console.log("both call success");
                    console.log(res.data);
                    console.log("setting receipt data");
                    setReceiptData(res?.data?.receipt);
                    setLoading(false);
                    navigate("/?receiptId=" + id);
                }
            }).catch((err) => {
                console.log('-- ERR', err);
                setLoading(false);
            })

        }else{
            if (receiptImg === null || receiptImg === undefined) {
                console.log("-- no image selected"); // TODO SHOW VISUAL ERROR OR DISABLE IT
                return;
            }
            setLoading(true);
            
            console.log("participants: " + participants);
    
            
            var formData = new FormData();
            formData.append('file', receiptImg);
            participants.forEach(p => {
                formData.append('users', p);
            })
    
            const parseReceiptUrl = backendApiUrl + '/ParseReceipt/ParseReceipt';
            axios.post(parseReceiptUrl, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                console.log("-- RES: ", res);
                const payload = {
                    "receipt": res.data.receipt
                }
    
                const createReceiptUrl = backendApiUrl + "/HandleReceipt/CreateReceipt";
                axios.post(createReceiptUrl, payload).then(res => {
                    console.log('-- ReceiptBreakdown.js|109 >> res', res);
                    
                    if (res.status == "200") {
                        const id = res?.data?.receipt?._id;
                        console.log("both call success");
                        console.log(res.data);
                        console.log("setting receipt data");
                        setReceiptData(res?.data?.receipt);
                        setLoading(false);
                        navigate("/?receiptId=" + id);
                    }
                }).catch((err) => {
                    console.log('-- ERR', err);
                    setLoading(false);
                })
    
                
                
            }).catch((err) => {
                console.log("-- ERR: ", err)
                setLoading(false);
            })
        }

    }


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
        if(existingReceiptId === null || existingReceiptId === undefined) {
            return (
                <>
                    <Container fixed sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', height: '100vh' // Responsive flex direction
                     }}>
                        <Box sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: { xs: 'column', xm: 'column', md: 'row' }}}>
                            
                            <Button
                            color="primary"
                                variant={isManualEntry ? "contained" : "outlined"}
                                onClick={() => handleManualEntry()}
                            >
                                Manual Entry
                            </Button>
                            
                            <Typography sx={{ fontFamily: 'monospace', mr: 2, ml: 2, mt: 2, mb: 2, fontWeight: 700, color: 'primary.main', textDecoration: 'none' }}>
                                or
                            </Typography>
                            
                            <Button component="label" color="primary" role={undefined} variant={isImageEntry ? "contained" : "outlined"} startIcon={<CloudUploadIcon />} onClick={() => handleImageEntry()}>
                                Receipt Image
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                            </Button>
                            

                           
                            {isImageEntry && <Typography sx={{ ml: 2, color:'text.primary' }}>{fileName}</Typography>}
                            
                        </Box>
                        {showUserField && (
                            <Divider variant="middle" orientation="horizontal" sx={{ width: '100%', my: 2, borderWidth: '2px' }}/>
                        )}
                        <Box sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column'}}>
                        {showUserField && (
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2 }}>
                                <TextField size="small" variant="standard" label="Name" inputRef={inputRef}  sx={{ mb: 2 }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddUser();
                                        }
                                    }} />
                                <Button onClick={handleAddUser}>
                                    <AddCircleOutlineIcon></AddCircleOutlineIcon>
                                </Button>
                                
                            </Box>

                        )}
                        <Box sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row'}}>
                            {getParticipantChips()}
                        </Box>


                        </Box>
                        
                        
                        <Divider variant="middle" orientation="horizontal" sx={{ width: '100%', my: 2, borderWidth: '2px' }}/>

                        

                            <Box sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row', mb:2}}>
                            <Button variant="contained" color="primary" onClick={() => handleBackClick()} sx={{ mt: 2, mr:1, ml:1}}>
                                Back
                            </Button>
                            {showSubmitButton && (
                            <Button variant="contained" color="primary" sx={{ mt: 2,  mr:1, ml:1 }} onClick={() => sendReceipt()}>
                                Submit
                            </Button>
                            )}
                            </Box>
                            {loading && <CircularProgress />}
                    </Container>
                   
                </>
                
            );
        
        }
        
    }
}

export default InputComponent;
