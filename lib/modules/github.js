var https = require("https"),
    util = require("util");

// Return the ISO 8601 format 
// Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Example.3a_ISO_8601_formatted_dates
function ISODateString(d){
 var pad = function(n) { return n < 10 ? '0' + n : n };
 return d.getUTCFullYear() + '-'
      + pad(d.getUTCMonth() + 1) + '-'
      + pad(d.getUTCDate()) + 'T'
      + pad(d.getUTCHours()) + ':'
      + pad(d.getUTCMinutes()) + ':'
      + pad(d.getUTCSeconds()) + 'Z'
}

function GithubModule(settings) {
  var self = this;

  this.settings = settings;
  this._repos = settings.repos;
  this.reported = {};
  settings.repos.forEach(function (repo) {
    self.reported[repo] = {};
  });

  this.format = settings.colors ? "\x02%s:\x02 %s: %s - %s" : "%s: %s: %s - %s";

  this.intervals = [[ function(cb) {
    self.settings.repos.forEach(function (repo) {
      self.getForRepo(repo, cb);
    });
  }, this.settings.interval]];
  this.routes = [
    [/^killitwithfire/, function () {
      console.log('KILL IT WITH FIRE!');
      self.settings.repos = [];
    }],
    [/^resurrection/, function () {
      console.log('Resurrection!');
      self.settings.repos = self._repos;
    }]
  ];
}

exports.Module = GithubModule;

GithubModule.prototype.getForRepo = function (repo, cb) {
  var obj = this;

  var d = new Date();
  options = {
    host: "api.github.com",
    path: '/repos/' + repo +  '/issues?since=' + ISODateString(d)
  };

  https.get(options, function(res) {
    var data = "";
    res.on('data', function(chunk) {
      data = data + chunk;
    });
    res.on('end', function() {
      data = JSON.parse(data);
      for (var i = 0; i < data.length; i++) {
        issue = data[i];
        if (!(issue.number in obj.reported) || obj.reported[issue.number] != issue.updated_at) {
          console.log('Reporting issue ' + issue.number.toString());
          obj.reported[issue.number] = issue.updated_at;
          cb(util.format(obj.format,
                         repo,
                         issue.user.login,
                         issue.title,
                         issue.html_url
                        ));
        }
        else
          console.warn('Issue ' + issue.number.toString() + ' already reported.');
      }
    })
  });
}

