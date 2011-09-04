var fs = require('fs'),
    util = require('util'),
    spawn = require('child_process').spawn;

function EvalModule(settings) {
  this.settings = settings;
  this.settings.prefix = this.settings.prefix || '/tmp/';
  this.settings.timeout = this.settings.timeout || 5000;
  this.routes = [
    [/^eval (.+)/, this.onEval]
  ]
}

exports.Module = EvalModule;

EvalModule.fileName = function (from) {
  return 'dmkbot-' + (new Date()).getTime().toString() + '-' +
    encodeURIComponent(from) + '-' + Math.random().toString() + '.js';
}

EvalModule.prototype.onEval = function(from, command, args, callback) {
  // This function uses eval-jail.js script, puts code in it, copies it to
  // prefix directory (usually /tmp) and executes.
  var self = this;

  var code = args[1];
  console.log(from + " requested evaluation of '" + code + "'");
  fs.readFile(__dirname + '/eval-jail.js', 'utf-8', function (err, data) {
    if (err) {
      console.log(err);
      return callback('Something went terribly wrong (cannot read jail script)');
    }
    data = util.format(data, escape(code));
    var fileName = self.settings.prefix + EvalModule.fileName(from);
    fs.writeFile(fileName, data, function (err) {
      if (err) {
        console.error(err);
        return callback('Something went terribly wrong (cannot write jail script)');
      }

      var node = spawn('node', [fileName]);

      setTimeout(function () {
        callback('Timeout.');
        node.kill();
      }, self.settings.timeout);

      var splitter = function (data) {
        data.toString().split("\n").filter(
          function (d) { return d != ""; }).forEach(callback);
        // data would be outputed with empty line at the end, so we filter it
      };

      node.stdout.on('data', splitter);
      if (self.settings.stderr) {
        node.stderr.on('data', splitter);
      }
      node.on('exit', function (code) {
        if (code) {
          callback('Process exited with ' + code);
        }
        node.stdin.end();
      });
    });
  });
}

