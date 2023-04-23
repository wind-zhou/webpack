const path = require('path');
//window mac linux里它们的路径分隔符不一样
console.log(path.posix.sep);// /
console.log(path.win32.sep);// \
console.log(path.sep);//根据操作系统不同，返回不同的结果 
//在webpack里为了方便，为了统一，我们一律用path.posix.sep