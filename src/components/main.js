import React, { useEffect, useState } from 'react';
import LoaderForm from './loaderForm'
import axios from 'axios';
import useCore from './../hooks/core';
import './main.scss';
import uploadfileImage from '../assets/files.png'

export default function Main(props) {
  const [filePath, setFilePath] = useState(props.data? props.data.path : null)
  const { win, proc , basic } = useCore();
  const [wopiUrl, setWopiUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading]= useState(false)

  useEffect(() => {
      if(filePath){
        win.focus();
        win.state.dimension = {width: 800 , height: 800}
        discover();
      } 
  },[filePath]);

  useEffect(() => {
    basic.on('open-file', selectedData => {
      setFilePath(selectedData.path);
    });
    win.on('drop', (_, draggedData) => basic.open(draggedData));
  },[])

  async function discover() {
    await axios.get(proc.resource('/discovery'), {
      params: {
        id: filePath
      }
    })
      .then(res => {
        const { url, token, fileId } = res.data;
        const locationOrigin = window.location.origin;
        const wopiSrc = `${locationOrigin}/wopi/files/${fileId}`;
        setAccessToken(token);
        setWopiUrl(`${url}WOPISrc=${wopiSrc}`);
        setLoading(true)
      })
      .catch(error => {
        console.log(error);
      })
  };

  if(loading){
    return(
      <div id='frameholder' className='frameholder'>
        <LoaderForm url={wopiUrl} token={accessToken} /> 
        <iframe className='officeframe' title="Collabora Online Viewer" id="collabora-online-viewer" name="collabora-online-viewer"/>
      </div>
    )
  }

  return (
  <div className='officeContainer'>
    <div className='appContent'>
      <div className='fileBrowseArea'>
          <img src={uploadfileImage}></img>
          <p>Drag and Drop files here!</p>
      </div>
      <button onClick={() => basic.createOpenDialog()}>BROWSE FILES</button>
    </div>
  </div>
  );
}
