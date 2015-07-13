var fs = require('fs');
var irc = require('irc');
var http = require('http');
var bot = require('./bot');
var settings = JSON.parse(fs.readFileSync('settings.json'));

// var INPUT = '~flip ~lenny testing';
// var argArray = INPUT.substring(1).split(' ');
// var comm = argArray[0];
// argArray.splice(0, 1);
// console.log(bot.get(comm, argArray));

bot.help(['emotes']).forEach(function(item) {
  console.log(item);
});
