import React from 'react';
import {CoreProvider} from './hooks/core';
import Main from './components/main';

import './styles/fonts.scss';

export default function App(props) {
  return (
    <CoreProvider core={props.core} proc={props.proc} win={props.win}>
      <Main data={props.data} />
    </CoreProvider>
  );
}
