import React from 'react';

const NameTags = (props) => {
    const {names, setNames} = props;

    const removeMe = (name) => {
        const temp = [...names];
        console.log('-- NameTags.js|7 >> names before', names);
        const index = temp.indexOf(name);
        if (index > -1) { // only splice array when item is found
            temp.splice(index, 1); // 2nd parameter means remove one item only
        }

        console.log('-- NameTags.js|14 >> new', temp);
        setNames(temp);
    }

    const createTags = () => {
        return names?.map((name, index) => {
            return (
                <span key={index} className='tag' onClick={() => removeMe(name)}>
                    {name}  
                    <span className='bolden'>
                        &nbsp;| x
                    </span>
                </span>
            )
        })
    }

    return (
        <div id='tags-container'>
            {createTags()}
        </div>
    );
}

export default NameTags;