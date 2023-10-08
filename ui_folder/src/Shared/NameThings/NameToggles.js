import React from 'react';

const NameToggles = (props) => {
    const {selected, setSelected, names } = props;
    
    const toggleMe = (name) => {
        console.log('-- NameToggles.js|8 >> name', name);
        setSelected(name);
    }

    const createButtons = () => {
        return names?.map((data, index) => {
            return (
                <span 
                    key={index} 
                    className={'toggle-button' + (selected === data.name ? ' selected' : "")}
                    onClick={() => toggleMe(data.name)}
                >
                    {data.name}
                </span>
            )
        })
    }

    return (
        <div className='name-buttons-container'>
            {createButtons()}
        </div>
    );
}

export default NameToggles;