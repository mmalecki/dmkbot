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
  this.settings = settings;
  this.reported = {};

  this.format = settings.colors ? "\x02%s\x02 reported by \x16%s\x16: %s" : "*%s* reported by %s: %s";

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
            console.log('Reporting issue ' + issue.number.toString());
            obj.reported[issue.number] = issue.updated_at;
            cb(util.format(obj.format,
                           issue.title,
                           issue.user.login,
                           issue.html_url
                          ));
          }
          else
            console.warn('Issue ' + issue.number.toString() + ' already reported.');
        }
      })
    });
  }, this.settings.interval]];
}

exports.Module = GithubModule;

