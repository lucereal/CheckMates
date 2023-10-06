import React, { useRef, useState } from 'react';

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
        <div className='participants-container'>
            <p className='participants-instruction'>Enter names of those sharing the receipt</p>
            <form onSubmit={(e) => submitHandler(e)}>
                <input
                    ref={inputRef}
                    className='participants-input' 
                    placeholder={'individual #' + (participantsNo + 1)}
                />
            </form>
        </div>
    );
}

export default InputNames;