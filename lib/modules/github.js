function GithubModule(settings) {
  this.settings = settings;
  this.routes = [
    [/github/, this.onGithub]
  ];
  this.intervals = [[ function(cb){
    cb("Hello Github!");
  },3000]];
}

exports.Module = GithubModule;

GithubModule.prototype.onGithub = function(from, command, args, callback) {
  callback(from + ', git');
}
