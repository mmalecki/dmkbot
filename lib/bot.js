/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, exports: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, util: false, __filename: false, __dirname: false */

var irc = require('irc'),
    timers = require('timers');

function Bot(settings) {
  this.settings = settings;
  console.log('Connecting to IRC server ' + settings.irc.host + ' with nick ' + settings.irc.nick);


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
    console.log('Registered to server');
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
  if (this.queue[mod].length > 0) {
    var item = this.queue[mod][0];
    this.irc.say(item.to, item.message);
    this.queue[mod] = this.queue[mod].slice(1);
  }
};

Bot.prototype.onDigest = function (mod) {
  var self = this,
      item,
      interval = setInterval(function () {
    if (self.queue[mod].length > 0) {
      item = self.queue[mod][0];
      self.irc.say(item.to, item.message);
      self.queue[mod] = self.queue[mod].slice(1);
    }
    else {
      clearInterval(interval);
    }
  }, this.settings.interval);
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
      module_,
      m,
      interval;

  for (mod in this.settings.modules) { if(this.settings.modules.hasOwnProperty(mod)) {
    settings = this.settings.modules[mod];
    m = require('./modules/' + mod).Module;
    this.modules[mod] = new m(settings);

    this.queue[mod] = [];

    if (settings.__digest) {
      setInterval(
        function (mod) { self.onDigest(mod); },
        settings.__digest,
        mod
      );
    }
    else {
      setInterval(
        function (mod) { self.onQueueInterval(mod); },
        settings.__interval || this.settings.interval,
        mod
      );
    }

    for (i in this.modules[mod].intervals) { if(this.modules[mod].intervals.hasOwnProperty(i)) {
      interval = this.modules[mod].intervals[i];

      module_ = mod;
      this.intervals[mod] = timers.setInterval(interval[0], interval[1], 
          function(output) {
            self.settings.irc.channels.forEach(function (channel) {
              self.queue[module_].push({to: channel, message: output});
            });
          });
    }}
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

