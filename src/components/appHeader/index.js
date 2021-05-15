import React, { useEffect, useState, useRef } from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faBars, faFileWord, faFilePowerpoint, faFileExcel, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import useCore from '../../hooks/core';


export default function AppHeader(props) {
    const { win } = useCore();
    const [isOpen, setIsOpen] = useState(false);
    const isOpenStateRef = React.useRef(isOpen);
    const rootRef = useRef();

    useEffect(() => {
        //TODO: use click event instead of focus 
        win.on('focus', () => handleDocumentClick())
    }, []);

    useEffect(() => {
        // just to make isOpen updated
    }, [isOpen]);

    function handleDocumentClick() {
        if (isOpenStateRef.current === true) {
            setIsOpen(false);
            isOpenStateRef.current = false;
        }
    }

    const menuToggle = e => {
        e.stopPropagation();
        const newIsOpenVal = !isOpen
        setIsOpen(newIsOpenVal)
        isOpenStateRef.current = newIsOpenVal
    }

    let menuStatus = isOpen ? 'isopen' : '';

    return (
        <div ref={rootRef}>
            <div className="menubar">
                <div className="hambclicker" onClick={menuToggle}>
                    <FontAwesomeIcon className='hambIcon' icon={isOpen ? faTimes : faBars} color='white' size='2x' />
                </div>
                <div id="hambmenu" className={menuStatus}></div>
                <div className="title">
                    <span>Office Application</span>
                </div>
            </div>
            <MenuLinks menuStatus={menuStatus} createAction={props.createAction} />
        </div>
    )
}

////////////////////////////////////////////////////////////////////////

function MenuLinks(props) {
    const { basic } = useCore();
    const menuItems = [{
        text: 'Open File',
        click: () => basic.createOpenDialog(),
        icon: faFolderOpen
    }, {
        text: 'New Document File',
        click: () => props.createAction('Document'),
        icon: faFileWord
    }, {
        text: 'New Presentation File',
        click: () => props.createAction('Presentation'),
        icon: faFilePowerpoint
    },
    {
        text: 'New Spreadsheet File',
        click: () => props.createAction('Spreadsheet'),
        icon: faFileExcel
    }];

    let links = menuItems.map((item, i) =>
        <li key={`li${i}`} onClick={item.click}>
            <i key={`i${i}`} aria-hidden="true" className={`fa ${item.icon}`}>
                <FontAwesomeIcon key={`fa${i}`} icon={item.icon} color='white' size='2x' />
            </i>
            <span key={`span${i}`}>{item.text}</span>
        </li>
    );

    return (
        <div className={props.menuStatus} id='menu'>
            <ul>
                {links}
            </ul>
        </div>
    )

}
