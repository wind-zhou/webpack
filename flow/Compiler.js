/**
 * Compiler 对象 ，webpack 的核心对象
 * Compiler 对象包含了当前运行Webpack的配置，包括entry、output、loaders等配置，
 * 这个对象在启动Webpack时被实例化，而且是全局唯一的。Plugin可以通过该对象获取到 Webpack 的配置信息进行处理。
 */

const fs = require('fs');
const { SyncHook } = require('tapable');
const path = require('path')
const Comlilation = require('./Compilation')

class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(), // 再开始前编译
            done: new SyncHook(), // 在编译完成时执行
        }
    }

    run(callback) {
        this.hooks.run.call();//在编译开始前触发run钩子执行  ----这里会执行注册到run 钩子上的各种注册的函数，例如一些插件
        // 调用compile 方法进行编译
        const onCompiler = (err, stats, fileDependencies) => {
            console.log('stats', stats);
            console.log('fileDependencies', fileDependencies);
            // Todo....
            callback(err, { toJson: () => stats });

            // 10.将生成的代码输出到指定文件位置
            for (let filename in stats.assets) {
                let filePath = path.join(this.options.output.path, filename);
                fs.writeFileSync(filePath,stats.assets[filename],'utf8');
            }
            for (let fileDependency of fileDependencies) {
                //监听依赖的文件变化，如果依赖的文件变化后会开始一次新的编译
                fs.watch(fileDependency, () => this.compile(onCompiled));
            }
            this.hooks.done.call();//在编译完成时触发done钩子执行

        }

        this.compile(onCompiler)
    }

    compile(callback) {
        // 每次编译，创建一个新的Compilation 实例
        let compilation = new Comlilation(this.options, this);
        // 调用build方法 进行创建bundles
        compilation.build(callback);
    }
}

module.exports = Compiler;


