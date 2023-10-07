import React, { useState } from 'react';

const NameToggles = (props) => {
    const {selected, setSelected, names } = props;
    
    const toggleMe = (name) => {
        console.log('-- NameToggles.js|8 >> name', name);
        setSelected(name);
    }

    const createButtons = () => {
        return names?.map((name, index) => {
            return (
                <span 
                    key={index} 
                    className={'toggle-button' + (selected === name ? ' selected' : "")}
                    onClick={() => toggleMe(name)}
                >
                    {name}
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