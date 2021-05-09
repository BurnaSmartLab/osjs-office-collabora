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


  // Create a new Window instance
  const win = proc.createWindow({
    id: 'ExampleReactApplicationWindow',
    title: metadata.title.en_EN,
    icon: proc.resource(metadata.icon),
    dimension: {width: 400, height: 400},
    position: {left: 700, top: 200}
  });
    win.on('destroy', () => proc.destroy())
    win.render($content => ReactDOM.render(
    <App core={core} win={win} proc={proc} data={args.file}/>,
    $content
    ));

  return proc;
};

osjs.register(applicationName, register);
