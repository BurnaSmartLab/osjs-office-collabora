import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import LoaderForm from '../loaderForm';
import axios from 'axios';
import useCore from '../../hooks/core';
import { CoreProvider } from '../../hooks/core';
import './index.scss';
import uploadfileImage from '../../assets/files.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { handlePostMessage } from '../../postMessages';
import AppHeader from '../appHeader';
import CreateFile from '../createFile';

export default function Main(props) {
  const [filePath, setFilePath] = useState(props.data ? props.data.path : null)
  const { core, win, proc, basic } = useCore();
  const [wopiUrl, setWopiUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false)
  const iframeRef = React.useRef();

  useEffect(() => {
    if (filePath) {
      win.focus();
      //TODO: make it full screen
      win.state.dimension = { width: 1000, height: 1000 }
      // win.state.clamp=true;

      discover();
    }
  }, [filePath]);

  useEffect(() => {
    basic.on('open-file', selectedData => {
      setFilePath(selectedData.path);
    });
    win.on('drop', (_, draggedData) => basic.open(draggedData));
  }, []);

  useEffect(() => {
    if (loading) {
      // Listening to messages from the web-Office iframe
      window.addEventListener('message', (event) => { handlePostMessage(event, iframeRef) }, false);
    }
  }, [loading]);

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

  function handleCreateFile(fileType) {
    const createFileWindow = proc.createWindow({
      id: 'createFileWin',
      title: 'Create File',
      dimension: { width: 300, height: 250 },
      position: { left: 500, top: 500 }
    });
    createFileWindow.on('destroy', () => { });
    createFileWindow.render($content => {
      ReactDOM.render(
        <CoreProvider core={core} proc={proc} win={createFileWindow}>
          <CreateFile fileType={fileType} action={setFilePath} />
        </CoreProvider>
        , $content
      )
    });
  }

  const handleCreateAction = (filetype) => {
    handleCreateFile(filetype)
  }

  if (loading) {
    return (
      <div className='outerBox'>
        <AppHeader createAction={handleCreateAction} openAction={setFilePath} />
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
        <div className='fileBrowseArea'>
          <img src={uploadfileImage}></img>
          <p>Drag and Drop files here!</p>
          {/* <p>or</p> */}
          <button onClick={() => basic.createOpenDialog()}>browse</button>
        </div>
        <div className='newFileArea'>
          <ul>
            <li onClick={() => handleCreateFile('Document')}>
              <span>New Document</span>
              <div>
                <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
              </div>
            </li>
            <li onClick={() => handleCreateFile('Presentation')}>
              <span>New Presentation</span>
              <div>
                <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
              </div>
            </li>
            <li onClick={() => handleCreateFile('Spreadsheet')}>
              <span>New Spreadsheet</span>
              <div>
                <FontAwesomeIcon icon={faPlus} color='white' size='lg' />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
