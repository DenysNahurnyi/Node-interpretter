const fs = require('fs');

let file = fs.readFileSync(`${__dirname}/files/text.txt`);

console.log(file);