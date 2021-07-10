import React, {useEffect} from 'react';
import uploadfileImage from '../../assets/files.png';
import useCore from '../../hooks/core';
import './index.scss';

export default function LoaderForm(props) {
  const {basic, _} = useCore();

  useEffect(() => {
    basic.on('open-file', (selectedData) => {
      props.action(selectedData.path);
    });
  });

  return (
    <div className="office_fileBrowseArea">
      <img src={uploadfileImage}></img>
      <p>{_('LBL_DRAGDROP')}</p>
      <button onClick={() => basic.createOpenDialog()}>
        {_('LBL_BROWSE')}
      </button>
    </div>
  );
}
