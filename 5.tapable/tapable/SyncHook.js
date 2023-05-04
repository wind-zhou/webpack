
const Hook = require('./Hook')
const HookCodeFactory = require('./HookCodeFactory')

class SyncHookCodeFactory extends HookCodeFactory {
    content() {
        return this.callTapSeries()
    }
}

const factory = new SyncHookCodeFactory();

/**
 * SyncHook 继承自 Hook 
 * Hook 上有一些基础的方法
 */
class SyncHook extends Hook {

    compile(options) {
        // 往 this 上挂载_X 属性，属性的值是tap 注册的回调函数
        factory.setUp(this,options);
        return factory.create(options);
    }
}
module.exports = SyncHook