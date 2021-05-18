import React, {useEffect } from 'react';
import uploadfileImage from '../../assets/files.png';
import useCore from '../../hooks/core';
import './index.scss'

export default function LoaderForm(props) {

    const {basic} = useCore();

    useEffect(() => {
        basic.on('open-file', selectedData => {
            props.action(selectedData.path);
          });
    });

    return (
        <div className='fileBrowseArea'>
            <img src={uploadfileImage}></img>
            <p>Drag and Drop files here!</p>
            <button onClick={() => basic.createOpenDialog()}>browse</button>
        </div>
    );
}
