import  {useEffect} from 'react';


export const useCustomDialog = (core, proc, win, vfs, setFilePath) => {
  
    const fileExtensions = {
        document: ['docx','txt','odt'],
        presentation: ['pptx','odp'],
        spreedsheet: ['xlsx','ods']
    };

    const fileMimeTypes = {
        'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        'xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        'odt': ['application/vnd.oasis.opendocument.text'],
        'odp': ['application/vnd.oasis.opendocument.presentation'],
        'ods': ['application/vnd.oasis.opendocument.spreadsheet'],
        'txt': ['text/plain'],
    }

    const newBasic = core.make('osjs/basic-application', proc, win, {
        defaultFilename: ' '
    })

    useEffect(() => {
        newBasic.on('new-save-file', (selectedFile, fileType) => {
            let hasExtension = false;
            fileType.map(item => {
                if (selectedFile.filename.endsWith(item)) {
                    hasExtension = true;
                }
            })
            if (!hasExtension) {
                vfs.writefile(`${selectedFile.path}.${fileType[0]}`, '');
                setFilePath(`${selectedFile.path}.${fileType[0]}`);
            } else {
                vfs.writefile(selectedFile.path, '');
                setFilePath(selectedFile.path);
            }

        })
    });

    const handleCreateFile = (fileType) => {
        let mimeTypes = [];
        fileType.map(item => mimeTypes.push(fileMimeTypes[item]));
        mimeTypes.push('container'); // to show myMonster Drive directories to deep in, we must add 'container' mimeType.
        mimeTypes = mimeTypes.flat() || [];

        newBasic.off('save-file');// Just to ensure no duplicate events
        newBasic.once('save-file', result => newBasic.emit('new-save-file', result, fileType));
        newBasic.createSaveDialog({
            mime: mimeTypes
        })
    }
  
    return [fileExtensions, handleCreateFile];
  }
