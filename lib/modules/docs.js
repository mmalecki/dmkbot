function PingModule(settings) {
  this.settings = settings;
  this.routes = [
    [/doc link ([a-z]+)#([a-zA-Z]+)/, this.onLink]
  ]
}

exports.Module = PingModule;

PingModule.prototype.onLink = function(from, command, args) {
  anchor = args[1] + '.' + args[2];
  return 'http://nodejs.org/docs/v0.5.4/api/' + args[1] + '.html#' + anchor
}

