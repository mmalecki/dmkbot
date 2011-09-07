/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, util: false, __filename: false, __dirname: false */

http = require('http');

function UpModule(settings) {
  this.settings = settings;
  this.routes = [
    [/^up\? ([a-zA-Z0-9\.]+)/, this.onUp]
  ]
}

exports.Module = UpModule;

UpModule.prototype.onUp = function(from, command, args, callback) {
  var opt = {
    host: args[1],
    port: 80, // TODO
    method: 'HEAD'
  };
  http.get(opt, function(res) {
    callback(from + ", host up (status code: " + res.statusCode.toString() + ")");
  }).on('error', function(e) {
    callback(from + ", host may be down (error: " + e.message + ")");
  });
}

