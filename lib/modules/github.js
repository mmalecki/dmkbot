https = require("https");

// Return the ISO 8601 format 
// Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Example.3a_ISO_8601_formatted_dates
function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
}

function GithubModule(settings) {
  this.settings = settings;
  this.routes = [
    [/github/, this.onGithub]
  ];

  // Created new date instance for the first time running
  // Set the time to midnight...
  var d = new Date();
  d.setUTCHours(0,0,0,0);
  var since = ISODateString(d);
  this.intervals = [[ function(cb){
    // console.log(since);
    options = {
      host:"api.github.com",
      path:'/repos/joyent/node/issues?since='+since
    };
    // Storing the current time. This time will be used
    // to pase in request next time
    since = ISODateString(new Date());
    https.get(options,function(res){
      data = "";
      res.on('data',function(d){
        data = data + d;
      });
      res.on('end',function(){
        data = JSON.parse(data);
        for(var i=0;i<data.length;i++){
          issue = data[i];
          msg = issue.title + " reported by " + issue.user.login + " : " + issue.html_url; 
          cb(msg);
        }
      })
    });
  },this.settings.interval]];
}

exports.Module = GithubModule;

/*
GithubModule.prototype.onGithub = function(from, command, args, callback) {
  callback(from + ', git');
}
*/
