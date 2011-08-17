var irc = require('irc');

function Bot(settings) {
  this.settings = settings;
  console.log('Connecting to IRC server ' + settings.irc.host + ' with nick ' +
      settings.irc.nick);


  this.irc = new irc.Client(settings.irc.host, settings.irc.nick, {
    channels: [settings.irc.channel],
  });
  
  var obj = this;
  this.irc.on('error', obj.onError);
}

exports.Bot = Bot;

Bot.prototype.onError = function(msg) {
  console.error('Error: %s: %s', msg.command, msg.args.join(' '));
}

