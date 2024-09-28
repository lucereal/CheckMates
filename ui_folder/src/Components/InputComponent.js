import React, { useState, useEffect } from 'react';
import InputImage from '../Shared/InputImage/InputImage';
//import Button from 'react-bootstrap/Button';
import { Button, Col, Container, Navbar, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { mock } from './mockReceipt';
//import ReceiptBreakdown from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import ReceiptBreakdownWrapper from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import InputNames from '../Shared/InputNames/InputNames';
import NameTags from '../Shared/NameThings/NameTags';
//import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InputComponent = () => {
    const [receiptImg, setReceiptImg] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 
    const [existingReceiptId, setExistingReceiptId] = useState(null); 
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const chatHubUrl = backendApiUrl + "/chatHub";

    const getUrlId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('receiptId'); // Assuming the ID is passed as a query parameter
    };
    useEffect(() => {

        console.log("here in useEffect for loading existing receipt");
        
        const id = getUrlId();
        setExistingReceiptId(id);

        console.log("id: " + id);
        console.log(existingReceiptId)

        if (id) {
            
            //const url = "https://receiptparserdevelop001.azurewebsites.net/HandleReceipt/GetReceipt/" +id;
            //const urlLocal = "https://localhost:7196/HandleReceipt/GetReceipt/" +id;
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
    }, []);


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

        console.log("API URL: " + process.env.REACT_APP_BACKEND_API_URL);
        //const url = 'https://receiptparserservices20230928182301.azurewebsites.net/api/ParseReceipt?name=Functions';
        // const url = 'https://receiptparserdevelop001.azurewebsites.net/ParseReceipt/ParseReceipt';
        // const urlLocal = 'https://localhost:7196/ParseReceipt/ParseReceipt';
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
      
            // const createReceiptUrlDev = "https://receiptparserdevelop001.azurewebsites.net/HandleReceipt/CreateReceipt";
            // const createReceiptUrlLocal = "https://localhost:7196/HandleReceipt/CreateReceipt";
            const createReceiptUrl = backendApiUrl + "/HandleReceipt/CreateReceipt";
            axios.post(createReceiptUrl, payload).then(res => {
                console.log('-- ReceiptBreakdown.js|109 >> res', res);
                
                if (res.status == "200") {
                    const id = res?.data?.receipt?._id;
                    console.log("both call success");
                    console.log(res.data);
                    console.log("setting receipt data");
                    setReceiptData(res?.data?.receipt);
                    navigate("/input/?receiptId=" + id);
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

                <div id="input-receipt-container" className="d-flex flex-column align-items-center justify-content-center vh-100 p-3" >
                <div className='upload-section w-100 align-items-center justify-content-center'>

                    <h4 className='upload-header mb-3'>
                        Upload your receipt
                    </h4>
                    
                    
                    <div className="mb-4">
                    <InputImage receiptImg={receiptImg} setReceiptImg={setReceiptImg} />
                    </div>
                    <div className="mb-4 ">
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

<div className="mb-4 ">
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
                </div>
                </div>


                
                {/* Make a component for it... */}
                <div className='bottom-nav'/>
            </div>
            </>
            
        );
    }
}

export default InputComponent;
