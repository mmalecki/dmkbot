var irc = require('irc');
var timers = require('timers');

function Bot(settings) {
  this.settings = settings;
  console.log('Connecting to IRC server ' + settings.irc.host + ' with nick ' +
      settings.irc.nick);


  this.irc = new irc.Client(settings.irc.host, settings.irc.nick, {
    channels: settings.irc.channels,
    password: settings.irc.password,
  });
  
  this.modules = [];
  this.intervals = [];
  this.queue = [];

  var obj = this;
  this.irc.on('registered', function() {
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

Bot.prototype.onQueueInterval = function (module) {
  if (this.queue[module].length > 0) {
    var item = this.queue[module][0];
    this.irc.say(item.to, item.message);
    this.queue[module] = this.queue[module].slice(1);
  }
};

Bot.prototype.onDigest = function (module) {
  var self = this;
  var interval = setInterval(function () {
    if (self.queue[module].length > 0) {
      var item = self.queue[module][0];
      self.irc.say(item.to, item.message);
      self.queue[module] = self.queue[module].slice(1);
    }
    else {
      clearInterval(interval);
    }
  }, this.settings.interval);
};

Bot.prototype.onError = function(msg) {
  console.error('Error: %s: %s', msg.command, msg.args.join(' '));
}

Bot.prototype.onMessage = function(from, to, msg) {
  if (route = this.findRoute(msg)) {
    var obj = this;
    route.fun.apply(route.module, [from, msg, args, function(out) {
      obj.queue[route.moduleName].push({to: to, message: out});
    }]);
  }
}

Bot.prototype.onPM = function(from, msg) {
  if (route = this.findRoute(msg)) {
    var obj = this;
    route.fun.apply(route.module, [from, msg, args, function(out) {
      obj.queue[route.moduleName].push({to: from, message: out});
    }]);
  }
}

Bot.prototype.loadModules = function() {
  var self = this;

  for (module in this.settings.modules) {
    var settings = this.settings.modules[module];
    m = require('./modules/' + module).Module;
    this.modules[module] = new m(settings);

    this.queue[module] = [];

    if (settings.__digest) {
      setInterval(
        function (module) { self.onDigest(module); },
        settings.__digest,
        module
      );
    }
    else {
      setInterval(
        function (module) { self.onQueueInterval(module) },
        settings.__interval || this.settings.interval,
        module
      );
    }

    for (var i in this.modules[module].intervals) {
      interval = this.modules[module].intervals[i];

      var module_ = module;
      this.intervals[module] = timers.setInterval(interval[0], interval[1], 
          function(output) {
            self.settings.irc.channels.forEach(function (channel) {
              self.queue[module_].push({to: channel, message: output});
            });
          });
    }
  }
}

Bot.prototype.findRoute = function(msg) {
  if (msg[0] == "!") {
    msg = msg.substr(1);
    for (key in this.modules) {
      module = this.modules[key];
      for (i in module.routes) {
        route = module.routes[i];
        if (args = route[0].exec(msg)) {
          return {
            fun: route[1],
            module: module,
            moduleName: key
          };
        }
      }
    }
  }
}

