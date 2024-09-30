import React, { useState, useRef, useEffect } from 'react';
import { Button, Col, Row, Container, Navbar, Spinner } from 'react-bootstrap';
import NameToggles from '../NameThings/NameToggles';
import { getClaimedTotal, getUrlId, getUserClaimedTotal } from '../HelperFunctions';
import SummaryModal from '../Modals/SummaryModal';
import ShareModal from '../Modals/ShareModal';
import AddNewItemModal from '../Modals/AddNewItemModal';
import AddUserModal from '../Modals/AddUserModal';
import { FaPlus, FaUserPlus, FaShareSquare } from 'react-icons/fa';
import { useSignalR } from '../SignalRContext';
import { SignalRProvider } from '../SignalRContext';
import ReceiptItem from '../ReceiptItem/ReceiptItem';
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
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';

/** IF ITEM ID IN THE RESPONSE STAYS IN AN ORDER, THEN THAT WILL KEEP THINGS EASY
 *  SINCE I DO NOT HAVE TO ITERATE THROUGH THINGS.
 * 
 * @param {*} props 
 * @returns 
 */
const ReceiptBreakdown = (props) => {
    const data = props.data;
    const setData = props.setData;
    const hubUrl = props.chatHubUrl
    const claimedTotal = getClaimedTotal(data.items, data.tip, data.tax);

    const [selectedName, setSelectedName] = useState("");

    const [itemData, setItemData] = useState(data);
    const [showModal, setShowModal] = useState(false); // Summary modal
    const [showShare, setShowShare] = useState(false); // Share modal
    const [showAddItem, setShowAddItem] = useState(false); // Edit modal
    const [showAddUser, setShowAddUser] = useState(false); // Add User modal
    const [receiptId, setReceiptId] = useState(getUrlId());
    const [showItemBreakdown, setShowItemBreakdown] = useState(false);
    const [userClaimedTotal, setUserClaimedTotal] = useState(0);
    const [userSelectedItems, setUserSelectedItems] = useState([]);
    
    const connection = useSignalR();



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
            updateUserClaimsAndTotal();
           
        }
    },[selectedName,itemData])

    useEffect(() => {
        if (connection) {
            // Handle SignalR events here
            console.log("in connection use effect conditional")
            connection.on("GroupReceiptUpdate", (receiptDto) => {
                console.log("receipt update received: " );
                console.log(receiptDto);
                setData(receiptDto);
                setItemData(receiptDto);
                ///setItemData(receiptDto);
                //updateUserClaimsAndTotal();
                connection.invoke("GroupUpdateReceived", receiptDto._id, connection.connectionId)
            
            })
        }
    }, [connection]);


    const updateUserClaimsAndTotal = () => {
        setUserClaimedTotal(getUserClaimedTotal(itemData.items, 
            itemData.users.find(user => user.name === selectedName))); 

        const userItems = itemData.items.filter(item => item.claims.find(claim => claim.userId === itemData.users.find(user => user.name === selectedName).userId));
        setUserSelectedItems(userItems.map(item => item.itemId));
    }


    const handleAddNewItem = async () => {
        console.log("add item button clicked in handleAddNewItem")
        setShowAddItem(true);
    }
  

    const handleAddUser = () => {
        console.log("add user button clicked in handleAddUser")
        setShowAddUser(true);
    }

    const receiptItems = () => {

        return (
            <>

            {/* <List dense={dense}>
                {generate(
                    <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                        <FolderIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Single-line item"
                        secondary={secondary ? 'Secondary text' : null}
                    />
                    </ListItem>,
                )}
            </List> */}
                        <List id='reciept-list'>
                {
                    itemData?.items?.map((item, index) => 

                        (
                            <>
                             <ReceiptItem
                    item={item}
                    index={index}
                    users={itemData.users}
                    selectedName={selectedName}
                    userSelectedItems={userSelectedItems}
                    receiptId={itemData._id}>
                    </ReceiptItem>
                            {/* <ListItem>
                               
                    <ListItemText
                        primary="Single-line item"
                        secondary='Secondary text'
                    />
                    <IconButton edge="end" aria-label="delete">
                                  <MoreVertIcon />
                                </IconButton>
                    </ListItem>
                              <Divider variant="middle" component="li" /> */}
                              </>
                        ))
                }
            </List>

                {/* { itemData?.items?.map((item, index) => 
                
                (
                  <ReceiptItem
                    item={item}
                    index={index}
                    users={itemData.users}
                    selectedName={selectedName}
                    userSelectedItems={userSelectedItems}
                    receiptId={itemData._id}>
                    </ReceiptItem>
                ))} */}
             
               

            </>
        )

    }


    const handleShare = async () => {
        if (navigator.share) {
            const linkToShare = window.location.origin + "/input/?receiptId=" + receiptId;
            
            try {
                await navigator.share({
                    title: 'Tabman Receipt Share',
                    text: "Let's split this receipt!",
                    url: linkToShare,
                });
                console.log('Content shared successfully');
            } catch (error) {
                console.error('Error sharing content:', error);
            }
        } else {
            console.log('Web Share API is not supported in this browser.');
        }
    }


    if (showItemBreakdown !== null && showItemBreakdown !== undefined && showItemBreakdown === true) {
        return(
            <>
            <Navbar id='nav-container' bg="dark" data-bs-theme="dark" sticky="top" >
                    <Container>
                    <Navbar.Brand  href="/">Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end">
                            <Button variant="outline-light" onClick={() => handleShare()}>
                                <FaShareSquare />
                            </Button>
                        </Navbar.Collapse>
                    </Container>

                </Navbar>


            <Container className='d-flex justify-content-center flex-column'>
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
                <Row className="summary-row">
               
                    
                        <Col xs={3} md={3} className="d-flex justify-content-center ">
                        <span id='total-text' className="fw-bold">{"Total: $" + data.total.toFixed(2)}</span>
                        </Col>
                        <Col xs={3} md={3} className="d-flex justify-content-center ">
                        <span id='remaining-text' className="fw-bold">{"Total Claimed: $" + claimedTotal.toFixed(2)}</span>
                        </Col>
                        <Col xs={3} md={3} className="d-flex justify-content-center" >
                            <span id='user-total-text' className="fw-bold">{"User Total: $" + userClaimedTotal.toFixed(2)}</span>
                        </Col>
                    
                
                
                </Row>

                <Row id='receipt-grid-row'>
                <Col id='receipt-grid' >
                
                    {receiptItems()}

                </Col>
                </Row>

                </Container>
                <Container id="bottom-row-container" className='d-flex justify-content-center flex-column'>
                <Row className="bottom-row">    
                            <Col xs={3} md={3} className="bottom-row-col">
                                <Row className='bottom-row-col-row'>
                                    
                                        <NameToggles 
                                                selected={selectedName}
                                                setSelected={setSelectedName}
                                                names={data.users}
                                            /> 
                                           
                                </Row>
                            </Col>
                            <Col xs={3} md={3} className="bottom-row-col">
                                <Row className='bottom-row-col-row'>
                                   
                           
                                                <Button id='add-user-button' onClick={() => handleAddUser()} >
                                                    <FaUserPlus className='add-user-icon' />
                                                </Button>
                                   
                                </Row>
                            </Col>
                            <Col xs={3} md={3} className="bottom-row-col">
                                <Row className='bottom-row-col-row'>
                                        
                                                <Button id='summary-button' variant="success" onClick={() => setShowModal(true)}>
                                                    Summary
                                                </Button>
                                            
                                     
                                        </Row>
                                    </Col>
                                <Col xs={3} md={3} className="bottom-row-col">
                                    <Row className='bottom-row-col-row'>
                                    
                                                
                                                <Button
                                                    id="add-item-button"
                                                    onClick={() => handleAddNewItem()}
                                                    >
                                                    <FaPlus />
                                                </Button>
                                       
                                    </Row>
                                </Col>
                </Row>
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

//export default ReceiptBreakdown;
const ReceiptBreakdownWrapper = (props) => {
    return (
        <SignalRProvider chatHubUrl={props.chatHubUrl} receiptId={props.receiptId}>
            <ReceiptBreakdown 
            data={props.data}
            setData={props.setData}
            chatHubUrl={props.chatHubUrl} />
        </SignalRProvider>
    );
};
export default ReceiptBreakdownWrapper;

