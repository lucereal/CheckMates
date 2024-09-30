import React, { useEffect, useRef, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import axios from 'axios';
import Button from '@mui/material/Button';

const EditModal = (props) => {
    const {show, setShow, receiptId, item} = props;
    const descriptionRef = useRef();
    const quantityRef = useRef();
    const priceRef = useRef();
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const editItemUrl = backendApiUrl + "/HandleReceipt/EditItem";
    const deleteItemUrl = backendApiUrl + "/HandleReceipt/DeleteItem";

    
    const submitEditItem = async (event) => {
        event.preventDefault();
        const updatedItem = {
            id: receiptId,
            itemId: item.itemId,
            description: descriptionRef.current.value,
            quantity: 1,
            price: priceRef.current.value,
        };

        try {
            console.log('Calling API to update item:', updatedItem);

            axios.post(editItemUrl, updatedItem).then(res => {
                console.log('-- ReceiptBreakdown.js|109 >> res', res);
                if (res.status == "200") {
                    const id = res?.data?.receipt?._id;
                    console.log("edit user item success");
                    console.log(res.data.receipt);
                    setShow(false);
                    return true;
                }else{
                    return false;
                }
            }).catch((err) => {
                console.log('-- ERR', err);
                return false;
            })
            //setShow(false);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDelete = async (itemId) => {
        const deleteItem = {
            id: receiptId,
            itemId: itemId
        };
        try {
            console.log('Calling API to update item:', deleteItem);

            axios.post(deleteItemUrl, deleteItem).then(res => {
                console.log('-- ReceiptBreakdown.js|109 >> res', res);
                if (res.status == "200") {
                    const id = res?.data?.receipt?._id;
                    console.log("remove user item success");
                    console.log(res.data.receipt);
                    setShow(false);

                    return true;
                }else{
                    return false;
                }
            }).catch((err) => {
                console.log('-- ERR', err);
                return false;
            })
            //setShow(false);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };
    
    return (
        <>
       
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Edit item</Modal.Title>
        </Modal.Header>
        <Modal.Body id="edit-body-container">
            {item && (
        <Form id='edit-form' onSubmit={submitEditItem}>
                <Form.Group controlId="formItemDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={item.description}
                        ref={descriptionRef}
                        required
                    />
                </Form.Group>
     
                <Form.Group controlId="formItemPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        defaultValue={item.price}
                        ref={priceRef}
                        required
                    />
                </Form.Group>
                {/* <Button id='submit-edit-button' type="submit">
                    Submit
                </Button>
                <Button id='delete-edit-button'>
                    Delete
                </Button> */}
                <Button variant="contained"  type="submit">
                Submit
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(item.itemId)}>
                Delete
                </Button>
            </Form>
)}
        </Modal.Body>
    </Modal>
        

        </>
    )
}

export default EditModal;