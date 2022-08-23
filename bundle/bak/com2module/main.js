var __webpack_modules__ = {
  "./src/title.js": (__unused_webpack_module, exports) => {
    exports.name = "title_name";
    exports.age = "title_age";
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
var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
console.log(_title__WEBPACK_IMPORTED_MODULE_0__);