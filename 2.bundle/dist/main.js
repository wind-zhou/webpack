(() => {
  var webpackModules = {
    "./src/title.js": module => {
      console.log('周正');
      module.exports = {
        name: "title_name",
        age: "title_age"
      };
    }
  };
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = webpackModuleCache[moduleId] = {
      exports: {}
    };
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  (() => {
    webpackRequire.n = module => {
      var getter = module && module.esmodule ? () => module['default'] : () => module;
      webpackRequire.d(getter, {
        a: getter
      });
      return getter;
    };
  })();
  (() => {
    webpackRequire.d = (exports, definition) => {
      for (var key in definition) {
        if (webpackRequire.o(definition, key) && !webpackRequire.o(exports, key)) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
        }
      }
    };
  })();
  (() => {
    webpackRequire.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    webpackRequire.r = exports => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
      }
      Object.defineProperty(exports, 'esmodule', {
        value: true
      });
    };
  })();
  var webpackExports = {};
  (() => {
    "use strict";
    webpackRequire.r(webpackExports);
    var _titlewebpackImportedModule0 = webpackRequire("./src/title.js");
    var _titlewebpackImportedModule0_Default = webpackRequire.n(_titlewebpackImportedModule0);
    console.log(_titlewebpackImportedModule0_Default());
    console.log(_titlewebpackImportedModule0.age);
  })();
})();