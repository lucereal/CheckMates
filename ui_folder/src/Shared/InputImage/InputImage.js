import React from 'react';

const InputImage = (props) => {

    return(
        <div id="input-container" className="d-flex flex-column align-items-center justify-content-center"  >
            <button htmlFor="file-upload" id="file-upload-label">
                Upload Image
            </button>
            <input
            id="file-upload"
                type="file"
                name="myImage"
                className='d-none'
                onChange={(event) => {
                    props.setReceiptImg(event.target.files[0]);
                }}
            />
            {props.receiptImg && (
                <div className="mt-2">
                    <span className="text-muted">Selected file: {props.receiptImg.name}</span>
                </div>
            )}
        </div>
    );
}

export default InputImage;