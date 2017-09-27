const fs = require('fs');

let text = (fs.readFileSync(`${__dirname}/files/text.txt`)).toString();
let code = (fs.readFileSync(`${__dirname}/files/code.txt`)).toString();

console.log(`${code} and ${text}`);