import React, { useState, useRef } from 'react';
import { Button, Col, Container, Navbar, Spinner } from 'react-bootstrap';
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
    

    let connectionId = "";
    let connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5197/chatHub")
        //.withUrl("http://localhost:49965/chatHub")
        .build();

    connection.start().then(() => {
        // Connection to the hub is established
        console.log("connection established");
        let user = "david";
        //connection.invoke("AddUser", user, "message");

        const tempMainData = { ...itemData}
        let currentUser = tempMainData.users[0]
        //connection.invoke("AddUserConnectionId", "66cb60abdb69f7b5c245ae64", "v0QLohJH");
        console.log("addUserConnectionId with receiptId: " + receiptId + " and userId: " + currentUser.userId);
        connection.invoke("AddUserConnectionId", receiptId, currentUser.userId);
    });

    connection.on("GroupReceiptUpdate", (receiptDto) => {
        console.log("receipt updated: " );
        console.log(receiptDto);
        connection.invoke("GroupUpdateReceived", receiptDto._id, connection.connectionId)
    
    })

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
        axios.post("https://localhost:7196/HandleReceipt/AddUserItem", payload).then(res => {
            console.log('-- ReceiptBreakdown.js|109 >> res', res);
            
            
            if (res.status == "200") {
                const id = res?.data?.receipt?._id;
                console.log("add user item success");
                console.log(res.data.receipt);
                
            }
        }).catch((err) => {
            console.log('-- ERR', err);
            
        })
    }

    const removeUserClaimFromItem = (_id, userId, itemId) => {
        const payload = {
            "id":_id, "userId":userId,"itemId":itemId
        }
        console.log("add user item payload: ")
        console.log(payload);
        axios.post("https://localhost:7196/HandleReceipt/RemoveUserItem", payload).then(res => {
            console.log('-- ReceiptBreakdown.js|109 >> res', res);
            if (res.status == "200") {
                const id = res?.data?.receipt?._id;
                console.log("remove user item success");
                console.log(res.data.receipt);
            }
        }).catch((err) => {
            console.log('-- ERR', err);
            
        })
    }
    
    const selectItem = (index, item) => {
        // item is selected with a name selection.
        if (selectedRef.current === index && selectedName !== "") {
            const tempItem = { ...item };
            const tempData = [ ...itemData.items ];


            console.log("selectedName: " + selectedName)
            const tempMainData = { ...itemData}
            let currentUser = tempMainData.users.find(user => user.name === selectedName);

            // If the user has already claimed this item, then remove it instead of pushing.
            var tempIndex = item.claims.indexOf(selectedName);
            if (tempIndex > -1) {
                tempItem.claims.splice(tempIndex, 1); // 2nd parameter means remove one item only
                removeUserClaimFromItem(tempMainData._id, currentUser.userId, tempItem.itemId)

            } else {
                tempItem.claims.push(selectedName.toString());
                const payload = {
                    "id":tempMainData._id, "userId":currentUser.userId,"itemId":tempItem.itemId,"quantity":1
                }
                addUserClaimToItem(tempMainData._id, currentUser.userId, tempItem.itemId)

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
                <div 
                    key={index}
                    id={'placement-' + index } 
                    className={'receipt-item' + (selected === index ? " selected" : "")}
                    onClick={() => selectItem(index, item)}
                >
                    <div className='top-row'>
                        <span className='item-name'>
                            {item.description}
                        </span>
                        <span className='item-price'>
                            ${item.price}
                        </span>
                    </div>
                    <div className='bottom-row'>
                        <span id='tap-instruction'>
                            {/* Let the user know to select a name if they haven't, otherwise check if they have claimed yet. */}
                            { selectedName !== "" ? 
                                (selected === index ?
                                (item.claims.indexOf(selectedName) >= 0 ? 
                                "Tap again to remove"
                                : "Tap again to confirm")  
                                : "Tap to claim")
                                : "Select a name"
                            }
                        </span>
                        {
                            item.claims?.length ? 
                            <span id='claimed-by'>
                                <i>{"Claimed by: " + item.claims.join(', ')}</i>
                            </span>
                            : null
                        }
                    </div>
                </div>
            )
        })
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

    return(
        <>
            <Navbar id='nav-container' bg="dark" data-bs-theme="dark" sticky="top" >
                <Container>
                    <Navbar.Text id='total-text'>{"Total: $" + data.total.toFixed(2)}</Navbar.Text>
                    <Navbar.Text id='remaining-text'>{"Claimed: $" + claimedTotal.toFixed(2)}</Navbar.Text>
                </Container>
                <Button id='summary-button' variant="success" onClick={() => setShowModal(true)}>
                    Summary
                </Button>
            </Navbar>
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

            <Col id='receipt-grid'>
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
                {receiptItems()}
            </Col>
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
}

export default ReceiptBreakdown;