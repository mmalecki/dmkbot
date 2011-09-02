var Settings = require('settings');
var bot = require('./lib/bot.js');

var file = __dirname + '/config/ice-environment.js';
var settings = new Settings(file).getEnvironment('development');

b = new bot.Bot(settings);
