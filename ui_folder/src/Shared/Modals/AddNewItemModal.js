import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from 'axios';

const AddNewItemModal = (props) => {
    const {show, setShow, receiptId} = props;
    const descriptionRef = useRef();
    const quantityRef = useRef();
    const priceRef = useRef();

    const submitAddNewItem = async (event) => {
        event.preventDefault();
        
        const addItem = {
            id: receiptId,
            description: descriptionRef.current.value,
            quantity: quantityRef.current.value,
            price: priceRef.current.value,
        };

        try {
            console.log('Calling API to add new item:', addItem);
            const addItemUrlDev = "https://receiptparserdevelop001.azurewebsites.net/HandleReceipt/AddItem";
            const addItemUrlLocal = "https://localhost:7196/HandleReceipt/AddItem";
            axios.post(addItemUrlLocal, addItem).then(res => {
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

    
    return (
        <>
       
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body id="add-item-body-container">
            
        <Form id='edit-form' onSubmit={submitAddNewItem}>
                <Form.Group controlId="formItemDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={"Item Description"}
                        ref={descriptionRef}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formItemQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="number"
                        defaultValue={0}
                        ref={quantityRef}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formItemPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        defaultValue={0.00}
                        ref={priceRef}
                        required
                    />
                </Form.Group>
                <Button id='submit-add-new-item-button' type="submit">
                    Submit
                </Button>
            </Form>
        </Modal.Body>
    </Modal>
        

        </>
    )
}

export default AddNewItemModal;