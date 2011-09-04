var vm = require('vm');

var code = unescape('%s');

var modules = {crypto: 1, util: 1, events: 1, url: 1, assert: 1, vm: 1};
var context = {
  require: function (module) {
    if (module in modules) {
      return modules[module];
    }
    throw new Error("Cannot find module '" + module + "'");
  },
  setTimeout: setTimeout,
  setInterval: setInterval,
  clearTimeout: clearTimeout,
  clearInterval: clearInterval,
  console: console
};

for (module in modules) {
  modules[module] = require(module);
  context[module] = modules[module];
}

console.log(vm.runInNewContext(code, context));

