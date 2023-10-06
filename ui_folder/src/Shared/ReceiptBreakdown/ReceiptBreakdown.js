import React, { useState, useRef } from 'react';
import { Col } from 'react-bootstrap';

const ReceiptBreakdown = (props) => {
    // const [userName, setUserName] = useState("");
    const [selected, setSelected] = useState(-1);
    const selectedRef = useRef();

    // const inputChangeHandler = (evt) => {
    //     setUserName(evt.target.value);
    // }

    const selectItem = (index, item) => {
        // if (!userName) return;
        if (selectedRef.current === index) {
            // submit it!
            console.log("SUBMIT!");
            return;
        }

        selectedRef.current = index;
        setSelected(index);
        console.log("-- ITEM: ", item);
    }

    const receiptItems = () => {
        return props.data?.items?.map((item, index) => {
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
                        <span>
                            { selectedRef.current === index ?
                                "Tap again to confirm"  :
                                "Tap to claim"
                            }
                        </span>
                    </div>
                </div>
            )
        })
    }

    return(
        <Col id='receipt-grid'>
            {/* make buttons to filter out selected ones or have all shown */}
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