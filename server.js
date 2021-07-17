const {discovery, checkFileInfo, getFile, putFile} = require('./wopi');
const bodyParser = require('body-parser');
module.exports = (core, proc) => {
  const {routeAuthenticated, route} = core.make('osjs/express');
  const OFFICE_BASE_URL = core.configuration.office['collabora_online'];
  const vfs = core.make('osjs/vfs');
  core.app.use(bodyParser.raw({limit: '1000000kb'}));

  return {
    init: async () => {
      routeAuthenticated(
        'GET',
        proc.resource('/discovery'),
        async (req, res) => {
          discovery({OFFICE_BASE_URL, req, res});
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
