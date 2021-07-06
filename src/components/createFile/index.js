import React from 'react';
import useCore from '../../hooks/core';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCustomDialog } from '../../hooks/customDialog';

export default function LoaderForm(props) {

    const { core, proc, win, vfs, _ } = useCore();
    const [fileExtensions, handleCreateFile] = useCustomDialog(core, proc, win, vfs, props.action);

    const direction = document.getElementsByClassName('osjs-root')[0].getAttribute('data-dir') === 'rtl' ? 'rtl' : 'ltr';

    return (
        <div className='office_newFileArea'>
            <ul className={direction === 'ltr' ? 'office_ltr' : 'office_rtl'}>
                <li onClick={() => handleCreateFile(fileExtensions.document)}>
                    <span>{_('LBL_NEW_DOCUMENT')}</span>
                    <div>
                        <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
                    </div>
                </li>
                <li onClick={() => handleCreateFile(fileExtensions.presentation)}>
                    <span>{_('LBL_NEW_PRESENTATION')}</span>
                    <div>
                        <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
                    </div>
                </li>
                <li onClick={() => handleCreateFile(fileExtensions.spreedsheet)}>
                    <span>{_('LBL_NEW_SPREADSHEET')}</span>
                    <div>
                        <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
                    </div>
                </li>
            </ul>
        </div>
    );
}
