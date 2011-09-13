/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, exports: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, util: false, __filename: false, __dirname: false, unescape:false */

var vm = require('vm'),
    code = unescape('%s'),
    modules = {crypto: 1, events: 1, url: 1, assert: 1},
    context = {
      require: function (mod) {
        if (mod in modules) {
          return modules[mod];
        }
        throw new Error("Cannot find module '" + mod + "'");
      },
      setTimeout: setTimeout,
      setInterval: setInterval,
      clearTimeout: clearTimeout,
      clearInterval: clearInterval,
      console: console
    },
    mod;

for (mod in modules) { if(modules.hasOwnProperty(mod)) {
  modules[mod] = require(mod);
  context[mod] = modules[mod];
}}

console.log(vm.runInNewContext(code, context));
