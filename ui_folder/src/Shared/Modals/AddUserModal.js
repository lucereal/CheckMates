import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const AddUserModal = (props) => {
    const {show, setShow, receiptId} = props;
    const userRef = useRef();
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const addUserUrl = backendApiUrl + "/HandleReceipt/AddUsers";
    const submitAddUser = async () => {
        
        if(userRef.current.value !== "" && userRef.current.value !== null && userRef.current.value !== undefined){
            
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
        }
        
    };

    
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            submitAddUser();
        }
    };

    return (
        <>
       
       <Dialog open={show} onClose={() => setShow(false)} onKeyDown={handleKeyDown}>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogContent>
                    <TextField required margin="dense" id="name" name="name" label="Name" variant="standard" inputRef={userRef} />
                  </DialogContent>
                  <DialogActions>
                    <Button variant="text" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="text" onClick={() => submitAddUser()}>Submit</Button>
                  </DialogActions>
                </Dialog>
    
        </>
    )
}

export default AddUserModal;