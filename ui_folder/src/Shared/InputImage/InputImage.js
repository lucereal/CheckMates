import React from 'react';

const InputImage = (props) => {

    return(
        <div className='input-container'>
            <input
                type="file"
                name="myImage"
                onChange={(event) => {
                    props.setReceiptImg(event.target.files[0]);
                }}
            />
        </div>
    );
}

export default InputImage;