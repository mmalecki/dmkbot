/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, exports: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, util: false, __filename: false, __dirname: false */

var argv = require('optimist').argv,
    Settings = require('settings'),
    bot = require('./lib/bot.js'),
    path = require('path'),
    file = path.resolve(argv.config || __dirname + '/config/environment.js'),
    bot_env = argv.env || 'development',
    settings = new Settings(file).getEnvironment(bot_env),
    b = new bot.Bot(settings);
