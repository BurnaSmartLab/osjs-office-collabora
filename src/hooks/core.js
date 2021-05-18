import React from 'react';

const CoreContext = React.createContext();

export function CoreProvider({children, core, proc, win}) {
  const [basic] = React.useState(() =>
    core.make('osjs/basic-application', proc, win, {
      defaultFilename: 'alaki'
    })
  );
  const [vfs] = React.useState(() => core.make('osjs/vfs'));
  const [_] = React.useState(() => core.make('osjs/locale').translate);

  return (
    <CoreContext.Provider value={{core, proc, win, basic, vfs, _}}>
      {children}
    </CoreContext.Provider>
  );
}

const useCore = () => React.useContext(CoreContext);

export default useCore;
