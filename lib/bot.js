/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, exports: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, __filename: false, __dirname: false */

var irc = require('irc'),
    util = require('util'),
    timers = require('timers');

function Bot(settings) {
  this.settings = settings;
  util.log('Connecting to IRC server ' + settings.irc.host + ' with nick ' + settings.irc.nick);


  this.irc = new irc.Client(settings.irc.host, settings.irc.nick, {
    channels: settings.irc.channels,
    password: settings.irc.password
  });
  
  this.modules = [];
  this.intervals = [];
  this.queue = [];
  this.registered = false;
  this.settings.registerTimeout = this.settings.registerTimeout || 16000;

  var obj = this;

  setTimeout(function () {
    if (!obj.registered) {
      console.error('Timeout, quitting.');
      process.exit(1);
    }
  }, this.settings.registerTimeout);

  this.irc.on('registered', function() {
    obj.registered = true;
    util.log('Registered to server');
    obj.loadModules();
  });
  this.irc.on('error', function(e) { 
    obj.onError(e);
  });
  this.irc.on('message', function(from, to, msg) { 
    obj.onMessage(from, to, msg); 
  });
  this.irc.on('pm', function(from, msg) {
    obj.onPM(from, msg);
  });
}

exports.Bot = Bot;

Bot.prototype.onQueueInterval = function (mod) {
  var item = this.queue[mod].shift();
  if(item) {
    this.irc.say(item.to, item.message);
  }
};

Bot.prototype.onDigest = function (mod) {
  var self = this,
      interval = setInterval(function () {
        var item = self.queue[mod].shift();
        if(item) {
          self.irc.say(item.to, item.message);
        }
        else {
          clearInterval(interval);
          util.log('[debug] cleared digest interval');
        }
      }, this.settings.interval);
	util.log('[debug] digest interval created with ' + this.settings.interval);
};

Bot.prototype.onError = function(msg) {
  console.error('Error: %s: %s', msg.command, msg.args.join(' '));
};

Bot.prototype.onMessage = function(from, to, msg) {
  var route = this.findRoute(msg), 
      obj = this;
  if (route) {
    route.fun.apply(route.module, [from, msg, msg.args, function(out) {
      obj.queue[route.moduleName].push({to: to, message: out});
    }]);
  }
};

Bot.prototype.onPM = function(from, msg) {
  var route = this.findRoute(msg),
      obj = this;
  if (route) {
    route.fun.apply(route.module, [from, msg, msg.args, function(out) {
      obj.queue[route.moduleName].push({to: from, message: out});
    }]);
  }
};

Bot.prototype.loadModules = function(){
  var self = this,
      mod,
      settings,
      i,
      m;

  function on_digest(mod) { self.onDigest(mod); }
  function on_queue_interval(mod) { self.onQueueInterval(mod); }

  function timers_setinterval(module_, timers, interval) {
    return timers.setInterval(interval[0], interval[1], function(output) {
      self.settings.irc.channels.forEach(function (channel) {
        self.queue[module_].push({to: channel, message: output});
      });
    });
  }

  for (mod in this.settings.modules) { if(this.settings.modules.hasOwnProperty(mod)) {
    settings = this.settings.modules[mod];
    m = require('./modules/' + mod).Module;
    this.modules[mod] = new m(settings);

    this.queue[mod] = [];

    if (settings.__digest) {
      setInterval(
        on_digest,
        settings.__digest,
        mod
      );
      util.log('[debug] digest interval created with ' + settings.__digest + ' interval');
    }
    else {
      setInterval(
        on_queue_interval,
        settings.__interval || this.settings.interval,
        mod
      );
      util.log('[debug] queue interval created with ' + (settings.__interval || this.settings.interval) + ' interval');
    }

    for (i in this.modules[mod].intervals) {
      if(this.modules[mod].intervals.hasOwnProperty(i)) {
        this.intervals[mod] = timers_setinterval(mod, timers, this.modules[mod].intervals[i]);
      }
    }
  }}
};

Bot.prototype.findRoute = function(msg) {
  var route, mod, key, i, args;
  if (msg[0] === "!") {
    msg = msg.substr(1);
    for (key in this.modules) { if(this.modules.hasOwnProperty(key)){
      mod = this.modules[key];
      for (i in mod.routes) { if(mod.routes.hasOwnProperty(i)){
        route = mod.routes[i];
        args = route[0].exec(msg);
        if (args) {
          return {
            fun: route[1],
            mod: mod,
            moduleName: key
          };
        }
      }}
    }}
  }
};

