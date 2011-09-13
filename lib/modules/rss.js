/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, exports:false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, __filename: false, __dirname: false */

/* 
 * RSS Feed Reader Module
 * Copyright 2011 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

var rssee = require('rssee'),
    util = require('util');

function RSSReaderModule(settings) {
  var mod = this,
      queue = [],
      f,
      feed_url,
      rss;
  mod.settings = settings || {};
  mod.routes = [];
  mod.interval = null;
  if(!mod.settings.interval) {
    mod.settings.interval = 15*1000;
  }
  mod.feeds = [];
  function queue_push(a) {
    if(settings.debug) {
      util.log('[rss] Received new article, adding it to the queue.');
    }
    queue.push(a);
  }
  for(f in mod.settings.feeds) {
    if(mod.settings.feeds.hasOwnProperty(f)) {
      feed_url = mod.settings.feeds[f];
      rss = rssee.create({'interval':mod.settings.interval/1000});
      mod.feeds.push(rss);
      rss.on('article', queue_push);
      if(settings.debug) {
        util.log('[rss] Watching now: ' + mod.settings.url + ' (with interval=' + mod.settings.interval + ')');
      }
      rss.start(feed_url);
    }
  }
  mod.intervals = [[ function(cb) {
    if(settings.debug) {
      util.log('[rss] Queue has ' + queue.length + ' items.'+ ((queue.length!==0) ? ' Loading it now.' : '') );
    }
    var a, title, link;
    do {
      a = queue.shift();
      if(a) {
        title = a.title || 'Untitled';
        link = a.link || '[no link]';
        cb('[rss] ' + title + ' - ' + link);
      }
    } while(a);
  }, mod.settings.interval]];
}

exports.Module = RSSReaderModule;
