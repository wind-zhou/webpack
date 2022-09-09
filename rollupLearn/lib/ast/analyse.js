
/**
 * @dscription 语法树分析函数
 * 主要功能：
 * - 分析导入导出
 * - 分析模块内定义那些变量、依赖了哪些变量
 * - 构建作用域链
 * 分析结束后，会讲结果挂载到module 实例相应的属性上
 * @param {*} ast 
 */

const walk = require('./walk');
const Scope = require('./scope');

function analyse(ast, code, module) {
    /*
     * 1、第一步：分析当前模块导入【import】和导出【exports】模块，将引入的模块和导出的模块存储起来
     * this.imports = {};//存放着当前模块所有的导入
     * this.exports = {};//存放着当前模块所有的导出
     */
    ast.body.forEach(statement => {
        if (statement.type === 'ImportDeclaration') {
            let source = statement.source.value;// 导入来源路径 './title';
            statement.specifiers.forEach(specifier => {
                let importName = specifier.imported.name; // 导入的变量名字
                let localName = specifier.local.name; // 本模块存储的变量名字
                module.imports[localName] = { source, importName }; // 存储到 module 属性中
            })
        } else if (statement.type === 'ExportNamedDeclaration') {
            const declaration = statement.declaration;
            if (declaration && declaration.type === 'VariableDeclaration') {
                const declarations = declaration.declarations;
                declaration.forEach(variableDeclarator => {
                    const localName = variableDeclarator.id.name;
                    const exportName = localName;//age age
                    module.exports[exportName] = { localName }
                })
            }
        }
    });

    /**
     * 2、 第二步：分析出 模块中 依赖了那些变量 和 定义了那些变量  （并且还要知道他们是全局变量还是局部变量）
     * 找到_defines 和 _dependsOn
     * - _defines 存放当前模块定义的所有的全局变量
     * - _dependsOn 当前模块没有定义但是使用到的变量，也就是依赖的外部变量
     */

    let currentScope = new Scope({ name: '顶级作用域' }); // 创建一个 scope 用于便利时构建作用域链
    ast.body.forEach(statement => {

        /**
         * 向当前作用域中添加变量
         * @param {*} name 
         */
        function addToScope(name) {
            currentScope.add(name);
            /** 
             * 之前一直不理解分析依赖了那些变量为啥还要构建个作用域链
             * 现在才明白，是为了标识各个变量的位置，因为我们只关心顶级变量（全局变量），
             * 只有构建了作用域链我们才知道当前变量是不是 在顶级作用域（全局作用域）
             **/
            if (!currentScope.parent) { // 若不存在父级作用域，则说明是顶级作用域，这个这个变量是顶级变量，需要存一下
                statement._defines[name] = true;
                //此顶级变量的定义语句就是这条语句
                module.definitions[name] = statement;
            }
        }

        // 给【节点】加一些基本信息
        Object.defineProperties(statement, {
            _defines: { value: {} },//存放当前模块定义的所有的全局变量
            _dependsOn: { value: {} },//当前模块没有定义但是使用到的变量，也就是依赖的外部变量
            _included: { value: false, writable: true },//此语句是否已经 被包含到打包结果中了
            _source: { value: code.snip(statement.start, statement.end) }
        });

        walk(statement, {
            enter(node) {
                // 依赖变量分析
                if (node.type === 'Identifier') {
                    statement._dependsOn[node.name] = true;
                }

                let newScope;
                // 作用域链构建（在这个过程中会手机所有的定义变量）
                switch (node.type) {
                    case 'FunctionDeclaration':
                        // 将当前的函数加到 当前作用域中
                        addToScope(node.id.name)
                        // 如果是函数函数声明，则会创建一个新的作用域
                        newScope = new Scope({
                            name: node.id.name,
                            parent: node,
                            names: node.params.map(param => param.name)
                        })
                        break;
                    case 'VariableDeclaration': // 变量声明
                        node.declarations.forEach(declaration => {
                            addToScope(declaration.id.name);
                        });
                }
                if (newScope) {
                    // 如果创建了新的作用域，则更改当前作用域指针
                    currentScope = newScope;
                    // 在节点上 对象上打个标，标识当前节点属于一个新的作用域，后面会对这个标进行识别
                    Object.defineProperty(node, '_scope', { value: newScope });
                }
            },
            //如果当前节点有有_scope,说明它前节点创建了一个新的作用域，离开此节点的时候，要退出到父作用域
            leave(node) {
                if (Object.prototype.hasOwnProperty(node, '_scope')) {
                    currentScope = currentScope.parent;
                }
            }
        })

    })
}
module.exports = analyse;