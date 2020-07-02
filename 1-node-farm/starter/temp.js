const fs = require('fs');
const path = require('path');

console.log(path.parse('/home/user/dir/file.txt'));
console.log(fs.readFileSync(path.join(__dirname, 'txt/readthis.txt'), 'utf-8'));
