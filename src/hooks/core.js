import React from 'react';
import * as translations from '../../locales';

const CoreContext = React.createContext();

export function CoreProvider({children, core, proc, win}) {
  const [basic] = React.useState(() =>
    core.make('osjs/basic-application', proc, win, {
      defaultFilename: ''
    })
  );
  const [vfs] = React.useState(() => core.make('osjs/vfs'));

  const [_] = React.useState(() => {
    const {translatable} =core.make('osjs/locale')
    return translatable(translations)
  });

  return (
    <CoreContext.Provider value={{core, proc, win, basic, vfs, _}}>
      {children}
    </CoreContext.Provider>
  );
}

const useCore = () => React.useContext(CoreContext);

export default useCore;
