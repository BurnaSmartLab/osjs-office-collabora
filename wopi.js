var Dom = require('xmldom').DOMParser;
var http = require('http');
var https = require('https');
var xpath = require('xpath');
const fs = require('fs');
const { Readable } = require('stream');
const {encrypt, decrypt} = require('./crypto');

async function discovery({ OFFICE_BASE_URL, req, res }) {
    const filePathHash = encrypt(req.query.id);
        let httpClient = OFFICE_BASE_URL.startsWith('https') ? https : http;
        let data = '';
        let request = httpClient.get(OFFICE_BASE_URL + '/hosting/discovery', function (response) {
          response.on('data', function (chunk) { data += chunk.toString(); });
          response.on('end', function () {
            var err;
            if (response.statusCode !== 200) {
              err = 'Request failed. Satus Code: ' + response.statusCode;
              response.resume();
              res.status(response.statusCode).send(err);
              console.log(err)
              return;
            }
            if (!response.complete) {
              err = 'No able to retrieve the discovery.xml file from the Collabora Online server with the submitted address.';
              res.status(404).send(err);
              console.log(err);
              return;
            }
            var doc = new Dom().parseFromString(data);
            if (!doc) {
              err = 'The retrieved discovery.xml file is not a valid XML file'
              res.status(404).send(err)
              console.log(err);
              return;
            }
            var mimeType = 'text/plain';
            var nodes = xpath.select("/wopi-discovery/net-zone/app[@name='" + mimeType + "']/action", doc);
            if (!nodes || nodes.length !== 1) {
              err = 'The requested mime type is not handled'
              res.status(404).send(err);
              console.log(err);
              return;
            }
            var onlineUrl = nodes[0].getAttribute('urlsrc');
            res.json({
              url: onlineUrl,
              token: 'test',
              fileId: filePathHash
              // fileId: '11'
            });
          });
          response.on('error', function (err) {
            res.status(404).send('Request error: ' + err);
            console.log('Request error: ' + err.message);
          });
        })
}

/* *
 *  wopi CheckFileInfo endpoint
 *
 *  Returns info about the file with the given document id.
 *  The response has to be in JSON format and at a minimum it needs to include
 *  the file name and the file size.
 *  The CheckFileInfo wopi endpoint is triggered by a GET request at
 *  https://HOSTNAME/wopi/files/<document_id>
 */
async function checkFileInfo({req, res, vfs, userInfo }){
    console.log('checkFileInfo called');
    const filePath = decrypt(req.params.fileId);
        const fileName = filePath.split('/').pop();
        let fileSize = null;

        try {
          await vfs.call({ method: 'stat', user: { username: userInfo.username } }, filePath).then(response => {
            if (response.size) {
              fileSize = response.size
            }
            else {
              throw new Error();
            }
          })
        } catch {
          await vfs.call({ method: 'readfile', user: { username: userInfo.username } }, filePath).then(response => {
            fileSize = response.headers['content-length']
          })
        }
        // if (filePath.startsWith('myMonster')) {
        //   await vfs.call({ method: 'readfile', user: { username: userInfo.username } }, filePath).then(res => {
        //     fileSize = res.headers['content-length']
        //   })
        // }
        // else {
        //   await vfs.call({ method: 'stat', user: { username: userInfo.username } }, filePath).then(res => {
        //     fileSize = res.size
        //   })
        // }

        res.json({
          BaseFileName: fileName,
          Size: fileSize,
          UserId: userInfo.id,
          OwnerId: userInfo.username,
          UserCanWrite: true,
          UserCanNotWriteRelative: false,
          SupportsUpdate:true
        });
        // res.set({
        //   'Content-Security-Policy': 'frame-ancestors  192.168.1.144:*'
        // });
}

/* *
 *  wopi GetFile endpoint
 *
 *  Given a request access token and a document id, sends back the contents of the file.
 *  The GetFile wopi endpoint is triggered by a request with a GET verb at
 *  https://HOSTNAME/wopi/files/<document_id>/contents
 */
async function getFile({req, res, vfs, userInfo }){
    console.log('getFile called');
    const filePath = decrypt(req.params.fileId);
        // let realPath;
        // try {
        //   realPath = await vfs.realpath(filePath, { username: userInfo.username });
        // } catch (err) {
        //   const tempPath = `home:/.temp/office/${encodeURIComponent(filePath)}`;
        //   realPath = await vfs.realpath(tempPath, { username: userInfo.username });
        //   const doesExist = await vfs.call({ method: 'exists', user: { username: userInfo.username } }, tempPath);
        //   if (!doesExist) {
        //     const originalFileStream = await vfs.call(
        //       { method: 'readfile', user: { username: userInfo.username } },
        //       filePath
        //     );
        //     mkdirp.sync(path.dirname(realPath));
        //     await vfs.call(
        //       { method: 'writefile', user: { username: userInfo.username } },
        //       tempPath,
        //       originalFileStream
        //     );
        //   }
        // }

        // const fileBuffer = fs.readFileSync(realPath);
        // res.send(fileBuffer)

        if (filePath.startsWith('myMonster')) {
          await vfs.call({ method: 'readfile', user: { username: userInfo.username } }, filePath).then(response => {
            response.pipe(res);
          })
        }
        else {
          const realPath = await vfs.realpath(filePath, { username: userInfo.username });
          const fileBuffer = fs.readFileSync(realPath);
          res.send(fileBuffer)
        } 
}

/* *
* wopi PutFile endpoint
*
* Given a request access token and a document id, replaces the files with the POST request body.
* The PutFile wopi endpoint is triggered by a request with a POST verb at
* https://HOSTNAME/wopi/files/<document_id>/contents
*/
async function putFile({req, res, vfs, userInfo }){
    console.log('putFile called');
    if (req.body) {
        const filePath = decrypt(req.params.fileId);
        const stream = Readable.from(req.body);
        await vfs.call(
          {method: 'writefile', user: {username: userInfo.username}},
          filePath,
          stream
        );
        res.sendStatus(200);
      } else {
        console.log('Not possible to get the file content.');
        res.sendStatus(404);
      }
}

/* *
*  wopi PutRelativeFile endpoint
*
*  Given a request access token and a document id, creates a new file on the host based on the current file, with the POST request body.
*  The PutRelativeFile wopi endpoint is triggered by a request with a POST verb at
*  https://HOSTNAME/wopi/files/<document_id>
*/
async function putRelativeFile({req, res, vfs, userInfo }){
    console.log('putRelativeFile called');
    if (req.body) {
        const filePath = decrypt(req.params.fileId);
        //TO DO: implement saving
        res.sendStatus(200);

      } else {
        console.log('Not possible to save the file content.');
        res.sendStatus(404);
      }
}

module.exports = {
    discovery, 
    checkFileInfo,
    getFile,
    putFile,
    putRelativeFile
};
