const fsPromises = require ('fs/promises');
const path = require ('path');
const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

fsPromises.mkdir(copyFolderPath, {recursive: true})
  .then(() => {
    return fsPromises.readdir(copyFolderPath);
  })
  .then(filesCopyFolder => {
    const deletPromise = filesCopyFolder.map(file => {
      return fsPromises.unlink(path.join(copyFolderPath, file));
    });
    return Promise.all(deletPromise);
  })
  .then(() => {
    return fsPromises.readdir(folderPath);
  })
  .then(files => {
    console.log(`filesFolder     = ${files}`);
    const copyPromises = files.map(file => {
      const filePath = path.join(folderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      return fsPromises.copyFile(filePath, copyFilePath);
    });
    return Promise.all(copyPromises);
  })
  .then(() => {
    return fsPromises.readdir(copyFolderPath);
  })
  .then(file => {
    console.log(`filesFolderCopy = ${file}`);
  });
