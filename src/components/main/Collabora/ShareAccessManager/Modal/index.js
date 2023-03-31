import React, {useState} from 'react';
import useCore from '../../../../../hooks/core';

import './style.scss';

export default function Modal({onSubmit, onCancel}) {
  const {_} = useCore();

  function handleOnSubmit(e) {
    e.preventDefault();

    onSubmit(emails);
  }

  const [emails, setEmails] = useState('');

  return (
    <div className='ShareAccessManagerModal'>
      <div className='ShareAccessManagerModal__content'>
        <header className='ShareAccessManagerModal__header'>
          <h2 className='ShareAccessManagerModal__header-title'>
            {_('LBL_SHARING_MODAL_TITLE')}
          </h2>
        </header>
        <form onSubmit={handleOnSubmit}>
          <div className='ShareAccessManagerModal__form-field'>
            <label htmlFor="emails">
              {_('LBL_SHARING_MODAL_EMAIL_INPUT_LABEL')}
            </label>
            <input className='ShareAccessManagerModal__form-field-input' value={emails} onChange={(e)=>setEmails(e.target.value)} id="emails" />
          </div>

          <div className='ShareAccessManagerModal__form-actions'>
            <button className='ShareAccessManagerModal__form-action ShareAccessManagerModal__form-action--primary' type="submit">
              {_('LBL_SHARING_MODAL_SUBMIT_ACTION')}
            </button>
            <button className='ShareAccessManagerModal__form-action ShareAccessManagerModal__form-action--cancel' onClick={onCancel}>
              {_('LBL_SHARING_MODAL_CANCEL_ACTION')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
