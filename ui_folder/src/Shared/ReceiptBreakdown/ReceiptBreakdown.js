import React, { useState, useRef } from 'react';
import { Col } from 'react-bootstrap';
import NameToggles from '../NameThings/NameToggles';

function parseData (data) {
    if (!data?.length) return;

    const temp = {};
    for (let item of data) {
        console.log('-- ReceiptBreakdown.js|7 >> data', item);
        // claimed by to be used for multiple people. Split price by size of it and add it to those in the array.
        // instead of adding the entire total to just one person. Allows us to split an item by multiple people.
        temp[item.description] = item;
    }

    console.log('-- ReceiptBreakdown.js|15 >> temp', temp);
    return temp;
}
/** IF ITEM ID IN THE RESPONSE STAYS IN AN ORDER, THEN THAT WILL KEEP THINGS EASY
 *  SINCE I DO NOT HAVE TO ITERATE THROUGH THINGS.
 * 
 * @param {*} props 
 * @returns 
 */
const ReceiptBreakdown = (props) => {
    // const [userName, setUserName] = useState("");
    const [selected, setSelected] = useState(-1);
    const [selectedName, setSelectedName] = useState("");
    const [itemData, setItemData] = useState(props.data);
    const selectedRef = useRef();

    // const inputChangeHandler = (evt) => {
    //     setUserName(evt.target.value);
    // }

    const selectItem = (index, item) => {
        // if (!userName) return;

        // item is selected with a name selection.
        if (selectedRef.current === index && selectedName !== "") {
            const tempItem = { ...item };
            const tempData = [ ...itemData.items ];
            tempItem.claims.push(selectedName.toString());

            // Use item ID to grab that item from the array since they're just id's in chronological order
            // This is handy because we dont have to iterate.
            tempData[tempItem.id] = tempItem;

            // Get a temp data to modify it with the new additions.
            const tempMainData = { ...itemData};
            tempMainData.items = tempData;
            setItemData(tempMainData);
            return;
        }

        selectedRef.current = index;
        setSelected(index);
        console.log("-- ITEM: ", item);
    }

    const receiptItems = () => {
        return itemData.items?.map((item, index) => {
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
                            {/* Let the user know to select a name if they haven't, otherwise continue. */}
                            { selectedName !== "" ? 
                                (selected === index ?
                                "Tap again to confirm"  :
                                "Tap to claim")
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

    return(
        <Col id='receipt-grid'>
            {/* make buttons to filter out selected ones or have all shown */}
            <NameToggles 
                selected={selectedName}
                setSelected={setSelectedName}
                names={props.data.users}
            />
            {/* <input
                className='input-name'
                onChange={(e) => inputChangeHandler(e)} 
                placeholder='Enter your name'
            /> */}
            {receiptItems()}
        </Col>
    );
}

export default ReceiptBreakdown;