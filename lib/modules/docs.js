function DocsModule(settings) {
  this.settings = settings;
  this.routes = [
    [/doc link ([a-z]+)#([a-zA-Z]+)( (v[0-9]+\.[0-9]+\.[0-9]+))?/, this.onLink]
  ]
}

exports.Module = DocsModule;

DocsModule.prototype.onLink = function(from, command, args, callback) {
  anchor = args[1] + '.' + args[2];
  v = args[4] || 'latest';
  callback('http://nodejs.org/docs/' + v + '/api/' + args[1] + '.html#' + anchor);
}

