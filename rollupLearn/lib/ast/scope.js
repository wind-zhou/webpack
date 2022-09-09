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


module.exports = Scope;
