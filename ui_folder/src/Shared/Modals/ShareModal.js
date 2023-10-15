import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { copyToClipboard } from "../HelperFunctions";

const ShareModal = (props) => {
    const {show, setShow, data} = props;
    const [copyText, setCopyText] = useState();
    const inputRef = useRef();

    useEffect(() => {
        if (show) {
            const linkToShare = window.location.origin + "?receiptId=" + data._id;
            inputRef.current.value = linkToShare;
        } else {
            setCopyText("Copy");
        }
    }, [show]);

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Share me!</Modal.Title>
            </Modal.Header>
            <Modal.Body id="share-body-container">
                Share this link with your friends:
                <input type="text" readOnly ref={inputRef}/>
                <Button id='copy-button' variant="primary" onClick={() => copyToClipboard(inputRef, setCopyText)}>
                    {copyText}
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ShareModal;