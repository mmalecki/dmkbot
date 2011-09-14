# dmkbot
Copyright (C) 2011 by Maciej Małecki and contributors (see [AUTHORS.md](https://github.com/mmalecki/dmkbot/blob/master/AUTHORS.md)).  
MIT License (see LICENSE file)

dmkbot is a simple, extensible bot written for #node.js channel.
For example module, see [lib/modules/ping.js](https://github.com/mmalecki/dmkbot/blob/master/lib/modules/ping.js>)

You may try it out by setting up an IRC server on your local machine and running node bot.js.
Configuration file is [config/environment.js](https://github.com/mmalecki/dmkbot/blob/master/config/environment.js>)

## Modules API
This is a simple module which responds to a ping command and says "Hello" every 3 seconds:

    function PingModule(settings) {
      this.settings = settings;
      this.routes = [
        [/ping/, this.onPing]
      ];
      this.intervals = [ [ function(cb) { 
        cb("Hello!"); 
      }, 3000 ] ];
    }

    exports.Module = PingModule;

    PingModule.prototype.onPing = function(from, command, args, callback) {
      callback(from + ', pong');
    }

To run this module, put it in [lib/modules](https://github.com/mmalecki/dmkbot/tree/master/lib/modules) 
directory, and add an entry in [config/environment.js](https://github.com/mmalecki/dmkbot/blob/master/config/environment.js>) 
file (simply add an value to `modules` hash, this value will be passed as `settings` argument to your module).

