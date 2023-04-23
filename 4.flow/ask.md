
天空
webpack如何打包不认识的文件呢？ 
比如后缀为 .baxx 的二进制文件？  需要自己写webpack插件嘛？ 

不是写插件，而是写loader
 
lesson
会提示你 找 loader 



会议用户619087
是干什么的插件啊 
爱吃橘子
去除注释的代码 
123
这个main 到底是chunk 还是assets？ 
是chunk ，跟asset没关系
assets是由
 filename:'xxx.js'决定的
 
123
module chunk assets you的能输出，有的是过程的产物或者额组成部分？ 

modules
chunk
asset

点外卖 蛋炒饭
1.买蛋和米饭 modules
2.炒出一盘蛋炒饭 chunk
3.打包成饭盒 asset



21:47
Tony
不是， loader名称也错了 
能
返回字符串不行识别不了吗？ 
123
不能导入导出吧 
隽
可以，但是名字错了 
难忘记nice
内容得变成js才能识别 
会议用户619087
是不是需要配置babel-loader 不用配
能
chunk是打包过程中的概念，assets是输出的资源？可以这么认为 



北极那企鹅丶
引入babel-loader进行ast解析就应该打包失败了 是的
Tony
是不是rm.js 插件删除注释了 是的


只有返回js和json才能被识别？返回string识别不了 
水星
Loader懂了，老师解释下插件吧 



老师,这两个插件调换一下是不是执行顺序也会变呀 




一个是run 一个是done 肯定不会变 
wind-zhou
之前写的是loader插件，靠的是操作AST语法树，现在写的是webpack插件，靠的是调用webpack内置的的钩子？ 
原来写的babel插件，是转换语法树的

Anne
不会 
lesson
类似于生命周期钩子 给写在 上面还是下面 没啥关系吧 
能
那碗 
123
先洗手 
水星
不是都在run里面吗 
wind-zhou
因为钩子的的调用顺序已经内定了，类似于生命周期 
黑子
不会 
天



黑子
compiler.hooks.done 这个是固定的么? 那 hoos的可以都有什么呀 
https://webpack.js.org/api/compiler-hooks/#done

159****6280
跟订阅先后没关系，先走run再走done 
是的
黑子
compiler.hooks.done 这个是固定的么? 那 hoos的key都有什么呀 
https://webpack.js.org/api/compiler-hooks/#done

wind-zhou
1 
lesson
这两个会合并？ 不会
天空
babel和webpack的关系是什么？ 执行顺序是啥？ 
webpack在编译的时候，如果遇到js文件，会调用babel-loader进行文件内容的转换
在babel转换的时候会使用babel插件来转换
水星
Compile 
123
或者说注册 
Tony
babel是通过babel-loader才用的 
123
apply的时候 
shine
好嘞！ 


老师，第一节课里，类型别名那里，
其他的类型是不是都属于program类型？
看到的ast树里面最上层的类型都是program


jialingling
BlockStatement是不是属于program类型哈
不是 
Program代表整个程序，根节点
{}


会议用户619087
编译js的时候，babel-loader是生成一个programmer吗，还是多个
每个JS文件会生成一个AST语法树，每个语法树都对应一个Program 
wind-zhou
不同的解析器转换ast不同，那么针对解析器写的转换插件，是不是也不能兼容呀 
是的
acron 插件和babel插件不兼容




英剑คิดถึง
多入口的应用场景是啥 
做一个网站
后台
前台

Anne
什么场景下有多个entry? 
两个站点

09:56
123
这些plugin 看是在什么时机call 虽然注册是一上来就注册的 
在编译开始的时候都注册了，也就是说都监听了。
但是会在自己合适的时间点触发，或者说执行
类似于生命周期
shine
活动页面不是经常很多个么 一个项目多个活动 每次都是一个新的html 
会议用户619087
为什么不是将plugin挂载到compiler 



shine
webpack中有 
123
但是build的时候不会报错吗？ 
shine
如果过程中有错误呢？ 
ZhangLe
怎么没看到loader的处理？ 
shine




爱吃橘子
能不能别问这些加快节奏的问题 
北极那企鹅丶
compiler 对象包含了 webpack 环境所有的配置信息，包括 options、loaders、plugins 这些信息，这个对象在 webpack 启动的时候被实例化，它是全局唯一的，可以简单地把它理解为 webpack 实例。

