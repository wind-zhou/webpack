
class Hook {

    constructor(args = []) {
        debugger
        this.args = args; // 形参
        this.taps = [];
        this.call = CALL_DELEGATE;

    }
    //如果是通过tap注册的回调，那么类型type=sync,表示fn要以同步的方式调用
    tap(options, fn) {
        this._tap('sync', options, fn)
    }

    _tap(type, options, fn) {
        if (typeof options === 'string') {
            options = { name: options }
        }
        const tapInfo = { ...options, type, fn };
        this._insert(tapInfo)
    }


    // 将注册的回调放进taps 数组
    _insert(tapInfo) {
        let i = this.taps.length;
        this.taps[i] = tapInfo;
    }

    _createCall(type) {
        return this.compile({
            taps: this.taps,
            args: this.args,
            type
        });
    }
}

// 通过代理的方式进行懒编译
const CALL_DELEGATE = function (...args) {
    this.call = this._createCall('sync');
    return this.call(...args)
}


module.exports = Hook;