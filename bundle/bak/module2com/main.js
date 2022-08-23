var __webpack_modules__ = {
  /** play commonJS 模块 */
  "./src/play.js": (__unused_webpack_module, exports) => {
    exports.play = 'hahah';
    console.log('I am Play');
  },

  /** title ES6 moudle 模块 */
  "./src/title.js": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__); //给  ES module  模块打标
    __webpack_require__.d(__webpack_exports__, { //  在export 对象上注册取值的 getter函数 
      "age": () => age,
      "default": () => __WEBPACK_DEFAULT_EXPORT__,
      "name": () => name
    });
    const name = "title_name";
    const age = "title_age";
    const __WEBPACK_DEFAULT_EXPORT__ = hobby = 'title_hobby';
    consol.log('我是title');
  }
};



/** require 函数 */
function __webpack_require__(moduleId) {
  var module = {
    exports: {}
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__); // 作用：将模块内的导出参数拿到  【区别就在于 common 和 ESmoudle 的取值方式不一样】
  return module.exports;
}


/**  在export 对象上注册取值的 getter函数 */
__webpack_require__.d = (exports, definition) => {
  for (var key in definition) {
    if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      });
    }
  }
};

__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

/** r函数 作用：给ES module 的原型上打上标记 （标识为ES module ） */
__webpack_require__.r = exports => {
  Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
  });
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
};


/** index 入口 */
let title = __webpack_require__("./src/title.js");
let play = __webpack_require__("./src/play.js");
console.log(play);
console.log(title);
console.log(title.age);

/**
 * 这里可以看出 
 * common 和ESmodule 的导出方式不一样
 * common 在到处是直接将值得拷贝 挂载到了export上
 * ESmodule 则是定义了一个getter函数，这样把输出值和模块内的值耦合了起来，可以理解为输出了一个引用
 */