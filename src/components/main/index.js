import React, {useEffect, useState} from 'react';
import LoaderForm from '../loaderForm';
import axios from 'axios';
import useCore from '../../hooks/core';
import {useCustomDialog} from '../../hooks/customDialog';
import './index.scss';
import CreateFile from '../createFile';
import BrowseFile from '../browseFile';

export default function Main(props) {
  const [filePath, setFilePath] = useState(props.data ? props.data.path : null);
  const {core, win, proc, basic, vfs, _} = useCore();
  const [fileExtensions, handleCreateFile] = useCustomDialog(
    core,
    proc,
    win,
    vfs,
    setFilePath
  );
  const [wopiUrl, setWopiUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const iframeRef = React.useRef();

  let tray = null;

  useEffect(() => {
    if (filePath) {
      win.focus();
      win.maximize();
      discover();
    }
  }, [filePath]);

  useEffect(() => {
    if (props.data) {
      setWinTitleSuffixed(props.data.filename);
    }
  }, [props.data]);

  useEffect(() => {
    tray = core.make('osjs/tray').create({
      icon: proc.resource(proc.metadata.icon),
      title: core.make('osjs/locale').translatableFlat(proc.metadata.title),
      onclick: (ev) =>
        core.make('osjs/contextmenu').show({
          position: ev,
          menu: [
            {label: _('LBL_SHOW_HIDE'), onclick: () => createWindow()},
            {
              label: _('LBL_OPEN_FILE'),
              onclick: () => {
                basic.createOpenDialog();
              },
            },
            {
              label: _('LBL_NEW_DOCUMENT'),
              onclick: () => {
                handleCreateFile(fileExtensions.document);
              },
            },
            {
              label: _('LBL_NEW_PRESENTATION'),
              onclick: () => {
                handleCreateFile(fileExtensions.presentation);
              },
            },
            {
              label: _('LBL_NEW_SPREADSHEET'),
              onclick: () => {
                handleCreateFile(fileExtensions.spreedsheet);
              },
            },
            {label: _('LBL_QUIT'), onclick: () => proc.destroy()},
          ],
        }),
    });

    win.on('drop', (_, draggedData) => basic.open(draggedData));
    proc.on('attention', (args) => {
      setFilePath(args.file.path);
      setWinTitleSuffixed(args.file.filename);
    });
    win.on('destroy', () => proc.destroy());
    proc.on('destroy', () => tray.destroy());
  }, []);

  const setWinTitleSuffixed = (suffix) => {
    const prefix = core
      .make('osjs/locale')
      .translatableFlat(proc.metadata.title);
    suffix ? win.setTitle(`${prefix} - ${suffix}`) : prefix;
  };

  const createWindow = () => {
    const id = 'OfficeApplicationWindow';
    const appWin = proc.windows.find((wnd) => wnd.id === id);
    if (!appWin.state.minimized) {
      appWin.blur();
      appWin.minimize();
    } else {
      appWin.raise();
      appWin.restore();
      appWin.focus();
    }
  };

  async function discover() {
    await axios
      .get(proc.resource('/discovery'), {
        params: {
          id: filePath,
        },
      })
      .then((res) => {
        const {url, token, fileId} = res.data;
        const locationOrigin = window.location.origin;
        const wopiSrc = `${locationOrigin}/wopi/files/${fileId}`;
        setAccessToken(token);
        setWopiUrl(`${url}WOPISrc=${wopiSrc}`);
        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (loading) {
    return (
      <div className="office_outerBox">
        <div id="frameholder" className="office_frameholder">
          <LoaderForm url={wopiUrl} token={accessToken} />
          <iframe
            ref={iframeRef}
            title="Collabora Online Viewer"
            id="collabora-online-viewer"
            name="collabora-online-viewer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="office_container">
      <div className="office_appContent">
        <BrowseFile action={setFilePath} />
        <CreateFile action={setFilePath} />
      </div>
    </div>
  );
}
