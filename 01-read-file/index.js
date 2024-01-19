const fs = require('fs'); 
const path = require('path'); 
const { stdout } = process; 


const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
readStream.pipe(stdout);

// another variant
//readStream.on('data', data => stdout.write(data));



 