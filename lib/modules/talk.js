/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, exports:false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, util: false, __filename: false, __dirname: false */

/* Writes each line from a file to the channel. One line every N intervals. This 
 * was invented for test channel to help development and test IRC client.
 * Copyright 2011 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

function TalkModule(settings) {
  this.settings = settings;
  this.routes = [];
  this.settings.lines = this.settings.lines || [];
  this.current = 0;
	
  this.enabled = false;
  this.interval = null;
	
  var obj = this,
      current_line = 0;
  this.intervals = [[ function(cb) {
    require('fs').readFile(obj.settings.file, 'utf-8', function(err, data) {
      if(err) {
        console.error('Error: ' + err);
        return;
      }
      var lines = data.split('\n'),
          line = lines[current_line];
      if(!line) {
        current_line = 0;
        return;
      }
      cb('[' + current_line + '/' + lines.length + '] ' + line);
      current_line += 1;
      if(current_line >= lines.length) {
        current_line = 0;
      }
    });
  }, this.settings.interval || 15*1000]];
}

exports.Module = TalkModule;
