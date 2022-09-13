
/**
 * Module 模块
 * 每个文件都是一个模块，每个模块对应一个模块实例
 */

const MagicString = require('magic-string');
const { parse } = require('acorn');
const analyse = require('./ast/analyse')

class Module {
    constructor({ code, path, bundle }) {
        this.code = new MagicString(code);
        this.path = path;
        this.bundle = bundle;
        // 获取语法树
        this.ast = parse(this.code, {
            ecmaVersion: 8,
            sourceType: 'module'
        })
        this.imports = {};// 模块导入了那些变量
        this.exports = {}; // 模块导出了那些变量
        this.definitions = {};   //只存放本模块内定义的顶级变量

        // 分析语法树（核心）
        analyse(this.ast, this.code, this);
    }

    /**
     * 语法树展开 
     */
    expendAllStatements() {
        let allStatements = [];
        this.ast.body.forEach(statement => {
            let statements = this.expendStatement(statement);
            allStatements.push(...statements)
        });
        return allStatements;
    }

    expendStatement(statement) {
        statement._included = true; // 打个标，标识当前模块已经被展开过
        let result = [];
        result.push(statement);
        return result;
    }
}

module.exports = Module