import React, { useState } from 'react';
import InputImage from '../Shared/InputImage/InputImage';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { mock } from './mockReceipt';
import ReceiptBreakdown from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import InputNames from '../Shared/InputNames/InputNames';
import NameTags from '../Shared/NameThings/NameTags';
import { Spinner } from 'react-bootstrap';

const InputComponent = () => {
    const [receiptImg, setReceiptImg] = useState(null);
    const [receiptData, setReceiptData] = useState(mock);
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendReceipt = () => {
        if (receiptImg === null || receiptImg === undefined) {
            console.log("-- no image selected"); // TODO SHOW VISUAL ERROR OR DISABLE IT
            return;
        }

        setIsLoading(true);
        var formData = new FormData();
        formData.append('file', receiptImg);

        const url = 'https://receiptparserservices20230928182301.azurewebsites.net/api/ParseReceipt?name=Functions';

        axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log("-- RES: ", res);
            setReceiptData(res);
            setIsLoading(false);
        }).catch((err) => {
            console.log("-- ERR: ", err)
            setIsLoading(false);
        })
    }

    console.log('-- InputComponent.js|38 >> receiptData', receiptData);
    if (receiptData !== null && receiptData !== undefined) {
        return (
            <div id="receipt-breakdown-container">
                <ReceiptBreakdown data={mock} />
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
                        participants.length === 0 || (receiptImg == null || receiptImg == undefined) ||
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
