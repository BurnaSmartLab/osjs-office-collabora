import React, {forwardRef, useEffect} from 'react';
import collaboraIframeHandler from '../shared/collaboraIframeHandler';
import LoaderForm from './LoaderForm';

// eslint-disable-next-line react/display-name
export default forwardRef(({wopiUrl, accessToken}, ref) => {
  useEffect(() => {
    collaboraIframeHandler.initialize(ref.current);
  }, []);

  return (
    <div className="office_outerBox">
      <div id="frameholder" className="office_frameholder">
        <LoaderForm url={wopiUrl} token={accessToken} />
        <iframe
          ref={ref}
          title="Collabora Online Viewer"
          id="collabora-online-viewer"
          name="collabora-online-viewer"
        />
      </div>
    </div>
  );
});
