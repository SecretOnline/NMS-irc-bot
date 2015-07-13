var fs = require('fs');
var irc = require('irc');
var http = require('http');
var hotload = require('hotload');
var bot = hotload('./bot.js');
var settings = JSON.parse(fs.readFileSync('settings.json'));
var clients = [];
settings.clients.forEach(function(client) {
  var newClient = new irc.Client(client.server, settings.user, {
    userName: 'secret_bot',
    realName: 'secret_online\'s bot',
    channels: client.channels
  });
  newClient.addListener('message', onMessage);
  clients.push(newClient);
});

function onMessage(nick, to, text, message) {
  if (text.charAt(0) === '`' || text.charAt(0) === '~') {
    var replyTo = nick;
    if (text.charAt(0) === '~' && to.charAt(0) === '#')
      replyTo = to;
    var argArray = text.substring(1).split(' ');
    var comm = argArray[0];
    argArray.splice(0, 1);

    var replyArray = [];

    if (comm === 'stop')
      settings.admins.forEach(function(admin) {
        if (nick === admin) {
          this.disconnect('hammer time');
        }
      }, this);
    else {
      if (comm === 'help')
        replyTo = nick;
      try {
        replyArray = bot.get(comm, argArray, nick);
      } catch (err) {
        replyArray = [err];
        replyTo = nick;
      }
    }
    console.log(replyTo);
    replyArray.forEach(function(reply) {
      this.say(replyTo, reply);
    }, this);
  }
  console.log(nick + ': ' + text);
}
