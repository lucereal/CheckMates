import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const NameToggles = (props) => {
    const {selected, setSelected, names } = props;
    
    const toggleMe = (name) => {
        console.log('-- NameToggles.js|8 >> name', name);
        setSelected(name);
    }

    const createButtons = () => {
        return names?.map((data, index) => {
            return (
                <Button 
                    key={index} 
                    variant={selected === data.name ? 'primary' : 'outline-primary'}
                    className="toggle-button me-2 mb-2"
                    onClick={() => toggleMe(data.name)}
                >
                    {data.name}
                </Button>
            )
        })
    }

    return (
        <ButtonGroup className='name-buttons-container mb-3'>
            {createButtons()}
        </ButtonGroup>
    );
}

export default NameToggles;