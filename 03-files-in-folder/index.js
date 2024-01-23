const fsPromises = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fsPromises.readdir((folderPath), {withFileTypes: true })
  .then(files => {
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name)
        fsPromises.stat(filePath)
        .then(stats => {
          const fileSize = stats.size;
          const fileExt = path.extname(file.name);
          const fileName = path.basename(file.name, fileExt);
          console.log(`${fileName} - ${fileExt.slice(1)} - ${fileSize}b`)
          // console.log(`size = ${fileSize}`)
          // console.log(`ext = ${fileExt}`)
          // console.log(`name = ${fileName}`)
        })
      }
    });
  });
