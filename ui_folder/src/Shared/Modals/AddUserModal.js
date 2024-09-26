import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from 'axios';

const AddUserModal = (props) => {
    const {show, setShow, receiptId} = props;
    const userRef = useRef();

    const submitAddUser = async (event) => {
        event.preventDefault();
        const addUsers = {
            id: receiptId,
            userNames: [userRef.current.value]
        };

        try {
            console.log('Calling API to add user to receipt:', addUsers);
            const addUsersUrlDev = "https://receiptparserdevelop001.azurewebsites.net/HandleReceipt/AddUsers";
            const addUsersUrlLocal = "https://localhost:7196/HandleReceipt/AddUsers";
            axios.post(addUsersUrlLocal, addUsers).then(res => {
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
            <Modal.Title>Edit item</Modal.Title>
        </Modal.Header>
        <Modal.Body id="add-user-body-container">
        <Form id='edit-form' onSubmit={submitAddUser}>
                <Form.Group controlId="formItemDescription">
                    <Form.Label>New User</Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={"User Name"}
                        ref={userRef}
                        required
                    />
                </Form.Group>
                
                <Button id='submit-add-user-button' type="submit">
                    Submit
                </Button>
            </Form>

        </Modal.Body>
    </Modal>
        

        </>
    )
}

export default AddUserModal;