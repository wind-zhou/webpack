const path = require('path')
const fs = require('fs')
function normalizePath(path) {
  return path.replace(/\\/g,'/');
} 
const baseDir = normalizePath(process.cwd());
const filePath = normalizePath(path.join(__dirname, 'txt/1.txt'));
console.log("./"+path.posix.relative(baseDir,filePath));
/* console.log();
*/