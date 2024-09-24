import React, { useRef, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const InputNames = (props) => {
    const { participantsNo, participants, setParticipants } = props;
    const inputRef = useRef();

    const submitHandler = (e) => {
        e.preventDefault();

        const temp = participants;
        temp.push(inputRef.current.value);
        setParticipants([...temp]);

        // Now do this to clear the input field
        inputRef.current.value = "";
        console.log('-- InputNames.js|11 >> ', );
    }

    return (
        <div className='participants-container '>
            <h6 className='participants-instruction'>Enter names of those sharing the receipt</h6>
            <Form onSubmit={(e) => submitHandler(e)} className="d-flex mt-3 align-items-center justify-content-center">
            <Row className="justify-content-center w-100">
                    <Col xs={12} sm={10} md={8} lg={6} xl={4} className="d-flex align-items-center w-100"> 
                        <Form.Control
                            ref={inputRef}
                            id="input-names-input"
                            className='me-2' 
                            placeholder={'Individual #' + (participantsNo + 1)}
                        />
                         <Button type="submit" id="input-names-btn" className="btn btn-primary">Add</Button>
                    </Col>
                
                </Row>
            </Form>
        </div>
    );
}

export default InputNames;