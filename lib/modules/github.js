https = require("https");

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
  this.settings = settings;
  this.reported = {};

  var obj = this;
  this.intervals = [[ function(cb) {
    var d = new Date();
    options = {
      host: "api.github.com",
      path: '/repos/' + settings.repo +  '/issues?since=' + ISODateString(d)
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
            obj.reported[issue.number] = issue.updated_at;
            msg = "*" + issue.title + "* reported by " + issue.user.login + ": " + issue.html_url;
            cb(msg);
          }
          else
            console.warn('Issue ' + issue.number.toString() + ' already reported.');
        }
      })
    });
  }, this.settings.interval]];
}

exports.Module = GithubModule;

