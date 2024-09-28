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
import { FaEllipsisV, FaEdit, FaTrash, FaPlus, FaUserPlus } from 'react-icons/fa';


/** IF ITEM ID IN THE RESPONSE STAYS IN AN ORDER, THEN THAT WILL KEEP THINGS EASY
 *  SINCE I DO NOT HAVE TO ITERATE THROUGH THINGS.
 * 
 * @param {*} props 
 * @returns 
 */
const ReceiptBreakdown = (props) => {
    const data = props.data;
    const setData = props.setData;
    const claimedTotal = getClaimedTotal(data.items, data.tip, data.tax);
    const selectedRef = useRef();

    const navigate = useNavigate();
    const [selected, setSelected] = useState(-1);
    const [selectedName, setSelectedName] = useState("");
    const [selectedNameId, setSelectedNameId] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [itemData, setItemData] = useState(data);
    const [showModal, setShowModal] = useState(false); // Summary modal
    const [showShare, setShowShare] = useState(false); // Share modal
    const [showEdit, setShowEdit] = useState(false); // Edit modal
    const [showAddItem, setShowAddItem] = useState(false); // Edit modal
    const [showAddUser, setShowAddUser] = useState(false); // Add User modal
    const [shareLoading, setShareLoading] = useState(false);
    const [receiptId, setReceiptId] = useState(getUrlId());
    const [connectionId, setConnectionId] = useState("");
    const [users, setUsers] = useState(data.users);
    const [showItemBreakdown, setShowItemBreakdown] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [userClaimedTotal, setUserClaimedTotal] = useState(0);
    const [userSelectedItems, setUserSelectedItems] = useState([]);

    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const chatHubUrl = backendApiUrl + "/chatHub";
    const addUserUrl = backendApiUrl + "/HandleReceipt/AddUserItem";
    const removeUserUrl = backendApiUrl + "/HandleReceipt/RemoveUserItem";
    const deleteItemUrl = backendApiUrl + "/HandleReceipt/DeleteItem";

    useEffect(() => {
        //everytime there is a change
        if(data !== null && data !== undefined){
            if(data.items !== null && data.items !== undefined && data.items.length > 0){
                setShowItemBreakdown(true);
            }
        }
    },[])

    useEffect(() => {
        if(selectedName !== "") {
            
            setUserClaimedTotal(getUserClaimedTotal(itemData.items, 
                itemData.users.find(user => user.name === selectedName))); 

            const userItems = itemData.items.filter(item => item.claims.find(claim => claim.userId === itemData.users.find(user => user.name === selectedName).userId));
            setUserSelectedItems(userItems.map(item => item.itemId));
        }
    },[selectedName])

    useEffect(() => {

        let connection = new signalR.HubConnectionBuilder()
        .withUrl(chatHubUrl)
        .build();

        setConnectionId(connection.connectionId);
        try{
            connection.start().then(() => {
                console.log("connection established");
                console.log("addUserConnectionId with receiptId: " + receiptId + " and connectionId: " + connection.connectionId );
                connection.invoke("AddUserConnectionId", receiptId);
            });
        }catch(e){
            console.log("exception in connection start");
            console.log(e);
        }
        
        try{
            connection.on("GroupReceiptUpdate", (receiptDto) => {
                console.log("receipt update received: " );
                console.log(receiptDto);
                setData(receiptDto);
                setItemData(receiptDto);
                ///setItemData(receiptDto);
                connection.invoke("GroupUpdateReceived", receiptDto._id, connection.connectionId)
            
            })
        }catch(e){
            console.log("exception in connection on groupReceiptUpdate");
            console.log(e);
        }

        

    }, [])


    const resetClaims = () => {
        const tempMainData = { ...itemData}

        for (let ind in tempMainData.items) {
            tempMainData.items[ind].claims = [];
        }

        setItemData(tempMainData);
    }

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
        // item is selected with a name selection.
        if (selectedRef.current === index && selectedName !== "") {
            const tempItem = { ...item };
            const tempData = [ ...itemData.items ];


            console.log("selectedName: " + selectedName)
            const tempMainData = { ...itemData}
            console.log(tempMainData.users);
            let currentUser = tempMainData.users.find(user => user.name === selectedName);
            console.log("found current user");
            console.log(currentUser);
            console.log(item.claims);
  
            var tempIndex = item.claims.findIndex(claim => claim.userId === currentUser.userId);
            console.log("tempIndex: " + tempIndex);
            if (tempIndex > -1) {
                console.log("removing claim");
                let removeUserClaimFromItemSuccess = removeUserClaimFromItem(tempMainData._id, currentUser.userId, tempItem.itemId)
                if(removeUserClaimFromItemSuccess){
                    alert("Failed to remove claim from item.");
                }

            } else {

                const payload = {
                    "id":tempMainData._id, "userId":currentUser.userId,"itemId":tempItem.itemId,"quantity":1
                }

                let addUserClaimToItemSuccess = addUserClaimToItem(tempMainData._id, currentUser.userId, tempItem.itemId)
                
                if (addUserClaimToItemSuccess) {
                    alert("Failed to claim item.");
                }
                
            }

            // Use item ID to grab that item from the array since they're just id's in chronological order
            // This is handy because we dont have to iterate.
            if (tempData[tempItem.id] !== undefined)
                tempData[tempItem.id] = tempItem;

            // Get a temp data to modify it with the new additions.
            //const tempMainData = { ...itemData};
            tempMainData.items = tempData;
            setItemData(tempMainData);

            return;
        }

        selectedRef.current = index;
        setSelected(index);
    }

    const handleAddNewItem = async () => {
        console.log("add item button clicked in handleAddNewItem")
        setShowAddItem(true);
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

    const handleAddUser = () => {
        console.log("add user button clicked in handleAddUser")
        setShowAddUser(true);
    }

    const receiptItems = () => {

        const tempMainData = { ...itemData}
        console.log("in receiptItems");
        console.log("itemData:");
        console.log(tempMainData)
        let currentUser = tempMainData.users.find(user => user.name === selectedName);
        console.log("selectedUser: " );
        console.log(currentUser);
        //setSelectedUser(currentUser);
        console.log("userSelectedItems: ");
        console.log(userSelectedItems);
        

        return (
            <>
                { itemData?.items?.map((item, index) => 
                
                (
                    <Card key={index} className={'receipt-item' + (selected === index ? " selected" : "") + (userSelectedItems?.includes(item.itemId) ? " highlight" : "")} onClick={() => selectItem(index, item)}>
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
                                    <Col id='tap-instruction'>
                                    <span className='item-text-instrucation text-muted'>
                                        { selectedName !== "" ? 
                                            (selected === index ?
                                            (item.claims.indexOf(selectedName) >= 0 ? 
                                            "Tap again to remove"
                                            : "Tap again to confirm")  
                                            : "Tap to claim")
                                            : "Select a name"
                                        }</span>
                                    </Col>
                                    {item.claims?.length ? 
                                        <Col id='claimed-by' className="text-muted text-end">
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
                ))}
             
                <EditModal
                    show={showEdit}
                    setShow={setShowEdit}
                    receiptId={receiptId}
                    item={editItem}
                />

            </>
        )

    }

    const getItemClaimedList = (claims) => {
        //use the userId in the claims to get a list of the names from the data.users array
        const tempMainData = { ...itemData}
        const claimList = [];

        for (let claim of claims) {
            const user = tempMainData.users.find(user => user.userId === claim.userId);
            claimList.push(user.name);
        }
        return claimList.join(", ");
    }

    const shareReceipt = () => {
        console.log("Share Receipt");
    }

    if (showItemBreakdown !== null && showItemBreakdown !== undefined && showItemBreakdown === true) {
        return(
            <>
            {/* <Navbar id='nav-container' bg="dark" data-bs-theme="dark" sticky="top" >
                    <Container>
                    <Navbar.Brand href="/">Receipt Buddy</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    </Container>

                </Navbar> */}


            <Container className='d-flex justify-content-center'>
                <SummaryModal 
                    show={showModal}
                    setShow={setShowModal}
                    total={data.total}
                    claimedTotal={claimedTotal}
                    data={data}
                    
                />
                <ShareModal 
                    show={showShare}
                    setShow={setShowShare}
                    receiptId={receiptId}
                />
    
                <AddNewItemModal
                    show={showAddItem}
                    setShow={setShowAddItem}
                    receiptId={receiptId}
                />

                <AddUserModal
                    show={showAddUser}
                    setShow={setShowAddUser}
                    receiptId={receiptId}
                />



                <Col id='receipt-grid' >
                
                    {/* <input
                        className='input-name'
                        onChange={(e) => inputChangeHandler(e)} 
                        placeholder='Enter your name'
                    /> */}

                <div className="summary-row mt-2 d-flex flex-wrap align-items-center">
                    <Row className="row-container">
                        <Col xs={3} md={3} className="d-flex justify-content-center ">
                        <span id='total-text' className="fw-bold">{"Total: $" + data.total.toFixed(2)}</span>
                        </Col>
                        <Col xs={3} md={3} className="d-flex justify-content-center ">
                        <span id='remaining-text' className="fw-bold">{"Total Claimed: $" + claimedTotal.toFixed(2)}</span>
                        </Col>
                        <Col xs={3} md={3} className="d-flex justify-content-center" >
                            <span id='user-total-text' className="fw-bold">{"User Total: $" + userClaimedTotal.toFixed(2)}</span>
                        </Col>
                    <Row className='row-container'>
                        <Col xs={6} md={4} className="mb-md-0">
                            <Row className='d-flex align-items-center'>
                                <Col className="col-7 col-sm-6">
                                    <NameToggles 
                                        selected={selectedName}
                                        setSelected={setSelectedName}
                                        names={data.users}
                                    />      
                                </Col>
                                    <Col className="col-5 col-sm-6">
                                        <Button id='add-user-button' onClick={() => handleAddUser()} >
                                            <FaUserPlus className='add-user-icon' />
                                        </Button>
                                    </Col> 
                                </Row>
                                                
                            </Col>
                            <Col xs={6} md={4} className="mb-md-0">
                                <Row>
                                <Col className="col-7 col-sm-6">
                                    <div className="d-flex justify-content-center align-items-center w-100">
                                        <Button id='summary-button' variant="success" onClick={() => setShowModal(true)}>
                                            Summary
                                        </Button>
                                    </div> 
                                </Col>
                                <Col className="col-5 col-sm-6">
                                    <div className="d-flex justify-content-center align-items-center w-100">
                                        
                                        <Button
                                            id="add-item-button"
                                            onClick={() => handleAddNewItem()}
                                            >
                                            <FaPlus />
                                        </Button>
                                    </div> 
                                </Col>
                                </Row>
                            </Col>
                    </Row>
                </Row>
                </div>

                    {receiptItems()}


                    <div className='bottom-row'>
                    {/* Only show this button if no ID exists in the url */}
                    <Button id='share-button' className='bottom-button' variant="primary" onClick={() => setShowShare(true)}>
                        { shareLoading ? 
                            <Spinner />
                        :
                            "Share"
                        }
                    </Button>
                    <Button id='reset-button' className='bottom-button' variant="danger" onClick={() => resetClaims()}>
                        Reset
                    </Button>
                </div>
                    {/* <div className='floating-button-row'>
                       
                        <Button
                            id="floating-add-button"
                            variant="primary"
                            className="floating-button"
                            onClick={() => handleAddNewItem()}
                            >
                            <FaPlus />
                        </Button>
                    </div> */}
                </Col>
                </Container>
                
            </>
        );
    }else{
        return(
            <>
            <Navbar id='nav-container' bg="dark" data-bs-theme="dark" sticky="top" >
                <Container>
                    <Navbar.Text id='error-id'>no items to show</Navbar.Text>
                    
                </Container>

            </Navbar>

          
            </>
        );
 
    }
    
}

export default ReceiptBreakdown;