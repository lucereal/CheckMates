import React, { useState } from 'react';
import InputImage from '../Shared/InputImage/InputImage';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


const InputComponent = () => {
    const [receiptImg, setReceiptImg] = useState(null);

    const sendReceipt = () => {

        if (receiptImg === null || receiptImg === undefined) {
            console.log("-- no image selected"); // TODO SHOW VISUAL ERROR OR DISABLE IT
            return;
        }

        var formData = new FormData();
        formData.append('file', receiptImg);

        const url = 'https://receiptparserservices20230928182301.azurewebsites.net/api/ParseReceipt?name=Functions';

        axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log("-- RES: ", res);
        }).catch((err) => {
            console.log("-- ERR: ", err)
        })
    }

    return (
        <div id="input-receipt-container">
            <h1>
                Enter your receipt
            </h1>
            <InputImage setReceiptImg={setReceiptImg} />
            <Button 
                id="submit-button" 
                variant="primary"
                onClick={() => sendReceipt()}
            >
                Submit
            </Button>
        </div>
    );
}

export default InputComponent;
