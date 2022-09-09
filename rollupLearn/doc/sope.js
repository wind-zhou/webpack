
/**
 * 作用域类
 */
class Scope {
    constructor(options = {}) {
        this.name = options.name; // 当前作用域的名字
        this.names = options.names || []; // 当前作用域内的变量
        this.parent = options.parent; // 父级作用域
    }
    // 添加变量到当前作用域
    add(name) {
        this.names.push(name)
    }
    // 通过作用域链表由下向上查询变量所在的作用域
    findDefiningScope(name) {
        if (this.names.includes(name)) {
            return this;
        } else if (this.parent) {
            return this.parent.findDefiningScope(name)
        } else {
            return null;
        }
    }
}

// test
var a = 1;
function one() {
    var b = 1;
    function two() {
        var c = 2;
        console.log(a, b, c);
    }
}

// 手动指定作用域链
let globalScope = new Scope({
    name: 'global',
    names: ['a'],
    parent: null
})
let oneScope = new Scope({
    name: 'oneScope',
    names: ['b'],
    parent: globalScope
})
let twoScope = new Scope({
    name: 'twoScope',
    names: ['c'],
    parent: oneScope
})
// debug
console.log(
    twoScope.findDefiningScope('a').name,
    twoScope.findDefiningScope('b').name,
    twoScope.findDefiningScope('c').name,
    twoScope.findDefiningScope('d')
);


