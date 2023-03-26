import React, {useEffect, useRef, useState} from 'react';
import Modal from './Modal';

import './style.scss';
import share from './assets/share.png';
import endShare from './assets/end.png';
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
        'BookmarkText': {
          'type': 'string',
          'value': ''
        }
      }
    }
  };
}

export default function ShareFileManager({children}) {
  const {_} = useCore();
  const iframeRef = useRef(null);
  const [hasSharingStarted, setHasSharingStarted] = useState(false);
  const [shouldShowSharingModal, setShouldShowSharingModal] = useState(false);
  const currentSharingId = useRef(null);

  useEffect(() => {
    collaboraIframeHandler.onReady(()=>{
      collaboraIframeHandler.postMessage(iframeRef.current, {'MessageId': 'Insert_Button',
        'Values': {'id': 'startSharing', 'imgurl': share, 'hint': '', 'mobile': false, 'label': _('LBL_SHARING_START_SHARING_BUTTON'), 'insertBefore': 'Save'}
      });
      collaboraIframeHandler.postMessage(iframeRef.current, {'MessageId': 'Insert_Button',
        'Values': {'id': 'endSharing', 'imgurl': endShare, 'hint': '', 'mobile': false, 'label': _('LBL_SHARING_END_SHARING_BUTTON'), 'insertBefore': 'Save'}
      });
    });

    collaboraIframeHandler.onMessage((msg)=>{
      if(msg.MessageId === 'Clicked_Button' && msg.Values?.Id === 'startSharing') {
        if(hasSharingStarted) {
          alert(_('LBL_SHARING_START_SHARING_ERROR'));
          return;
        }

        startSharing();
        return;
      }

      if(msg.MessageId === 'Clicked_Button' && msg.Values?.Id === 'endSharing') {
        if(!hasSharingStarted) {
          alert(_('LBL_SHARING_END_SHARING_ERROR'));
          return;
        }

        const postMessageContent = getPostMessageContent(`END_${currentSharingId.current}`);
        collaboraIframeHandler.postMessage(iframeRef.current, postMessageContent);

        endSharing();
      }
    });
  }, []);

  function startSharing() {
    setHasSharingStarted(true);
    setShouldShowSharingModal(true);
    currentSharingId.current = Math.random().toString(36).substring(2, 12);
  }

  function endSharing() {
    setHasSharingStarted(false);

    currentSharingId.current = null;
  }

  function handleModalCancel() {
    setShouldShowSharingModal(false);

    endSharing();
  }

  function handleModalSubmit(emails) {
    setShouldShowSharingModal(false);

    const postMessageContent = getPostMessageContent(`START_${currentSharingId.current}_${emails}`);
    collaboraIframeHandler.postMessage(iframeRef.current, postMessageContent);

    endSharing();
  }

  const modalContent = shouldShowSharingModal ? <Modal onSubmit={handleModalSubmit} onCancel={handleModalCancel} /> : null;

  return <div className="ShareAccessManager">
    {modalContent}
    {children(iframeRef)}
  </div>;
}
