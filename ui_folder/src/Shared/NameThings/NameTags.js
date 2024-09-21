import React from 'react';

const NameTags = (props) => {
    const {names, setNames} = props;

    const removeMe = (name) => {
        const temp = [...names];
        const index = temp.indexOf(name);
        if (index > -1) { // only splice array when item is found
            temp.splice(index, 1); // 2nd parameter means remove one item only
        }

        setNames(temp);
    }

    const createTags = () => {
        return names?.map((name, index) => {
            return (
                <span key={index} className='tag badge bg-secondary me-w mb-2' onClick={() => removeMe(name)}>
                    {name}  
                    <span className='bolden'>
                        &nbsp;| x
                    </span>
                </span>
            )
        })
    }

    return (
        <div id='tags-container' className="d-flex flex-wrap">
            {createTags()}
        </div>
    );
}

export default NameTags;