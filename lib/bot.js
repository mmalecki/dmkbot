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

  setInterval(function () {
    if (obj.queue.length > 0) {
      var item = obj.queue[0];
      console.log("saying '" + item[1] + "' to " + item[0]);
      obj.irc.say.apply(obj.irc, item);
      obj.queue = obj.queue.slice(1);
    }
  }, settings.interval);
}

exports.Bot = Bot;

Bot.prototype.onError = function(msg) {
  console.error('Error: %s: %s', msg.command, msg.args.join(' '));
}

Bot.prototype.onMessage = function(from, to, msg) {
  if (route = this.findRoute(msg)) {
    obj = this;
    route.fun.apply(route.module, [from, msg, args, function(out) {
      obj.queue.push([to, out]);
    }]);
  }
}

Bot.prototype.onPM = function(from, msg) {
  if (route = this.findRoute(msg)) {
    obj = this;
    route.fun.apply(route.module, [from, msg, args, function(out) {
      obj.queue.push([from, out]);
    }]);
  }
}

Bot.prototype.loadModules = function() {
  for (module in this.settings.modules) {
    m = require('./modules/' + module).Module;
    this.modules[module] = new m(this.settings.modules[module]);

    for (var i in this.modules[module].intervals) {
      interval = this.modules[module].intervals[i];

      obj = this;
      this.intervals[module] = timers.setInterval(interval[0], interval[1], 
          function(output) {
            for (channel in obj.settings.irc.channels) {
              obj.irc.say(obj.settings.irc.channels[channel], output);
            }
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
            module: module
          };
        }
      }
    }
  }
}

