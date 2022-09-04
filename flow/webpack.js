
/**
 * Webpack 构造函数 
 * 作用： 初始化参数并生成Compiler 对象
 */
const Compiler = require('./Compiler');

function Webpack(options) {
    // 1. 初始化参数： 从配置文件和shell 语句中读取并合并参数 
    //argv[0]是Node程序的绝对路径 argv[1] 正在运行的脚本,因此从第二个开始才是传入的参数
    const argv = process.argv.slice(2);
    const shelloptions = argv.reduce((shelloptions, curOption) => {
        // options = '--mode=development'
        const [key, value] = option.split('=');
        shellOptions[key.slice(2)] = value;
        return shellOptions;
    }, {});

    const finalOpions = { ...options, ...shelloptions };
    // 2. 初始化compiler 对象
    const compiler = new Compiler(finalOpions);
    // 3. 加载 配置插件
    const { plugins } = finalOpions;
    for (let plugin of plugins) {
        plugin.apply(compiler)
    }
    return compiler;
}

module.exports = Webpack;