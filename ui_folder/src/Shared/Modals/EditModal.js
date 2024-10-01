import React, { useEffect, useRef, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Button from '@mui/material/Button';

const EditModal = (props) => {
    const {show, setShow, receiptId, item} = props;
    const descriptionRef = useRef();
    const quantityRef = useRef();
    const priceRef = useRef();
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const editItemUrl = backendApiUrl + "/HandleReceipt/EditItem";
    const deleteItemUrl = backendApiUrl + "/HandleReceipt/DeleteItem";

    
    const submitEditItem = async () => {
        
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
       
       <Dialog open={show} onClose={() => setShow(false)}>
                    <DialogTitle>Edit Item</DialogTitle>
                    <DialogContent>
                    <TextField
                      autoFocus
                      required
                      margin="dense"
                      id="item-description"
                      name="item-description"
                      label="Item Description"
                      variant="standard"
                      inputRef={descriptionRef}
                    />
                     <TextField
                      autoFocus
                      required
                      margin="dense"
                      id="item-price"
                      name="item-price"
                      label="Item Price"
                      variant="standard"
                      inputRef={priceRef}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button variant="text" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="text" onClick={() => handleDelete(item.itemId)}>Delete</Button>
                    <Button variant="text" onClick={() => submitEditItem()}>Submit</Button>
                  </DialogActions>
        </Dialog>
        </>
    )
}

export default EditModal;