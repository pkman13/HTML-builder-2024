const fsPromises = require('fs/promises');
const path = require('path');
const styleFiles = path.join(__dirname, 'styles');
const folderProject = path.join(__dirname, 'project-dist');
const styleBundle = path.join(folderProject, 'bundle.css');

fsPromises.writeFile(styleBundle, '')
  .then(() => {
    return fsPromises.readdir((styleFiles), { withFileTypes: true })
  })
  .then(files => {
    const cssFiles = files.filter(file => {
      return file.isFile() && path.extname(file.name) === '.css';
    });
    const readCssFile = cssFiles.map(file => {
      // console.log(file);
      const filePath = path.join(styleFiles, file.name);
      return fsPromises.readFile(filePath, 'utf-8');
    });
    return Promise.all(readCssFile);
  })
  .then(fileContetnt => {
    const allCss = fileContetnt.join('\n');
    return fsPromises.writeFile(styleBundle, allCss);
  });

