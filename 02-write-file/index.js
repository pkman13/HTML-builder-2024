const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('\nEnter text to write to file (type "exit" to exit):\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  output.write(data);
});

process.on('exit', () => {
  output.end();
  stdout.write('\nThank you for using our application. Have fun learning Node.js!\n');
});

process.on('SIGINT', () => {
  process.exit();
});