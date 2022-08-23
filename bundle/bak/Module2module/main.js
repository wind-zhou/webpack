"use strict";
var __webpack_modules__ = {
  "./src/title.js": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__); // 打标
    __webpack_require__.d(__webpack_exports__, { // 定义getter 函数
      "age": () => age,
      "default": () => __WEBPACK_DEFAULT_EXPORT__,
      "name": () => name
    });
    const name = "title_name";
    const age = "title_age";
    const hobby = 'title_hobby';
    const __WEBPACK_DEFAULT_EXPORT__ = hobby;
    console.log('我是title');
  }
};


function __webpack_require__(moduleId) {
  var module = {
    exports: {}
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

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

__webpack_require__.r = exports => {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: 'Module'
    });
  }
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
};

var __webpack_exports__ = {};

__webpack_require__.r(__webpack_exports__);
var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
console.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"], _title__WEBPACK_IMPORTED_MODULE_0__.age, _title__WEBPACK_IMPORTED_MODULE_0__.name);