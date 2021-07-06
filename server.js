const bodyParser = require('body-parser');
const { discovery, checkFileInfo, getFile, putFile} = require('./wopi');

// Methods OS.js server requires
module.exports = (core, proc) => {
  const { routeAuthenticated, route } = core.make('osjs/express');
  const OFFICE_BASE_URL = core.configuration.office['collabora_online'];
  const vfs = core.make('osjs/vfs');
  core.app.use(bodyParser.raw({ limit: '1000000kb' }));
  let userInfo;

  return {
    init: async () => {
      routeAuthenticated('GET', proc.resource('/discovery'), async (req, res) => {
        userInfo = req.session.user;
        discovery({ OFFICE_BASE_URL, req, res })
      });

      route('GET', '/wopi/files/:fileId', async (req, res) => {
        checkFileInfo({req, res, vfs, userInfo })
      });

      route('GET', '/wopi/files/:fileId/contents', async (req, res) => {
        getFile({ req, res, vfs, userInfo })
      });

      route('POST', '/wopi/files/:fileId/contents', async (req, res) => {
        putFile({ req, res, vfs, userInfo })
      });
      
    },
  }
};
