import './index.scss';
import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './src';


// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});

  const win = proc.createWindow({
    id: 'OfficeApplicationWindow',
    title: metadata.title.en_EN,
    icon: proc.resource(metadata.icon),
    dimension: {width: 350, height: 400},
    position: {left: 700, top: 200},
    attributes: {
      sessionable: true
    }
  });

    win.render($content => ReactDOM.render(
    <App core={core} win={win} proc={proc} data={args.filepath}/>,
    $content
    ));
    win.once('render', () => win.focus())
    // win.on('destroy', ()=>{  win.blur();
    //   win.minimize();})

  return proc;
};

osjs.register(applicationName, register);
