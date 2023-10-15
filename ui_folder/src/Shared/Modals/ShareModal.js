import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { copyToClipboard } from "../HelperFunctions";

const ShareModal = (props) => {
    const {show, setShow, receiptId} = props;
    const [copyText, setCopyText] = useState();
    const inputRef = useRef();

    useEffect(() => {
        if (show) {
            const linkToShare = window.location.origin + "?receiptId=" + receiptId;
            inputRef.current.value = linkToShare;
        } else {
            setCopyText("Copy");
        }
    }, [show]);

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Share with your friends</Modal.Title>
            </Modal.Header>
            <Modal.Body id="share-body-container">
                <input type="text" readOnly ref={inputRef}/>
                <Button id='copy-button' variant="primary" onClick={() => copyToClipboard(inputRef, setCopyText)}>
                    {copyText}
                </Button>
                {/* <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button> */}
            </Modal.Body>
        </Modal>
    )
}

export default ShareModal;