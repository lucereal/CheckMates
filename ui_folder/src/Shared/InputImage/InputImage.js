import React from 'react';

const InputImage = () => {

    return(
        <div className='input-container'>
            <input
                type="file"
                name="myImage"
                onChange={(event) => {
                    console.log(event.target.files[0]);
                }}
            />
        </div>
    );
}

export default InputImage;