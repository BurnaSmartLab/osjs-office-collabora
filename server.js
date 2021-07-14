const {discovery, checkFileInfo, getFile, putFile} = require('./wopi');

// Methods OS.js server requires
module.exports = (core, proc) => {
  const vfs = core.make('osjs/vfs');
  const {routeAuthenticated, route} = core.make('osjs/express');
  let userInfo;

  const withHooks = (fn) => async (req, res) => {
    const vfsWithSession = (method, ...args) => vfs
      .call({method, user: {username: userInfo.username}}, ...args);

    try {
      await fn({req, res, core, vfs, vfsWithSession, userInfo});
    } catch (e) {
      res.status(500).end();
      console.error(e);
    }
  };

  return {
    init: async () => {
      routeAuthenticated(
        'GET',
        proc.resource('/discovery'),
        withHooks((args) => {
          userInfo = args.req.session.user;
          return discovery(args);
        })
      );

      route('GET', '/wopi/files/:fileId', withHooks(checkFileInfo));
      route('GET', '/wopi/files/:fileId/contents', withHooks(getFile));
      route('POST', '/wopi/files/:fileId/contents', withHooks(putFile));
    },
  };
};
