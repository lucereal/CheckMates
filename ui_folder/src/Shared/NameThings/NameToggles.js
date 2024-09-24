import React from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

const NameToggles = (props) => {
    const {selected, setSelected, names } = props;
    
    const toggleMe = (name) => {
        console.log('-- NameToggles.js|8 >> name', name);
        setSelected(name);
    }

    const createButtons = () => {
        return names?.map((data, index) => {
            return (
                // <Button 
                //     key={index} 
                //     variant={selected === data.name ? 'primary' : 'outline-primary'}
                //     className={'toggle-button me-2 mb-2 ' + (selected === data.name ? ' selected' : '')}
                //     onClick={() => toggleMe(data.name)}
                // >
                //     {data.name}
                // </Button>
                <Dropdown.Item 
                key={index} 
                active={selected === data.name}
                onClick={() => toggleMe(data.name)}
            >
                {data.name}
            </Dropdown.Item>

            )
        })
    }

    return (
        // <ButtonGroup className='name-buttons-container mb-3'>
        //     {createButtons()}
        // </ButtonGroup>
        <div  className="d-flex justify-content-center align-items-center w-100 ">
            <DropdownButton 
                id="name-dropdown" 
                title={selected || "Name"} 
                className='name-dropdown-container mb-3 w-100'>
                {createButtons()}
            </DropdownButton>
        </div>
    );
}

export default NameToggles;