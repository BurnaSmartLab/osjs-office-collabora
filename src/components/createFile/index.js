import React from 'react';
import useCore from '../../hooks/core';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {useCustomDialog} from '../../hooks/customDialog';

export default function LoaderForm(props) {

    const {core, proc, win, vfs } = useCore();
    const [fileExtensions, handleCreateFile] = useCustomDialog(core, proc, win, vfs, props.action);


    return (
        <div className='newFileArea'>
            <ul>
                <li onClick={() => handleCreateFile(fileExtensions.document)}>
                    <span>New Document</span>
                    <div>
                        <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
                    </div>
                </li>
                <li onClick={() => handleCreateFile(fileExtensions.presentation)}>
                    <span>New Presentation</span>
                    <div>
                        <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
                    </div>
                </li>
                <li onClick={() => handleCreateFile(fileExtensions.spreedsheet)}>
                    <span>New Spreadsheet</span>
                    <div>
                        <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
                    </div>
                </li>
            </ul>
        </div>);
}
