var fs = require('fs');
var hotload = require('hotload');
var bot = hotload('./bot.js');

var settings = JSON.parse(fs.readFileSync('settings.json'));
var clients = [];

settings.clients.forEach(function(client) {
  var newBot = new bot.Bot(client, settings.admins);
  clients.push(newBot);
});
