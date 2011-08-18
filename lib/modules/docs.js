function PingModule(settings) {
  this.settings = settings;
  this.routes = [
    [/doc link ([a-z]+)#([a-zA-Z]+)( (v[0-9]+\.[0-9]+\.[0-9]+))?/, this.onLink]
  ]
}

exports.Module = PingModule;

PingModule.prototype.onLink = function(from, command, args) {
  anchor = args[1] + '.' + args[2];
  v = args[4] || 'v0.5.4';
  return 'http://nodejs.org/docs/' + v + '/api/' + args[1] + '.html#' + anchor
}

