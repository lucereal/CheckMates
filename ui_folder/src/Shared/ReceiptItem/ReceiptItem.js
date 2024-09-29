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
import { FaEllipsisV, FaEdit, FaTrash, FaPlus, FaUserPlus, FaShareSquare } from 'react-icons/fa';

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
    const deleteItemUrl = backendApiUrl + "/HandleReceipt/DeleteItem";
    const addUserUrl = backendApiUrl + "/HandleReceipt/AddUserItem";
    const removeUserUrl = backendApiUrl + "/HandleReceipt/RemoveUserItem";
    
    const getItemClaimedList = (claims) => {
        //use the userId in the claims to get a list of the names from the data.users array
        const claimList = [];
        for (let claim of claims) {
            const user = users.find(user => user.userId === claim.userId);
            claimList.push(user.name);
        }
        return claimList.join(", ");
    }

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

    const selectItem = (index, item) => {
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

            // Use item ID to grab that item from the array since they're just id's in chronological order
            // This is handy because we dont have to iterate.
            // if (tempData[tempItem.id] !== undefined)
            //     tempData[tempItem.id] = tempItem;

            // Get a temp data to modify it with the new additions.
            //const tempMainData = { ...itemData};
            //tempMainData.items = tempData;
            //setItemData(tempMainData);

            return;
        }

        //selectedRef.current = index;
        // setSelected(index);
    }

    return (
        <>
                       <EditModal
                    show={showEdit}
                    setShow={setShowEdit}
                    receiptId={receiptId}
                    item={editItem}
                />
          <Card key={index} className={'receipt-item' + (userSelectedItems?.includes(item.itemId) ? " highlight" : "")} onClick={() => selectItem(index, item)}>
                        <Card.Body id="receipt-item-card-body" className='d-flex justify-content-center'>
                            <Row className='d-flex w-100 h-100'>
                            <Col className='recipt-item-col-start col-10 col-sm-10 col-md-11'>
                                <Row className="item-top-row w-100">
                                    <Col className='item-name'>
                                        <span className='item-text-main'>
                                            {item.description}
                                        </span>
                                    </Col>
                                    <Col className='item-price text-end'>
                                        <span className='item-text-main'>
                                            ${item.price}
                                        </span>
                                    </Col>
                                </Row>
                                <Row className="item-bottom-row w-100">
                                   
                                    {item.claims?.length ? 
                                        <Col id='claimed-by' className="text-muted text-start">
                                            <i>{"Claimed by: " + getItemClaimedList(item.claims)}</i>
                                        </Col>
                                        : null
                                    }
                                </Row>
                            </Col>
                            <Col className='recipt-item-col-end col-2 col-sm-2 col-md-1'>
                                <Dropdown id='more-options-dropdown'  >
                                    <Dropdown.Toggle id="more-options-dropdown-toggle">
                                        <FaEllipsisV className='more-options-text' />
                                    </Dropdown.Toggle>
                
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleEdit(item)}>
                                            <FaEdit className='more-options-text' /> Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDelete(item.itemId)}>
                                            <FaTrash className='more-options-text'/> Delete
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            </Row>
                        </Card.Body>
                    </Card>
        </>
    )
}


export default ReceiptItem;