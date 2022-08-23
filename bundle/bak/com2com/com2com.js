/**存储所有模块的一个 modules 对象（以路径映射的方式---使用路径是为了配合 require 查找） */
var __webpack_modules__ = {
    "./src/play.js": (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
      let title = __webpack_require__("./src/title.js");
      const act = 'ball';
      console.log('我是ball', act);
      console.log('ball 里面的title：', title.age);
    },
    "./src/title.js": (__unused_webpack_module, exports) => {
      exports.name = "title_name"; // 将导出数据 挂载到了 modules 对象的export 属性上
      exports.age = "title_age"; // 将导出数据 挂载到了 modules 对象的export 属性上
      console.log('我是title'); // 代码执行
    }
  };
  
  /** 
   * node 的require 函数 
   * 根据 moduleId （路径） 找到对应模块
   **/
  function __webpack_require__(moduleId) {
    var module = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  /** 这个是入口index.js */
  (() => {
    let title = __webpack_require__("./src/title.js"); // 这里拿到的其实 是 export 属性
    let play = __webpack_require__("./src/play.js");
    let age = 25;
    console.log(age);
    console.log(title.name);
    console.log(title.age);
  })();