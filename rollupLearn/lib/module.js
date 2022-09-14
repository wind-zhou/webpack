
/**
 * Module 模块
 * 每个文件都是一个模块，每个模块对应一个模块实例
 */

const MagicString = require('magic-string');
const { parse } = require('acorn');
const analyse = require('./ast/analyse');
const { hasOwnProperty } = require('./utils');
const SYSTEM_VARS = ['console', 'log'];

class Module {
    constructor({ code, path, bundle }) {
        this.code = new MagicString(code);
        this.path = path;
        this.bundle = bundle;  // 属于哪个bundle，后面再module中会用到bundle中的相关方法
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
            if (statement.type === 'ImportDeclaration') return;
            //默认情况下我们不包括所有的变量声明语句
            //   if (statement.type === 'VariableDeclaration') return;
            let statements = this.expendStatement(statement);
            allStatements.push(...statements)
        });
        return allStatements;
    }

    /**
     * 当行展开：  1.看看依赖了哪些变量 2.将依赖变量的定义语句拿过来
     * @param {*} statement 
     * @returns 
     */
    expendStatement(statement) {
        statement._included = true; // 打个标，标识当前模块已经被展开过
        let result = [];
        // 依賴分析
        const _dependsOn = Object.keys(statement._dependsOn);
        // debug
        console.log(_dependsOn, '_dependsOn');
        _dependsOn.forEach(name => {
            // 根据依赖name找到定义的语句
            let definitions = this.define(name);
            result.push(...definitions);
        })

        result.push(statement);
        return result;
    }

    /**
     * 根据依赖name找到定义的语句
     * @param {*} name 依赖变量
     */
    define(name) {
        // 来自外部导入
        if (hasOwnProperty(this.imports, name)) {
            /** 一旦依赖外部导入，那我们就需要编译当前导入放入模块生成Module（不依赖不编译）*/
            // 拿到导入的相关信息
            const { source, importName } = this.imports[name];
            // 根据导入路径，拿到依赖编译后的模块
            const importModule = this.bundle.fetchModule(source, this.path);
            // 找到模块中依赖变量的本地名字 localName
            const { localName } = importModule.exports[importName];
            // 递归找到本地变量的声明语句
            return importModule.define(localName);

        } else { // 来自本模块定义
            // 找到本模块的定义语句
            let statement = this.definitions[name];
            // if (statement && !statement._included) {
            //     return this.expendStatement(statement); // 递归展开 因为可能有这种情况： var a = b + 1; 此时又依赖b，因此需要递归
            // } else {
            //     return []
            // }
            if (statement) {
                if (statement._included) {
                    return [];
                } else {
                    return this.expendStatement(statement);
                }
            } else {
                if (SYSTEM_VARS.includes(name)) {
                    return [];
                } else {
                    throw new Error(`变量${name}既没有从外部导入，也没有在当前的模块内声明!`);
                }
            }
        }
    }
}

module.exports = Module