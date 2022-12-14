/**
 * Bungdle 打包器，等同于webpack 的 Complier类 
 * 负责构建代码,最终所有模块的地理都会汇总到 这个bundle中
 */

const path = require('path');
const fs = require('fs');
const Module = require('./module');
const MagicString = require('magic-string')
class Bundle {
    constructor(options = {}) {
        this.entryPath = path.resolve(options.entry).replace(/\.js$/, '') + '.js';
        this.modules = new Set(); // 存储模块集合
    }
    // 
    build(output) {
        const entryModule = this.fetchModule(this.entryPath)
        // console.log('module:', entryModule);
        this.statements = entryModule.expendAllStatements();
        const { code } = this.generate();
        fs.writeFileSync(output, code)
    }

    // 根据路径获取模块
    fetchModule(importee, importer) {
        let route;
        if (!importer) {
            route = importee;
        } else {
            if (path.isAbsolute(importee)) {
                route = importee.replace(/\.js$/, '') + '.js';
            } else {
                route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '') + '.js');
            }
        }

        if (route) {
            // 读取文件内容
            const code = fs.readFileSync(route, 'utf-8');
            // 创建 模块Module 实例
            const module = new Module({
                code, // 源码
                path: route, // 模块路径
                bundle: this // Bundle 实例（属于哪个bundle）
            })
            this.modules.add(module); // 将生成模块存到bundle 的 modules 数组
            console.log('module:', module);
            return module;
        }
    }
    /**
     * 生成代码
     */
    generate() {
        // 创建一个bundle
        let bundle = new MagicString.Bundle();
        this.statements.forEach(statement => {
            const source = statement._source.clone();
            if (statement.type === 'ExportNamedDeclaration') {
                source.remove(statement.start, statement.declaration.start)
              }
            bundle.addSource({
                content: source,
                separator: '\n'
            });
        })
        return { code: bundle.toString() }
    }
}

module.exports = Bundle