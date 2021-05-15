import React, { useEffect, useState } from 'react';
import './index.scss';

import useCore from '../../hooks/core';


export default function CreateFile(props) {
  const [fileName, setFileName] = useState('');
  const [newFilePath, setNewFilePath] = useState('');
  const {basic, vfs, win} = useCore();

  useEffect(() => {
    basic.on('open-file', selectedData => {
      setNewFilePath(selectedData.path);
    });
  }, []);

  const handleNameChange = event =>{
    setFileName(event.target.value)
  };

  const handleFilePathChange = ()=>{
     basic.createOpenDialog({ filetype: 'directory' })
  }

  const handleOk = ()=>{
    // TODO: add touch to monster adapter
    // TODO: check for repetetive filename
    if(fileName!=='' && newFilePath!==''){
      let extension;
      switch(props.fileType) {
        case 'Presentation':
          extension='pptx'
          break;
        case 'Spreadsheet':
          extension='xlsx'
          break;    
        default:
          extension='docx'
      }
      //TODO: check promise of writefile (myMonster:/ is not available)
      vfs.writefile({path: `${newFilePath}/${fileName}.${extension}`},'')
      win.destroy()
      props.action(`${newFilePath}/${fileName}.${extension}`);
    }
  }

 

    return (
      <div className='createFileForm'>
       <div >
        <h2>Create New {props.fileType} File</h2>
          <input id="name" placeholder="File Name" type="text" value={fileName} onChange={handleNameChange}></input>
          <input id="filePath" placeholder="File Path" value={newFilePath} readOnly onClick={handleFilePathChange} ></input>
          <button onClick={handleOk}>OK</button>
      </div>
      </div>
    )
}