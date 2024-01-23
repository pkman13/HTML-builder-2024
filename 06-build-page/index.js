const fsPromises = require('fs/promises');
const path = require('path');

const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const projectDiskPath = path.join(__dirname, 'project-disk');
const stylesFolder = path.join(__dirname, 'styles');
const styleBundle = path.join(projectDiskPath, 'style.css');
const assetsSrcPath = path.join(__dirname, 'assets');
const assetsDestPath = path.join(projectDiskPath, 'assets');

function createHtml() {
    return fsPromises.readFile(templatePath, 'utf-8')
        .then(htmlContent => {
            return fsPromises.readdir(componentsPath, { withFileTypes: true })
                .then(files => {
                    const componentPromises = files
                        .filter(file => file.isFile() && path.extname(file.name) === '.html')
                        .map(file => {
                            const componentName = path.basename(file.name, '.html');
                            const componentFilePath = path.join(componentsPath, file.name);
                            return fsPromises.readFile(componentFilePath, 'utf-8')
                                .then(componentContent => {
                                    return htmlContent.replace(`{{${componentName}}}`, componentContent);
                                });
                        });

                    return Promise.all(componentPromises).then(contents => contents.join(''));
                })
                .then(finalHtmlContent => {
                    return fsPromises.writeFile(path.join(projectDiskPath, 'index.html'), finalHtmlContent);
                });
        });
}

function compileCss() {
    return fsPromises.readdir(stylesFolder, { withFileTypes: true })
        .then(files => {
            const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');
            const readCssFilePromises = cssFiles.map(file => fsPromises.readFile(path.join(stylesFolder, file.name), 'utf-8'));

            return Promise.all(readCssFilePromises).then(fileContents => fileContents.join('\n'));
        })
        .then(combinedContent => fsPromises.writeFile(styleBundle, combinedContent));
}

function copyAssets(src, dest) {
    return fsPromises.mkdir(dest, { recursive: true })
        .then(() => fsPromises.readdir(src, { withFileTypes: true }))
        .then(items => {
            const copyPromises = items.map(item => {
                const srcPath = path.join(src, item.name);
                const destPath = path.join(dest, item.name);

                if (item.isDirectory()) {
                    return copyAssets(srcPath, destPath);
                } else {
                    return fsPromises.copyFile(srcPath, destPath);
                }
            });

            return Promise.all(copyPromises);
        });
}

fsPromises.mkdir(projectDiskPath, { recursive: true })
    .then(() => createHtml())
    .then(() => compileCss())
    .then(() => copyAssets(assetsSrcPath, assetsDestPath))

