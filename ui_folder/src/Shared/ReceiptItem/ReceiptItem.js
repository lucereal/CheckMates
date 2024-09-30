import React, { useState, useRef, useEffect } from 'react';
import { Button, Col, Row, Container, Dropdown, Card, Navbar, Spinner } from 'react-bootstrap';
import NameToggles from '../NameThings/NameToggles';
import { getClaimedTotal, getUrlId, getUserClaimedTotal } from '../HelperFunctions';
import SummaryModal from '../Modals/SummaryModal';
import ShareModal from '../Modals/ShareModal';
import EditModal from '../Modals/EditModal';
import AddNewItemModal from '../Modals/AddNewItemModal';
import AddUserModal from '../Modals/AddUserModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr'
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import ListItemButton from '@mui/material/ListItemButton';

/** IF ITEM ID IN THE RESPONSE STAYS IN AN ORDER, THEN THAT WILL KEEP THINGS EASY
 *  SINCE I DO NOT HAVE TO ITERATE THROUGH THINGS.
 * 
 * @param {*} props 
 * @returns 
 */
const ReceiptItem = (props) => {
    const item = props.item;
    const index = props.index;
    const users = props.users;
    const selectedName = props.selectedName;
    const userSelectedItems = props.userSelectedItems;
    const receiptId = props.receiptId;

    const [showEdit, setShowEdit] = useState(false); // Edit modal
    const [editItem, setEditItem] = useState(null);

    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const addUserUrl = backendApiUrl + "/HandleReceipt/AddUserItem";
    const removeUserUrl = backendApiUrl + "/HandleReceipt/RemoveUserItem";



    
    const getItemClaimedList = (claims) => {
        // Use the custom styles

        //use the userId in the claims to get a list of the names from the data.users array
        const claimList = [];
        for (let claim of claims) {
            const user = users.find(user => user.userId === claim.userId);
            claimList.push(user.name);
        }

        console.log("selected name: " + selectedName)
        console.log("claimList: ");
        console.log(claimList);
        // <Chip icon={<FaceIcon />} label="With Icon" variant="outlined" size="small" />
        return (
            <>
        {claimList.map((name, index) => (
            <Chip
                c 
                key={index}
                icon={<FaceIcon />}
                label={name}
                variant="outlined"
                size="small"
                sx={{
                    backgroundColor: selectedName === name ? 'rgba(78, 69, 255, 0.2)' : 'inherit',
                }}
            />
        ))}
    </>
        )
        
    }

    const handleEdit = (item) => {
        console.log("edit item button clicked in handleEdit")
        setEditItem(item);
        setShowEdit(true);
    };

    
    const addUserClaimToItem = (_id, userId, itemId) => {
        const payload = {
            "id":_id, "userId":userId,"itemId":itemId,"quantity":1
        }
        console.log("add user item payload: ")
        console.log(payload);
        axios.post(addUserUrl, payload).then(res => {
            console.log('-- ReceiptBreakdown.js|109 >> res', res);
            if (res.status == "200") {
                const id = res?.data?.receipt?._id;
                console.log("add user item success");
                console.log(res.data.receipt);
                //updateUserClaimsAndTotal();
                return true;
            }else{
                return false;
            }
        }).catch((err) => {
            console.log('-- ERR', err);
            return false;
        })
    }

    const removeUserClaimFromItem = (_id, userId, itemId) => {
        const payload = {
            "id":_id, "userId":userId,"itemId":itemId
        }
        console.log("add user item payload: ")
        console.log(payload);

        axios.post(removeUserUrl, payload).then(res => {
            console.log('-- ReceiptBreakdown.js|109 >> res', res);
            if (res.status == "200") {
                const id = res?.data?.receipt?._id;
                console.log("remove user item success");
                console.log(res.data.receipt);
                //updateUserClaimsAndTotal();
                return true;
            }else{
                return false;
            }
        }).catch((err) => {
            console.log('-- ERR', err);
            return false;
        })
    }

    const selectItem = () => {
        console.log("in selectItem");
        // item is selected with a name selection.
        if ( selectedName !== "") {
            console.log("in conditoinal")
            const tempItem = { ...item };
            

            console.log("selectedName: " + selectedName)
            
            let currentUser = users.find(user => user.name === selectedName);
            console.log("found current user");
            console.log(currentUser);
            console.log(item.claims);

            
  
            var tempIndex = item.claims.findIndex(claim => claim.userId === currentUser.userId);
            console.log("tempIndex: " + tempIndex);
            if (tempIndex > -1) {
                console.log("removing claim");
                let removeUserClaimFromItemSuccess = removeUserClaimFromItem(receiptId, currentUser.userId, tempItem.itemId)
                
                if(removeUserClaimFromItemSuccess){
                    alert("Failed to remove claim from item.");
                }

            } else {


                let addUserClaimToItemSuccess = addUserClaimToItem(receiptId, currentUser.userId, tempItem.itemId)
                
                if (addUserClaimToItemSuccess) {
                    alert("Failed to claim item.");
                }
                
            }

            return;
        }

    }

    return (
        <>
                    <EditModal
                    show={showEdit}
                    setShow={setShowEdit}
                    receiptId={receiptId}
                    item={editItem}
                 />

                    <ListItemButton
                    
                    onClick={() => selectItem()}
                    >
                               
                    <ListItemText
                        primary={ 
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: 'text.primary', display: 'inline' }}
                            >
                                {item.description}
                            </Typography>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: 'text.primary', display: 'inline' }}
                            >
                                {item.claims?.length ? 
                               getItemClaimedList(item.claims)
                                : null
                                }
                            </Typography>
                            </Box>
                        }
                        secondary={ 
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: 'text.primary', display: 'inline' }}
                            >
                                {item.price}
                            </Typography>
                           
                            </Box>
                        }
                    />
                    <IconButton edge="end" onClick={() => handleEdit(item)}>
                                    <EditIcon />
                                </IconButton>
                    </ListItemButton>
                    <Divider variant="middle" component="li" />

        </>
    )
}


export default ReceiptItem;