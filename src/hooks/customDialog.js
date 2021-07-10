import {useEffect} from 'react';

export const useCustomDialog = (core, proc, win, vfs, setFilePath) => {
  const fileExtensions = {
    document: ['docx', 'docx', 'odt'],
    presentation: ['pptx', 'odp'],
    spreedsheet: ['xlsx', 'ods'],
  };

  const fileMimeTypes = {
    docx: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    pptx: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    odt: ['application/vnd.oasis.opendocument.text'],
    odp: ['application/vnd.oasis.opendocument.presentation'],
    ods: ['application/vnd.oasis.opendocument.spreadsheet'],
    txt: ['text/plain'],
  };

  const newBasic = core.make('osjs/basic-application', proc, win, {
    defaultFilename: ' ',
  });

  useEffect(() => {
    newBasic.on('new-save-file', async (selectedFile, fileType) => {
      let hasExtension = false;
      let filePath = selectedFile.path;
      fileType.map((item) => {
        if (selectedFile.filename.endsWith(item)) {
          hasExtension = true;
        }
      });
      if (!hasExtension) {
        let result = await setUniqueFilePath(selectedFile, fileType);
        filePath = result.filePath;
        const prefix = core
          .make('osjs/locale')
          .translatableFlat(proc.metadata.title);
        win.setTitle(`${prefix} - ${result.fileName}`);
      }
      vfs.writefile(filePath, '');
      setFilePath(filePath);
    });
  });

  const handleCreateFile = (fileType) => {
    let mimeTypes = [];
    fileType.map((item) => mimeTypes.push(fileMimeTypes[item]));
    mimeTypes.push('container'); // to show myMonster Drive directories to deep in, we must add 'container' mimeType.
    mimeTypes = mimeTypes.flat() || [];

    newBasic.off('save-file'); // Just to ensure no duplicate events
    newBasic.once('save-file', (result) =>
      newBasic.emit('new-save-file', result, fileType)
    );
    newBasic.createSaveDialog({
      mime: mimeTypes,
    });
  };

  const setUniqueFilePath = async (selectedFile, fileType) => {
    let filePath = selectedFile.path + '.' + fileType[0];
    let fileName = selectedFile.filename + '.' + fileType[0];
    let num = 1;
    while (await FileExist(filePath)) {
      filePath =
        selectedFile.path + '(' + num.toString() + ')' + '.' + fileType[0];
      fileName =
        selectedFile.filename + '(' + num.toString() + ')' + '.' + fileType[0];
      num += 1;
    }
    return {filePath, fileName};
  };

  const FileExist = async (filePath) => {
    let result;
    await vfs
      .exists(filePath)
      .then((res) => {
        result = res;
      })
      .catch((err) => {
        console.log(err);
      });
    return result;
  };

  return [fileExtensions, handleCreateFile];
};
