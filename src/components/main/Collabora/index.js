import React from 'react';
import Iframe from './Iframe';
import ShareFileManager from './ShareAccessManager';

export default function Collabora({accessToken, wopiUrl}) {
  return (
    <ShareFileManager>
      {(ref) => <Iframe ref={ref} accessToken={accessToken} wopiUrl={wopiUrl} />}
    </ShareFileManager>
  );
}
