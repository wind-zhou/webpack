const path = require('path')
const fs = require('fs');
const parser = require('@babel/parser');
const types = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const baseDir = normalizePath(process.cwd());
function normalizePath(path) {
  return path.replace(/\\/g, '/');
}
class Compilation {
  constructor(options, compiler) {
    this.options = options;
    this.compiler = compiler;
    this.modules = [];//这里放置本次编译涉及的所有的模块
    this.chunks = [];//本次编译所组装出的代码块
    this.assets = {};//key是文件名,值是文件内容
    this.files = [];//代表本次打包出来的文件
    this.fileDependencies =new Set();//本次编译依赖的文件或者说模块
  }
  build(callback) {
    //5.根据配置中的entry找出入口文件
    let entry = {};
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    for (let entryName in entry) {
      let entryFilePath = path.posix.join(baseDir, entry[entryName]);
      this.fileDependencies.add(entryFilePath);
      //6.从入口文件出发,调用所有配置的Loader对模块进行编译
      let entryModule = this.buildModule(entryName, entryFilePath);
      //this.modules.push(entryModule);
      //8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
      let chunk = {
        name: entryName,
        entryModule,
        modules:this.modules.filter(module=>module.names.includes(entryName))
      }
      this.chunks.push(chunk);
    }
    //9.再把每个 Chunk 转换成一个单独的文件加入到输出列表
    this.chunks.forEach(chunk => {
      const filename = this.options.output.filename.replace('[name]',chunk.name);
      this.files.push(filename);
      this.assets[filename] = getSource(chunk);
    });
    callback(null, {
      modules: this.modules,
      chunks: this.chunks,
      assets: this.assets,
      files: this.files,
    }, this.fileDependencies);
  }
  /**
   * 编译模块
   * @param {*} name 模块所属的代码块(chunk)的名称，也就是entry的name entry1 entry2
   * @param {*} modulePath 模块的路径
   */
  buildModule(name, modulePath) {
    //1.读取文件的内容
    let sourceCode = fs.readFileSync(modulePath, 'utf8');
    let { rules } = this.options.module;
    //根据规则找到所有的匹配的loader
    let loaders = [];
    rules.forEach(rule => {
      if (modulePath.match(rule.test)) {
        loaders.push(...rule.use);
      }
    });
    //调用所有配置的Loader对模块进行转换
    sourceCode = loaders.reduceRight((sourceCode, loader) => {
      return require(loader)(sourceCode);
    }, sourceCode);
    //7.再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    //声明当前模块的ID
    let moduleId = './' + path.posix.relative(baseDir, modulePath);
    //创建一个模块ID就是相对于根目录的相对路径 dependencies就是此模块依赖的模块
    //name是模块所属的代码块的名称,如果一个模块属于多个代码块，那么name就是一个数组
    let module = { id: moduleId, dependencies: [], names: [name] };
    let ast = parser.parse(sourceCode, { sourceType: 'module' });
    //Visitor是babel插件中的概念，此处没有
    traverse(ast, {
      CallExpression:({ node }) =>{
        if (node.callee.name === 'require') {
          let depModuleName = node.arguments[0].value;//"./title"
          let depModulePath;
          if (depModuleName.startsWith('.')) {
            //暂时先不考虑node_modules里的模块，先只考虑相对路径
            const currentDir = path.posix.dirname(modulePath);
            //要找当前模块所有在的目录下面的相对路径
            depModulePath = path.posix.join(currentDir, depModuleName);
            //此绝对路径可能没有后续，需要尝试添加后缀
            const extensions = this.options.resolve.extensions;
            depModulePath = tryExtensions(depModulePath, extensions);
          } else {//如果不是以.开头的话，就是第三方模块
            depModulePath = require.resolve(depModuleName)
          }
          this.fileDependencies.add(depModulePath);
          //获取依赖的模块的ID,修改语法树，把依赖的模块名换成模块ID
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath)
          node.arguments[0] = types.stringLiteral(depModuleId);
          //把依赖的块ID和依赖的模块路径放置到当前模块的依赖数组中
          module.dependencies.push({
            depModuleId,
            depModulePath
          });
        }
      }
    })
    //使用改造后的ast语法要地重新生成新的源代码
    let { code } = generator(ast);
    module._source = code;
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      //判断此依赖的模块是否已经打包过了或者说编译 过了
      let existModule = this.modules.find(module => module.id === depModuleId);
      if (existModule) {
        existModule.names.push(name);
      } else {
        let depModule = this.buildModule(name, depModulePath);
        this.modules.push(depModule);
      }
    });
    return module;
  }
}
function tryExtensions(modulePath,extensions) {
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }
  for (let i = 0; i < extensions.length; i++){
    let filePath = modulePath + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  throw new Error(`找不到${modulePath}`);
}
function getSource(chunk) {
  return `
  (() => {
    var modules = {
      ${
        chunk.modules.map((module) => `
          "${module.id}": module => {
            ${module._source}
          }
        `).join(',')
      }
    };
    var cache = {};
    function require(moduleId) {
      var cachedModule = cache[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      var module = cache[moduleId] = {
        exports: {}
      };
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    var exports = {};
    (() => {
      ${chunk.entryModule._source}
    })();
  })();
  `;
}
module.exports = Compilation;