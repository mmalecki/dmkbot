var Settings = require('settings');
var bot = require('./lib/bot.js');

var file = __dirname + '/config/environment.js';
var settings = new Settings(file).getEnvironment('development');
console.log(settings);

b = new bot.Bot(settings);

