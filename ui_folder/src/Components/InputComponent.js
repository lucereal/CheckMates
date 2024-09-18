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
        //navigate("/")
        if (receiptImg === null || receiptImg === undefined) {
            console.log("-- no image selected"); // TODO SHOW VISUAL ERROR OR DISABLE IT
            return;
        }
        setIsLoading(true);
        
        console.log("participants: " + participants);
        // Must pass the array while preserving quotes
        //og: 
        //const names = "['" + participants.join("','") + "']";
        //const names = "['" + participants.join(",") + "']";
        
        var formData = new FormData();
        formData.append('file', receiptImg);
        participants.forEach(p => {
            formData.append('users', p);
        })
        //formData.append('users', names);

        //const url = 'https://receiptparserservices20230928182301.azurewebsites.net/api/ParseReceipt?name=Functions';
        const url = 'https://localhost:7196/ParseReceipt/ParseReceipt';
        
        axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log("-- RES: ", res);
            const payload = {
                "receipt": res.data.receipt,
                "id": res.data.receipt.receiptId
            }
      
            axios.post("https://localhost:7196/HandleReceipt/CreateReceipt", payload).then(res => {
                console.log('-- ReceiptBreakdown.js|109 >> res', res);
                
                if (res.status == "200") {
                    const id = res?.data?.receipt?._id;
                    console.log("both call success");
                    console.log(res.data);
                    console.log("setting receipt data");
                    setReceiptData(res?.data?.receipt);
                    navigate("/?receiptId=" + id);
                }
            }).catch((err) => {
                console.log('-- ERR', err);
            })

            
            setIsLoading(false);
        }).catch((err) => {
            console.log("-- ERR: ", err)
            setIsLoading(false);
        })
    }

    if (receiptData !== null && receiptData !== undefined) {
        console.log("creating receipt breakdown");
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
