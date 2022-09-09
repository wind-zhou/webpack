
/**
 * walk 函数，用来遍历语法树，深度优先遍历
 * walk 只是一个壳子，核心是visit 函数
 */
function walk(astNode, { enter, leave }) {
    visit(astNode, null, enter, leave)
}

/**
 * @param {*} node 当前的ast 节点
 * @param {*} parent  当前节点的父节点
 * @param {*} enter   进入节点前执行的函数
 * @param {*} leave   离开节点执行的逻辑
 */
function visit(node, parent, enter, leave) {
    if (enter) {
        enter(node, parent);
    }
    // 递归逻辑
    const keys = Object.keys(node).filter(key => typeof node[key] === 'object');
    keys.forEach(key => {
        let value = node[key];
        if (Array.isArray(value)) {
            value.forEach(val => {
                if (val.type) {
                    visit(val, node, enter, leave);
                }
            })
        } else if (value && value.type) {
            visit(value, node, enter, leave)
        }
    });
    if (leave) {
        leave(node, parent)
    }
}

module.exports = walk;