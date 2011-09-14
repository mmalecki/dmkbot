/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, exports:false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, util: false, __filename: false, __dirname: false */

function PingModule(settings) {
  this.settings = settings;
  this.routes = [
    [/^ping/, this.onPing]
  ];
}

exports.Module = PingModule;

PingModule.prototype.onPing = function(from, command, args, callback) {
  callback(from + ', pong');
};
