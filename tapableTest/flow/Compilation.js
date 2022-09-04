/**
 * Compilation 类 ---- 负责创建bundles
 * 简单来说,Compilation的职责就是构建模块和Chunk，并利用插件优化构建过程
 * Compilation对象代表了一次资源版本构建。
 * 当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。
 * 一个 Compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息，简单来讲就是把本次打包编译的内容存到内存里。
 * Compilation 对象也提供了插件需要自定义功能的回调，以供插件做自定义处理时选择使用拓展。
 */



const baseDir = normalizePath(process.cwd());
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const generator = require('@babel/generator').default;
const fs = require('fs');

function normalizePath(path) {
    return path.replace(/\\/g, '/');
}

class Comlilation {
    constructor(options, compiler) {
        this.options = options;
        this.compiler = compiler;
        // 创建 bundle 的基本信息
        this.modules = [];//本次编译涉及到的模块
        this.chunks = []; // 本次编译所组装的代码块
        this.assets = {}; // key-value  key:文件名 value: 文件内容
        this.files = [];  // 代表本次打包出来的文件
        this.fileDependencies = new Set(); // 本次编译以来的文件或模块 【后面 fs 会监控这个列表，一旦文件有更新则开启新的编译】
    }

    // 核心方法 build
    build(callback) {
        //5.根据配置中的entry找出入口文件
        let entry = {};
        if (typeof this.options.entry === 'string') {  // 兼容entry 语法糖写法
            entry.main = this.options.entry;
        } else {
            entry = this.options.entry;
        }

        // 遍历entry
        for (let entryname in entry) {
            let entryFilePath = path.posix.join(baseDir, entry[entryname]);
            this.fileDependencies.add(entryFilePath);
            // 6. 从入口文件出发，调用所配置的loader 对模块进行编译
            let entryModule = this.buildModule(entryname, entryFilePath);
            // 8. 每个入口生成一个chunks  数组
            let chunk = {
                name: entryname,
                entryModule,
                modules: this.modules.filter(module => module.names.includes(entryname))
            }
            this.chunks.push(chunk);
        }

        // 9. 根据chunks 信息将其每个都输出到 文件列表中  【将文件 代码 挂载到 Compilation assert 属性上】
        this.chunks.forEach(chunk => {
            const filename = this.options.output.filename.replace('[name]', chunk.name);
            this.files.push(filename);
            this.assets[filename] = getSource(chunk);
        })

        // 调用callBack 将生成好的 数组返还给 compiler 对象
        callback(null, {
            modules: this.modules,  // 依赖模块
            chunks: this.chunks,    // 生成的chunk
            assets: this.assets,    // 生成的assert代码
            files: this.files,      // 需要输出的文件名称
        }, this.fileDependencies)
    }


    /**
     * 编译模块
     * @param {*} entryname 模块所属的代码块(chunk)的名称，也就是entry的name entry1 entry2
     * @param {*} modulePath 模块的路径
     */
    buildModule(entryname, modulePath) {

        // 1. 读取源文件
        let sourceCode = fs.readFileSync(modulePath, 'utf-8');
        let { rules } = this.options.module;
        // 2. 根据规则找到所有匹配的loader （路径）
        let loaders = []; // loader 数组，因为一个文件可能被多个loader处理
        rules.forEach(rule => {
            if (modulePath.match(rule.test)) {
                loaders.push(...rule.use);
            }
        });
        // 3. 调用loader 对模块进行解析
        sourceCode = loaders.reduce((sourceCode, loader) => {
            return require(loader)(sourceCode);
        }, sourceCode);


        //7.再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

        //声明当前模块的ID
        let moduleId = './' + path.posix.relative(baseDir, modulePath);
        let module = { id: moduleId, names: [entryname], dependencies: [] };
        let ast = parser.parse(sourceCode, { sourceType: 'module' }) //Indicate the mode the code should be parsed in.Files with ES6 imports and exports are considered "module" and are otherwise "script".
        // 遍历ast 【分析以依赖关系，得到当前模块依赖的路径信息】
        traverse(ast, {
            CallExpression: ({ node }) => {
                if (node.callee.name === 'require') {
                    let depModuleName = node.arguments[0].value;  // '.title'
                    let depModulePath;
                    if (depModuleName.startsWith('.')) { // 引入的自定义模块
                        // 拿到当前模块的绝对路径
                        const currDir = path.posix.dirname(modulePath);
                        // 拼接当前模块所依赖模块的绝对路径
                        depModulePath = path.posix.join(currDir, depModuleName);
                        //此绝对路径可能没有后续，需要尝试添加后缀
                        const extensions = this.options.resolve.extensions;
                        depModulePath = tryExtensions(depModulePath, extensions);
                    } else { // 引入第三方模块 
                        depModulePath = path.resolve(depModuleName)
                    }

                    // 将依赖模块 存储到 this.dependencics数组中
                    this.fileDependencies.add(depModulePath)
                    // 获取依赖的模块的ID,修改语法树，把依赖的模块名换成模块ID
                    let depModuleId = './' + path.posix.relative(baseDir, depModulePath)
                    node.arguments[0] = types.stringLiteral(depModuleId);
                    // 存储模块id 到当前的module 数组中
                    module.dependencies.push({
                        depModuleId,  // 模块id
                        depModulePath  // 模块路径
                    })
                }
            }
        })

        // 重新生成ast
        const { code } = generator(ast);
        module._source = code; // 将新代码挂载到 _source 字段
        // 遍历依赖数组，进行递归编译
        module.dependencies.forEach(({ depModuleId, depModulePath }) => {
            let existModule = this.modules.find(module => module.id === depModuleId);
            if (existModule) {  // 已经编译过
                existModule.names.push(entryname); // module 的name 字段，标识被那个入口所引用【只有依赖模块有这个字段，入口模块没有】
            } else { // 第一次编译
                let module = this.buildModule(entryname, depModulePath);
                this.modules.push(module);
            }
        })
        return module;
    }
}

function getSource(chunk) {
    return `
    (() => {
      var modules = {
        ${chunk.modules.map((module) => `
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


function tryExtensions(modulePath, extensions) {
    if (fs.existsSync(modulePath)) {
        return modulePath;
    }
    for (let i = 0; i < extensions.length; i++) {
        let filePath = modulePath + extensions[i];
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    throw new Error(`找不到${modulePath}`);
}

module.exports = Comlilation;