const path = require('path')
const fs = require('fs')
let c1 = fs.readFileSync(path.posix.join(__dirname, '1.txt'));
let c2 = fs.readFileSync(path.win32.join(__dirname, '1.txt'));
console.log(c1,c2);
/* console.log(normalizePath(process.cwd()));
function normalizePath(path) {
  return path.replace(/\\/g,'/');
} */