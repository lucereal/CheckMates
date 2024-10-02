import React, { useEffect, useRef, useState } from "react";

import axios from 'axios';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const AddNewItemModal = (props) => {
    const {show, setShow, receiptId} = props;
    const descriptionRef = useRef();
    const quantityRef = useRef();
    const priceRef = useRef();
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const addItemUrl = backendApiUrl + "/HandleReceipt/AddItem";
    const submitAddNewItem = async () => {
        
        
        const addItem = {
            id: receiptId,
            description: descriptionRef.current.value,
            quantity: quantityRef.current.value,
            price: priceRef.current.value,
        };

        try {
            console.log('Calling API to add new item:', addItem);

            axios.post(addItemUrl, addItem).then(res => {
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            submitAddNewItem();
        }
    };

    return (
        <>
              <Dialog open={show} onClose={() => setShow(false)} onKeyDown={handleKeyDown}>
                    <DialogTitle>Add Item</DialogTitle>
                    <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField required margin="dense" id="description" name="description" label="Description" variant="standard" inputRef={descriptionRef} />
                            <TextField required margin="dense" id="quantity" name="quantity" label="Quantity" variant="standard" inputRef={quantityRef} />
                            <TextField required margin="dense" id="price" type="number" step="0.01" name="price" label="Price" variant="standard" inputRef={priceRef} />
                        </Box></DialogContent>
                  <DialogActions>
                    <Button variant="text" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="text" onClick={() => submitAddNewItem()}>Submit</Button>
                  </DialogActions>
                </Dialog>
        </>
    )
}

export default AddNewItemModal;