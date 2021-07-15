const Dom = require('xmldom').DOMParser;
const http = require('http');
const https = require('https');
const xpath = require('xpath');
const fs = require('fs');
const {Readable} = require('stream');
const {encrypt, decrypt} = require('./crypto');

function fetchDiscovery(baseUri, filePathHash) {
  const parseResponse = (response, data) => {
    if (response.statusCode !== 200) {
      const err = new Error('Request failed. Satus Code: ' + response.statusCode);
      err.statusCode = response.statusCode;
      throw err;
    } else if (!response.complete) {
      throw new Error('No able to retrieve the discovery.xml file from the Collabora Online server with the submitted address.');
    }

    let doc = new Dom().parseFromString(data);
    if (!doc) {
      throw new Error('The retrieved discovery.xml file is not a valid XML file');
    }

    let mimeType = 'text/plain';
    let nodes = xpath.select(
      `/wopi-discovery/net-zone/app[@name='${mimeType}']/action`,
      doc
    );
    if (!nodes || nodes.length !== 1) {
      throw new Error('The requested mime type is not handled');
    }

    let onlineUrl = nodes[0].getAttribute('urlsrc');
    return {
      url: onlineUrl,
      token: 'test',
      fileId: filePathHash,
    };
  };

  return new Promise((resolve, reject) => {
    const httpClient = baseUri.startsWith('https') ? https : http;
    const url = baseUri + '/hosting/discovery';

    const request = httpClient.get(url, (response) => {
      let data = '';
      response.on('error', reject);
      response.on('data', (chunk) => (data += chunk.toString()));
      response.on('end', () => {
        try {
          const parsed = parseResponse(response, data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });

    request.on('error', reject);
  });
}

async function discovery({req, res, core}) {
  const baseUri = core.config('office.collabora_online', '');
  const filePathHash = encrypt(req.query.id);

  try {
    const result = await fetchDiscovery(baseUri, filePathHash);
    res.json(result);
  } catch (e) {
    res.status(e.statusCode || 404).send(e.message);
    console.error(e);
  }
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
async function checkFileInfo({req, res, vfsWithSession, userInfo}) {
  let fileSize = null;
  const origin = 'http://192.168.1.144:8000'; // FIXME
  const filePath = decrypt(req.params.fileId);
  const fileName = filePath.split('/').pop();

  const stat = await vfsWithSession('stat', filePath);
  if (stat.size) {
    fileSize = stat.size;
  } else {
    const file = await vfsWithSession('readfile', filePath);
    fileSize = file.headers['content-length'];
  }

  res.json({
    BaseFileName: fileName,
    Size: fileSize,
    UserId: userInfo.id,
    OwnerId: userInfo.username,
    UserCanWrite: true,
    // UserCanNotWriteRelative: false,  // to show Save As button
    SupportsUpdate: true,
    PostMessageOrigin: origin,
  });
}

/* *
 *  wopi GetFile endpoint
 *
 *  Given a request access token and a document id, sends back the contents of the file.
 *  The GetFile wopi endpoint is triggered by a request with a GET verb at
 *  https://HOSTNAME/wopi/files/<document_id>/contents
 */
async function getFile({req, res, vfs, vfsWithSession, userInfo}) {
  const filePath = decrypt(req.params.fileId);

  if (filePath.startsWith('myMonster')) {
    const response = await vfsWithSession('readfile', filePath);
    response.pipe(res);
  } else {
    const realPath = await vfs.realpath(filePath, {
      username: userInfo.username,
    });
    const stream = fs.createReadStream(realPath);
    stream.pipe(res);
  }
}

/* *
 * wopi PutFile endpoint
 *
 * Given a request access token and a document id, replaces the files with the POST request body.
 * The PutFile wopi endpoint is triggered by a request with a POST verb at
 * https://HOSTNAME/wopi/files/<document_id>/contents
 */
async function putFile({req, res, vfsWithSession}) {
  if (req.body) {
    const filePath = decrypt(req.params.fileId);
    const stream = Readable.from(req.body);
    await vfsWithSession('writefile', filePath, stream);
    res.sendStatus(200);
  } else {
    console.log('Not possible to get the file content.');
    res.sendStatus(404);
  }
}

module.exports = {
  discovery,
  checkFileInfo,
  getFile,
  putFile,
};
