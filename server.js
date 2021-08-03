const {discovery, checkFileInfo, getFile, putFile} = require('./wopi');
const {encrypt} = require('./crypto');
module.exports = (core, proc) => {
  const {routeAuthenticated, route} = core.make('osjs/express');
  const OFFICE_BASE_URL = core.configuration.office['collabora_online'];
  const vfs = core.make('osjs/vfs');

  return {
    init: async () => {
      routeAuthenticated(
        'GET',
        proc.resource('/discovery'),
        async (req, res) => {
          discovery({OFFICE_BASE_URL, req, res});
        }
      );

      routeAuthenticated(
        'GET',
        proc.resource('/fileIdToken'),
        async (req, res) => {
          let sessionToken = encrypt(JSON.stringify(req.session));
          res.json({
            fileId: encrypt(req.query.id),
            token: sessionToken,
          });
        }
      );

      route('GET', '/wopi/files/:fileId', async (req, res) => {
        checkFileInfo({req, res, vfs});
      });

      route('GET', '/wopi/files/:fileId/contents', async (req, res) => {
        getFile({req, res, vfs});
      });

      route('POST', '/wopi/files/:fileId/contents', async (req, res) => {
        putFile({req, res, vfs});
      });
    },
  };
};
