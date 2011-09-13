/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, exports:false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, util: false, __filename: false, __dirname: false */

/* 
 * RSS Feed Reader Module
 * Copyright 2011 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

var rssee = require('rssee');

function RSSReaderModule(settings) {
  var mod = this,
      queue = [];
  mod.settings = settings;
  mod.routes = [];
  mod.interval = null;
  if(!mod.settings.interval) {
    mod.settings.interval = 15*1000;
  }
  mod.rss = rssee.create({'interval':mod.settings.interval});
  mod.on('article', function(a) {
    queue.push(a);
  });
  mod.intervals = [[ function(cb) {
    var a, title, link;
    while(queue.length !== 0) {
      a = queue.shift();
      title = a.title || 'Untitled';
      link = a.link || '[no link]';
      cb('[rss] ' + title + ' ' + link);
    }
  }, mod.settings.interval]];
}

exports.Module = RSSReaderModule;
