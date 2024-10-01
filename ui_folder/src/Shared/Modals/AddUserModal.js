import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const AddUserModal = (props) => {
    const {show, setShow, receiptId} = props;
    const userRef = useRef();
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const addUserUrl = backendApiUrl + "/HandleReceipt/AddUsers";
    const submitAddUser = async () => {
        
        const addUsers = {
            id: receiptId,
            userNames: [userRef.current.value]
        };

        try {
            console.log('Calling API to add user to receipt:', addUsers);

            axios.post(addUserUrl, addUsers).then(res => {
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
       
       <Dialog open={show} onClose={() => setShow(false)}>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogContent>
                    <TextField
                      autoFocus
                      required
                      margin="dense"
                      id="name"
                      name="name"
                      label="Name"
                      variant="standard"
                      inputRef={userRef}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button variant="text" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="text" onClick={() => submitAddUser()}>Submit</Button>
                  </DialogActions>
                </Dialog>

        {/* <Modal show={show} onHide={() => setShow(false)}>
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
    </Modal> */}
        

        </>
    )
}

export default AddUserModal;