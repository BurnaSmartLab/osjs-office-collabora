import React, {useEffect, useRef, useState} from 'react';
import Modal from './Modal';

import './style.scss';
import share from './assets/share.png';
import useCore from '../../../../hooks/core';
import collaboraIframeHandler from '../shared/collaboraIframeHandler';


function getPostMessageContent(sharingValue) {
  const SHARE_PREFIX = 'SHARE_PREF_';
  const UNO_COMMAND = '.uno:InsertBookmark';

  return {'MessageId': 'Send_UNO_Command',
    'Values': {
      'command': UNO_COMMAND,
      'args': {
        'Bookmark': {
          'type': 'string',
          'value': `${SHARE_PREFIX}${sharingValue}`
        },
      }
    }
  };
}

export default function ShareFileManager({children}) {
  const {_} = useCore();
  const iframeRef = useRef(null);
  const [shouldShowSharingModal, setShouldShowSharingModal] = useState(false);

  useEffect(() => {
    collaboraIframeHandler.onReady(()=>{
      collaboraIframeHandler.postMessage(iframeRef.current, {'MessageId': 'Insert_Button',
        'Values': {'id': 'startSharing', 'imgurl': share, 'hint': '', 'mobile': false, 'label': _('LBL_SHARING_BUTTON'), 'insertBefore': 'Save'}
      });
    });

    collaboraIframeHandler.onMessage((msg)=>{
      if(msg.MessageId === 'Clicked_Button' && msg.Values?.Id === 'startSharing') {
        setShouldShowSharingModal(true);
      }
    });
  }, []);

  function handleModalCancel() {
    setShouldShowSharingModal(false);
  }

  function handleModalSubmit(emails) {
    setShouldShowSharingModal(false);

    const postMessageContent = getPostMessageContent(`[${emails}]`);
    collaboraIframeHandler.postMessage(iframeRef.current, postMessageContent);
  }

  const modalContent = shouldShowSharingModal ? <Modal onSubmit={handleModalSubmit} onCancel={handleModalCancel} /> : null;

  return <div className="ShareAccessManager">
    {modalContent}
    {children(iframeRef)}
  </div>;
}
