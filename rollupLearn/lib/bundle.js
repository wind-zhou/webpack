/**
 * Bungdle 打包器，等同于webpack 的 Complier类 
 * 负责构建代码,最终所有模块的地理都会汇总到 这个bundle中
 */

const path = require('path');
const fs = require('fs');
const Module = require('./module');
class Bundle {
    constructor(options = {}) {
        this.entryPath = path.resolve(options.entry);
    }

    // 
    build(output) {
        const entryModule = this.fetchModule(this.entryPath)
        console.log('module:', entryModule);

    }

    // 根据路径获取模块
    fetchModule(importee) {
        const route = importee;
        if (route) {
            // 读取文件内容
            const code = fs.readFileSync(route, 'utf-8');
            // 创建 模块Module 实例
            const module = new Module({
                code, // 源码
                path: route, // 模块路径
                bundle: this // Bundle 实例（属于哪个bundle）
            })
            return module;
        }

    }
}

module.exports = Bundle