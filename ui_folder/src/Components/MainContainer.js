import React, { useEffect, useState } from 'react';
import InputImage from '../Shared/InputImage/InputImage';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { mock } from './mockReceipt';
import ReceiptBreakdown from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import InputNames from '../Shared/InputNames/InputNames';
import NameTags from '../Shared/NameThings/NameTags';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUrlId } from '../Shared/HelperFunctions';

const MainContainer = () => {
    const [receiptImg, setReceiptImg] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [existingReceiptId, setExistingReceiptId] = useState(getUrlId());

    useEffect(() => {
        if (existingReceiptId) {
            const url = "https://receiptparserservices20230928182301.azurewebsites.net/api/GetReceipt?name=Functions";
            const payload = {
                id: existingReceiptId
            }

            setReceiptLoading(true);
            axios.post(url, payload).then(res => {
                setReceiptData(res?.data?.receipt);
                setReceiptLoading(false);
            }).catch(e => {
                console.log('-- ERR', e);
                setReceiptLoading(false);
            })
        }
    }, []);
    
    const sendReceipt = () => {
        navigate("/")
        if (receiptImg === null || receiptImg === undefined) {
            console.log("-- no image selected"); // TODO SHOW VISUAL ERROR OR DISABLE IT
            return;
        }
        setIsLoading(true);
        
        // Must pass the array while preserving quotes
        const names = "['" + participants.join("','") + "']";
        
        var formData = new FormData();
        formData.append('file', receiptImg);
        formData.append('users', names);

        const url = 'https://receiptparserservices20230928182301.azurewebsites.net/api/ParseReceipt?name=Functions';

        axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log("-- RES: ", res);
            setReceiptData(res?.data?.receipt);
            setIsLoading(false);
        }).catch((err) => {
            console.log("-- ERR: ", err)
            setIsLoading(false);
        })
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
                <div id="input-receipt-container">
                    <div className='upload-section'>
    
                        <p className='upload-instruction'>
                            Upload your receipt
                        </p>
                        <InputImage setReceiptImg={setReceiptImg} />
                        <InputNames 
                            participantsNo={participants.length}
                            participants={participants}
                            setParticipants={setParticipants}
                        />
                    </div>
    
                    {/* Make tags for each participant */}
                    { participants.length ? 
                        <NameTags names={participants} setNames={setParticipants}/> 
                        : null
                    }
    
                    <Button 
                        className='submit-button'
                        id="submit-button" 
                        variant="primary"
                        onClick={() => sendReceipt()}
                        disabled={ 
                            participants.length === 0 || (receiptImg === null || receiptImg === undefined) ||
                            isLoading
                        }
                    >
                        {isLoading ? <Spinner size="sm"/> : "Submit"}
                    </Button>
                    
                    {/* Make a component for it... */}
                    <div className='bottom-nav'/>
                </div>
            );
        }
    }
}

export default MainContainer;