compilation 对象代表了一次资源版本的构建。它包含了当前的模块资源(modules)、编译生成资源(asset files)、变化的文件(files)、以及被跟踪依赖的状态信息(fileDependencies)等。当 webpack 以开发模式运行时，每当检测到一个变化，一次新的 compilation 将被创建。compilation 对象也提供了很多事件回调供插件做扩展。通过 compilation 也可以读取到 compiler 对象。

tapable 是 webpack 的一个核心工具，它暴露了 tap、tapAsync、tapPromise 方法，可以使用这些方法来触发 compiler 钩子，使得插件可以监听 webpack 在运行过程中广播的事件，然后通过 compiler 对象去操作 webpack。我们也可以使用这些方法注入自定义的构建步骤，这些步骤将在整个编译过程中的不同时机触发。 
10:15
丁浩宇
监听file有什么作用 
123
fs。watch 看到fileDependency 变化就执行后面的函数是 fs。watch 是fs 内置的？ 
 是的

赵丽文
this.hooks.done.call()是干什么用的 
触发done这个钩子

老师 deps的变化会导致整个依赖链路上的内容都重新编译吗？还是只编译变化部分？ 
如果有文件变化的话，会重新开始编译 
在webpack5以前，全部会重新编译，比较慢，cache hardsource dllplugin
webpack5以后，内置这些缓存机制 


10:24
lesson撤回了一条消息
123撤回了一条消息
会议用户619087
面试的时候问过，浏览器缓存怎么做 
123
.hbs 是啥文件呢？ 
handlebar的模板文件
插件语法，和vue类似
{{age}}



cache 在开发的时候，更改文件也会走缓存吗？ 
肯定会的
一个插件，提升webpack 80%构建速度 
HardSourcePlugin
shine撤回了一条消息
好大鸭
打印一下stats  
123
file是最终产物？是的 
bundle



123撤回了一条消息
123
这个肯定不是用来 查找文件路径的，不然不区分系统是找不到文件的 
不区分也可以找到文件
window / \都可以找到文件






袖珍汤锅
要区分是相对路径还是 node_modules 里 
123
不是相对路径就是第三方 
123
相当于entry1 
lgx
不能根据.判断是不是第三方模块吧 
只要相对路径  
./
../

11:35
shine
老师 这里如果一个模块被多个模块引入了是不是就要判断好多次？为什么不做个缓存 cache 
会的
shine
开销小，没必要吗？ 
123撤回了一条消息
123撤回了一条消息
123撤回了一条消息
北极那企鹅丶
还有import导入吧 
123
import 是判断 ImportDeclaration 吧？ 
xxx
改参数是干啥 
shine
names 这里还是有点小懵，其实就是 依赖模块的moduleId? 
不是的
张仁阳
http://www.zhufengpeixun.com/strong/html/103.7.webpack-plugin.html#t217.4%20AutoExternalPlugin 




jialingling
用相对路径做moduleID是用来干什么哈，是不是用绝对路径也可以，只是没有必要 
这是规范
绝对路径肯定是不行的不好
绝对路径里会包含开发者硬盘信息，会泄露隐私

shine
嗷嗷  1111 
没离开过
node.arguments[0] 那里不太懂，赋值作用是为了什么 
为了修改参数，所有引入模块的地方都用相对于根目录的相对路径，也就是模块ID
因为在modules里模块定义的名称就是模块ID

shine
能 
123
name 是此模块被谁 依赖了？ ./title  被entry1 以来了 
可以这么认为

此模块被 哪个入口依赖了。此依赖可能是直接的，也可以间接的
 
入口会决定代码块chunk的名称

123撤回了一条消息
123
如果 title 被entry1引入了 也被entry2 引入了 那么 name 就是【entry1 和entry2】 
是
如果是不被入口文件依赖，而是依赖文件之间的依赖，也只记录入口文件这个name是吧 
是的
我爸入口 name 姓



123
fileDependencies 用 set 处理过打印完看着 怎么还跟数组一样呢？ 
123
手写webpack。这个是否就能应对 webpack的所有面试题呢 
请说一下webpack的工作流程

老师早上讲的版本有没有包括递归获取依赖文件里面再依赖其他文件哈 

正则加载loader里面如果省略扩展名 