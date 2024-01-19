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
          const fileExt = path.extname(file.name).slice(1);
          const fileName = path.basename(file.name, fileExt).replace('.', '');
          console.log(`${fileName} - ${fileExt} - ${fileSize}b`)
          // console.log(`size = ${fileSize}`)
          // console.log(`ext = ${fileExt}`)
          // console.log(`name = ${fileName}`)
        })
      }
    });
  });
