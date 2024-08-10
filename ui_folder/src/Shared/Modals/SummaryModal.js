import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { summarize } from '../HelperFunctions';

const SummaryModal = (props) => {
    const {show, setShow, total, claimedTotal, data} = props;
    const items = data.items;
    const users = data.users;

    const getClaimedItemData = (summary, currentUser) => {
        return summary[currentUser]?.claimedItems?.map((item, index) => {
            return (
                <div key={index} id={currentUser + '-item-' + index} className='item-row'>
                    <i>{item.name}</i>
                    { item.split === 1 ? 
                    <i>${item.price.toFixed(2)}</i> : 
                    <i>split by {item.split} - ${item.price.toFixed(2)}</i>
                    }
                </div>
            )
        })
    }

    const getUserRowSummary = () => {
        const summary = summarize(users, items, data.tip);
        return data?.users?.map((user, index) => {
            return (
                <div key={index} id='summary-row'>
                    <div id={"user-row-" + index} className='summary-top-row'>
                        <b>
                            {user.name}
                        </b>
                        <b>
                            ${summary[user.name].claimedTotal}
                        </b>
                    </div>
                    <div id='claimed-summary-container'>
                        { getClaimedItemData(summary, user.name) }
                        <div id='tip-row'>
                            <i>
                                Tip (split evenly)
                            </i>
                            <i>
                                ${summary[user.name].sharedTip}
                            </i>
                        </div>
                    </div>
                    <hr />
                </div>
            )
        })
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {getUserRowSummary()}
                <div id='final-row'>
                    <b>total: ${total.toFixed(2)}</b>
                    <b>Claimed Total: ${claimedTotal.toFixed(2)}</b>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
            </Modal.Footer>
      </Modal>
    );
}

export default SummaryModal;