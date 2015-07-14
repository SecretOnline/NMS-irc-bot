var fs = require('fs');
var irc = require('irc');
var bot = require('./bot');
var settings = JSON.parse(fs.readFileSync('settings.json'));

bot.get('report', ['an', 'error', 'message', 'man\'s ', 'sky'], 'command line test').forEach(function(item) {
  console.log(item);
});
