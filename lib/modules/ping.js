function PingModule(settings) {
  this.settings = settings;
}

exports.Module = PingModule;

PingModule.prototype.onCommand = function(from, command) {
  return from + ', ' + command;
}

