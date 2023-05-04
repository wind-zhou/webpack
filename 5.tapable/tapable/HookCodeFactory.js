
class HookCodeFactory {

    setUp(hookInstance, options) {
        hookInstance._x = options.taps.map(tapInfo => tapInfo.fn);
    }

    // 初始化 用于临时挂载一些后面编译会用到的参数
    init(options) {
        this.options = options;
    }

    args(config = {}) {
        let allArgs = [...this.options.args]
        return allArgs.join(',')

    }

    header() {
        let code = ``;
        code += `var _x = this._x;\n`;
        return code;
    }

    create(options) {
        this.init(options);
        let fn;

        switch (options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.header() + this.content()
                )
                break;

            default:
                break;
        }
        return fn;
    }

    callTapSeries() {
        let code = '';
        for (let j = 0; j < this.options.taps.length; j++) {
            const tapContent = this.callTap(j);
            code += tapContent;
        }
        return code;
    }

    callTap(tapIndex, options = {}) {
        const { onDone } = options;
        let code = ``;
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;//取出回调函数
        let tapInfo = this.options.taps[tapIndex];
        switch (tapInfo.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;//执行回调函数
                if (onDone) code += onDone();
                break;
            case 'async':
                code += `_fn${tapIndex}(${this.args()}, function () {
                  if (--_counter === 0) _done();
                });\n`;//执行回调函数
                break;
            case 'promise':
                code += `
              var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
              _promise${tapIndex}.then(function () {
                if (--_counter === 0) _done();
              });
              `;
                break;
        }
        return code;

    }

}

module.exports = HookCodeFactory;