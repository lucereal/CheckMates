import React, { useEffect, useState, useRef } from 'react';
import InputImage from '../Shared/InputImage/InputImage';
import {Button, Modal, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';

import { mock } from './mockReceipt';
import ReceiptBreakdown from '../Shared/ReceiptBreakdown/ReceiptBreakdown';
import InputNames from '../Shared/InputNames/InputNames';
import NameTags from '../Shared/NameThings/NameTags';
import { Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getUrlId } from '../Shared/HelperFunctions';

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
    

    // useEffect(() => {
    //     if (existingReceiptId) {
    //         const url = "https://receiptparserservices20230928182301.azurewebsites.net/api/GetReceipt?name=Functions";
    //         const payload = {
    //             id: existingReceiptId
    //         }

    //         setReceiptLoading(true);
    //         axios.post(url, payload).then(res => {
    //             setReceiptData(res?.data?.receipt);
    //             setReceiptLoading(false);
    //         }).catch(e => {
    //             console.log('-- ERR', e);
    //             setReceiptLoading(false);
    //         })
    //     }
    // }, []);
    
    const joinReceiptInitiate = (inputRef) => {
        console.log("inputRef: ", inputRef.current.value);
        const receiptId = inputRef.current.value;
        navigate(`/input/?receiptId=${receiptId}`);
    }
    const joinReceiptModal = () => {
        if(showJoin){
            return (
                <Modal show={showJoin} onHide={() => setShowJoin(false)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Share with your friends</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="share-body-container">
                        <input type="text" ref={inputRef}/>
                        <Button id='copy-button' variant="primary" onClick={() => joinReceiptInitiate(inputRef)}>
                            Join
                        </Button>
    
                    </Modal.Body>
                </Modal>
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
                <div id="menu-container" className="d-flex flex-column align-items-center justify-content-center vh-100">

                    
                        <Row className="justify-content-center mb-3 w-100">
                            <Col xs={12} md={6} lg={4} xl={4} xxl={4}>
                                <Link to="/input">
                                    <Button id="new-receipt-btn" >New Receipt</Button>
                                </Link>
                            </Col>
                        </Row>
                        <Row className="justify-content-center mb-3 w-100">
                            <Col xs={12} md={6} lg={4} xl={4} xxl={4}>
                                <Button id="join-receipt-btn"  onClick={() => setShowJoin(true)}>Join Receipt</Button>
                            </Col>
                        </Row>
                   
                    {joinReceiptModal()}

                </div>
            );
        }
    }
}

export default MainContainer;