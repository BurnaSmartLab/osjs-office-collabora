import React, {useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import App from '../../index';
import LoaderForm from '../loaderForm';
import axios from 'axios';
import useCore from '../../hooks/core';
import {useCustomDialog} from '../../hooks/customDialog';
import './index.scss';
import { handlePostMessage } from '../../postMessages';
import CreateFile from '../createFile'
import BrowseFile from '../browseFile'

export default function Main(props) {
  const [filePath, setFilePath] = useState(props.data ? props.data: null);
  const {core, win, proc, basic, vfs} = useCore();
  const [fileExtensions, handleCreateFile] = useCustomDialog(core, proc, win, vfs, setFilePath);
  const [wopiUrl, setWopiUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const iframeRef = React.useRef();

  let tray= null ; 

  useEffect(() => {
    if (filePath) {
      win.focus();
      //TODO: make it full screen
      win.state.dimension = { width: 1000, height: 1000 }
      discover();
    }
  }, [filePath]);

  useEffect(() => {
     tray = core.make('osjs/tray').create({
        icon:proc.resource(proc.metadata.icon),
        title: proc.metadata.title.en_EN,
        onclick: ev => core.make('osjs/contextmenu').show({
          position: ev,
          menu: [
            {label: 'Show/ Hide', onclick: () => createWindow(true)},
            {label: 'Open File', onclick: () => {basic.createOpenDialog()}},
            {label: 'New Document File', onclick: () =>  {handleCreateFile(fileExtensions.document)}},
            {label: 'New Presentation File', onclick: () =>  {handleCreateFile(fileExtensions.presentation)}},
            {label: 'New Spreadsheet File', onclick: () => {handleCreateFile(fileExtensions.spreedsheet)}},
            {label: 'Quit', onclick: () => proc.destroy()},
          ]
        }),
    });
    
  proc.on('destroy', () => tray.destroy());
  proc.on('destroy', () => win.destroy());
  win.on('drop', (_, draggedData) => basic.open(draggedData));
  win.on('destroy', ()=>{
    tray.update({
      onclick: ev => core.make('osjs/contextmenu').show({
        position: ev,
        menu: [
          {label:'Show/ Hide', onclick: () => createWindow(true)},
          {label: 'Quit', onclick: () => proc.destroy()},
        ]
      }),
    })
  })
  }, []);

  useEffect(() => {
    if (loading) {
      window.addEventListener('message', (event) => { handlePostMessage(event, iframeRef) }, false); // Listening to messages from the web-Office iframe
    }
  }, [loading]);

  
const createWindow = (traybool = false)=> {
  const id = 'OfficeApplicationWindow';
  const exists = proc.windows.find(win => win.id === id);
  if (exists) {
    if (!exists.state.minimized && traybool === true) {
      exists.blur();
      exists.minimize();
    } else {
      exists.raise();
      exists.restore();
      exists.focus();
    }
    return exists;
  }
  tray.destroy();

   const win = proc.createWindow({
    id: 'OfficeApplicationWindow',
    title: proc.metadata.title.en_EN,
    icon: proc.resource(proc.metadata.icon),
    dimension: {width: 350, height: 400},
    position: {left: 700, top: 200},
    attributes: {
      sessionable: true
    }
  });
    win.render($content => ReactDOM.render(
      <App core={core} win={win} proc={proc} data={filePath} />,
    $content
    ));
    win.once('render', () => win.focus())
}

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
  }


  if (loading) {
    return (
      <div className='outerBox'>
        <div id='frameholder' className='frameholder'>
          <LoaderForm url={wopiUrl} token={accessToken} />
          <iframe ref={iframeRef} className='officeframe' title="Collabora Online Viewer" id="collabora-online-viewer" name="collabora-online-viewer" />
        </div>
      </div>
    )
  }

  return (
    <div className='officeContainer'>
      <div className='appContent'>
        <BrowseFile action={setFilePath} />
        <CreateFile action={setFilePath} />
      </div>
    </div>
  );
}
