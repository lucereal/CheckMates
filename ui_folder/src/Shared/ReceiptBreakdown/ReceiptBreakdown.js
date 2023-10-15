import React, { useState, useRef } from 'react';
import { Button, Col, Container, Navbar } from 'react-bootstrap';
import NameToggles from '../NameThings/NameToggles';
import { getClaimedTotal } from '../HelperFunctions';
import SummaryModal from '../Modals/SummaryModal';
import ShareModal from '../Modals/ShareModal';

/** IF ITEM ID IN THE RESPONSE STAYS IN AN ORDER, THEN THAT WILL KEEP THINGS EASY
 *  SINCE I DO NOT HAVE TO ITERATE THROUGH THINGS.
 * 
 * @param {*} props 
 * @returns 
 */
const ReceiptBreakdown = (props) => {
    const data = props.data;
    const claimedTotal = getClaimedTotal(data.items);
    const selectedRef = useRef();

    const [selected, setSelected] = useState(-1);
    const [selectedName, setSelectedName] = useState("");
    const [itemData, setItemData] = useState(data);
    const [showModal, setShowModal] = useState(false); // Summary modal
    const [showShare, setShowShare] = useState(false); // Share modal
    
    const resetClaims = () => {
        const tempMainData = { ...itemData}

        for (let ind in tempMainData.items) {
            tempMainData.items[ind].claims = [];
        }

        setItemData(tempMainData);
    }

    const selectItem = (index, item) => {
        // item is selected with a name selection.
        if (selectedRef.current === index && selectedName !== "") {
            const tempItem = { ...item };
            const tempData = [ ...itemData.items ];

            // If the user has already claimed this item, then remove it instead of pushing.
            var tempIndex = item.claims.indexOf(selectedName);
            if (tempIndex > -1) {
                tempItem.claims.splice(tempIndex, 1); // 2nd parameter means remove one item only
            } else {
                tempItem.claims.push(selectedName.toString());
            }

            // Use item ID to grab that item from the array since they're just id's in chronological order
            // This is handy because we dont have to iterate.
            if (tempData[tempItem.id] !== undefined)
                tempData[tempItem.id] = tempItem;

            // Get a temp data to modify it with the new additions.
            const tempMainData = { ...itemData};
            tempMainData.items = tempData;
            setItemData(tempMainData);
            return;
        }

        selectedRef.current = index;
        setSelected(index);
    }

    const receiptItems = () => {
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

    const createReceipt = () => {
        setShowShare(true);
        // axios.get().then(res => {
        //     console.log('-- ReceiptBreakdown.js|109 >> res', res);
        //     if (res) {
        //         setShowShare(true);
        //     }
        // }).catch((err) => {

        // })
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
                data={data}
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
                <Button id='share-button' className='bottom-button' variant="primary" onClick={() => createReceipt()}>
                    Share
                </Button>
                <Button id='reset-button' className='bottom-button' variant="danger" onClick={() => resetClaims()}>
                    Reset
                </Button>
            </div>
        </>
    );
}

export default ReceiptBreakdown;