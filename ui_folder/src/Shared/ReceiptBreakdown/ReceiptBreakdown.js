import React, { useState, useRef, useEffect } from 'react';
import { Button, Col, Row, Container, Card, Navbar, Spinner } from 'react-bootstrap';
import NameToggles from '../NameThings/NameToggles';
import { getClaimedTotal, getUrlId } from '../HelperFunctions';
import SummaryModal from '../Modals/SummaryModal';
import ShareModal from '../Modals/ShareModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr'

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
    const [shareLoading, setShareLoading] = useState(false);
    const [receiptId, setReceiptId] = useState(getUrlId());
    const [connectionId, setConnectionId] = useState("");
    const [users, setUsers] = useState(data.users);
    const [showItemBreakdown, setShowItemBreakdown] = useState(false);


    useEffect(() => {
        //everytime there is a change
        if(data !== null && data !== undefined){
            if(data.items !== null && data.items !== undefined && data.items.length > 0){
                setShowItemBreakdown(true);
            }
        }
    },[])

    useEffect(() => {
        const chatHubUrlDev = "https://receiptparserdevelop001.azurewebsites.net/chatHub";
        const chatHubUrlLocal = "http://localhost:5197/chatHub";
        let connection = new signalR.HubConnectionBuilder()
        .withUrl(chatHubUrlDev)
        //.withUrl("http://localhost:49965/chatHub")
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
        const addUserUrlDev = "https://receiptparserdevelop001.azurewebsites.net/HandleReceipt/AddUserItem";
        const addUserUrlLocal = "https://localhost:7196/HandleReceipt/AddUserItem";
        
        axios.post(addUserUrlDev, payload).then(res => {
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
        const removeUserUrlDev = "https://receiptparserdevelop001.azurewebsites.net/HandleReceipt/RemoveUserItem";
        const removeUserUrlLocal = "https://localhost:7196/HandleReceipt/RemoveUserItem";
        axios.post(removeUserUrlDev, payload).then(res => {
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
                //tempItem.claims.splice(tempIndex, 1); // 2nd parameter means remove one item only
                let removeUserClaimFromItemSuccess = removeUserClaimFromItem(tempMainData._id, currentUser.userId, tempItem.itemId)
                if(removeUserClaimFromItemSuccess){
                    alert("Failed to remove claim from item.");
                }

            } else {
                //tempItem.claims.push(selectedName.toString());
                //tempItem.claims.push(selectedName.toString());
                //const claimTemp = {userId:currentUser.userId, quantity:1};
                //tempItem.claims.push(claimTemp);
                const payload = {
                    "id":tempMainData._id, "userId":currentUser.userId,"itemId":tempItem.itemId,"quantity":1
                }
                //addUserClaimToItem(tempMainData._id, currentUser.userId, tempItem.itemId)

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

    const receiptItems = () => {

        const tempMainData = { ...itemData}
        console.log("in receiptItems");
        console.log("itemData:");
        console.log(tempMainData)
        let currentUser = tempMainData.users.find(user => user.name === selectedName);
        console.log("selectedUser: " );
        console.log(currentUser);
        //setSelectedUser(currentUser);


        return itemData?.items?.map((item, index) => {
            return (

                <Card key={index} className={'receipt-item mb-3' + (selected === index ? " selected" : "")} onClick={() => selectItem(index, item)}>
                    <Card.Body>
                            <Row className="top-row">
                                <Col className='item-name'>
                                    {item.description}
                                </Col>
                                <Col className='item-price text-end'>
                                    ${item.price}
                                </Col>
                            </Row>
                            <Row className="bottom-row mt-2">
                                <Col id='tap-instruction'>
                                    { selectedName !== "" ? 
                                        (selected === index ?
                                        (item.claims.indexOf(selectedName) >= 0 ? 
                                        "Tap again to remove"
                                        : "Tap again to confirm")  
                                        : "Tap to claim")
                                        : "Select a name"
                                    }
                                </Col>
                                {item.claims?.length ? 
                                    <Col id='claimed-by' className="text-muted">
                                        <i>{"Claimed by: " + getItemClaimedList(item.claims)}</i>
                                    </Col>
                                    : null
                                }
                            </Row>
                        </Card.Body>
                </Card>

            )
        })
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
    const createReceipt = () => {
        
        if (receiptId != "") {
            const id = getUrlId();
            setReceiptId(id);
            setShowShare(true);
            navigate("/?receiptId=" + id);
            return
        };

        //const url = "https://receiptparserservices20230928182301.azurewebsites.net/api/CreateReceipt?name=Functions";
        
        const url = "https://localhost:7196/HandleReceipt/CreateReceipt";
        
        setShareLoading(true);
        const payload = {
            "receipt": data,
            "id": data.receiptId
        }
        console.log("payload: " );
        console.log(payload);
        axios.post(url, payload).then(res => {
            console.log('-- ReceiptBreakdown.js|109 >> res', res);
            setShareLoading(false);
            setShowShare(true);
            if (res.status == "200") {
                const id = res?.data?.receipt?._id;
                setReceiptId(id);
                navigate("/?receiptId=" + id);
            }
        }).catch((err) => {
            console.log('-- ERR', err);
            setShareLoading(false);
        })
    }

    if (showItemBreakdown !== null && showItemBreakdown !== undefined && showItemBreakdown === true) {
        return(
            <>
            <Navbar id='nav-container' bg="dark" data-bs-theme="dark" sticky="top" >
                    <Container>
                    <Navbar.Brand href="/">Receipt Buddy</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    {/* <Navbar.Collapse className="justify-content-center"> */}
                    {/* <Navbar.Text id='Title'>Welcome To Receipt Buddy</Navbar.Text> */}
                    {/* <Navbar.Text>Signed in as: <a href="#login">Mark Otto</a></Navbar.Text> */}
                    {/* </Navbar.Collapse> */}
                    {/* <Navbar.Text className="justify-content-end" id='Title'>Welcome To Receipt Buddy</Navbar.Text> */}
                        {/* <Navbar.Text id='remaining-text'>Text 2</Navbar.Text> */}
                    </Container>
                    {/* <Button id='summary-button' variant="success">
                        Summary
                    </Button> */}
                </Navbar>
                {/* <Navbar id='nav-container' bg="dark" data-bs-theme="dark" sticky="top" >
                    <Container>
                        <Navbar.Text id='total-text'>{"Total: $" + data.total.toFixed(2)}</Navbar.Text>
                        <Navbar.Text id='remaining-text'>{"Claimed: $" + claimedTotal.toFixed(2)}</Navbar.Text>
                    </Container>
                    <Button id='summary-button' variant="success" onClick={() => setShowModal(true)}>
                        Summary
                    </Button>
                </Navbar> */}

<Container>
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
    
                <Col id='receipt-grid' className="m-2 p-2 bg-light border rounded">
                <h6 className="mt-4">Selecting for user</h6>
                    {/* make buttons to filter out selected ones or have all shown */}
                    <NameToggles 
                        selected={selectedName}
                        setSelected={setSelectedName}
                        names={data.users}
                    />
                    {/* <input
                        className='input-name'
                        onChange={(e) => inputChangeHandler(e)} 
                        placeholder='Enter your name'
                    /> */}

                <div className="summary-row mt-4 d-flex flex-wrap align-items-center">
                    <Row className="w-100">
                        <Col xs={12} md={4} className="mb-2 mb-md-0">
                            <span id='total-text' className="fw-bold">{"Total: $" + data.total.toFixed(2)}</span>
                        </Col>
                        <Col xs={12} md={4} className="mb-2 mb-md-0">
                            <span id='remaining-text' className="fw-bold">{"Claimed: $" + claimedTotal.toFixed(2)}</span>
                        </Col>
                        <Col xs={12} md={4} className="text-md-end">
                            <Button id='summary-button' variant="success" onClick={() => setShowModal(true)}>
                                Summary
                            </Button>
                        </Col>
                    </Row>
                </div>

                    {receiptItems()}
                    
                </Col>
                </Container>
                <div className='bottom-row'>
                    {/* Only show this button if no ID exists in the url */}
                    <Button id='share-button' className='bottom-button' variant="primary" onClick={() => shareReceipt()}>
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