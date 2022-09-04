/**
 * plugin 是一个类
 * 里面需要编写一个apply函数 ，这个apply函数会在 webpack 初始化的时候去调用它，用来向
 * compiler 对应的钩子上注册函数
 */


class RunPlugin{
  apply(compiler) {
    //在此插件里可以监听run这个钩子
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('run1:开始编译');
    });
  }
}
module.exports = RunPlugin