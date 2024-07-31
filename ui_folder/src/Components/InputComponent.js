import React, { useState } from 'react';
import InputImage from '../Shared/InputImage/InputImage';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { mock } from './mockReceipt';
import ReceiptBreakdown from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import InputNames from '../Shared/InputNames/InputNames';
import NameTags from '../Shared/NameThings/NameTags';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InputComponent = () => {
    const [receiptImg, setReceiptImg] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

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

        //const url = 'https://receiptparserservices20230928182301.azurewebsites.net/api/ParseReceipt?name=Functions';
        const url = 'http://localhost:7257/api/ParseReceipt';
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

    if (receiptData !== null && receiptData !== undefined) {
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

export default InputComponent;
