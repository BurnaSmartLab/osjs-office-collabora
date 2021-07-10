import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './src';

const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});
  const win = proc.createWindow({
    id: 'OfficeApplicationWindow',
    title: core.make('osjs/locale').translatableFlat(proc.metadata.title),
    icon: proc.resource(metadata.icon),
    dimension: {width: 350, height: 400},
    position: {left: 700, top: 200},
    attributes: {
      sessionable: true,
    },
  });

  const setWindowState = () => {
    if (window.innerWidth < 640) {
      win.maximize();
    } else {
      win.restore();
    }
  };

  window.addEventListener('resize', setWindowState);

  win.on('render', () => {
    setWindowState();
    win.focus();
  });

  win.render(($content) => {
    ReactDOM.render(
      <App core={core} win={win} proc={proc} data={args.file} />,
      $content
    );
  });
  win.once('render', () => win.focus());
  return proc;
};

osjs.register(applicationName, register);
