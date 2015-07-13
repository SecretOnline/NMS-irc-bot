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
/**
 * To do when bot recieves a message
 */
function onMessage(nick, to, text, message) {
  // Only operate when ` or ~ is the first character
  if (text.charAt(0) === '`' || text.charAt(0) === '~') {
    // By default, reply to user
    var replyTo = nick;
    // If using ~ from a channel, send back to a channel
    if (text.charAt(0) === '~' && to.charAt(0) === '#')
      replyTo = to;
    // Split into command + array of arguments
    var argArray = text.substring(1).split(' ');
    var comm = argArray[0];
    argArray.splice(0, 1);
    // Array of strings to send
    var replyArray = [];
    /* Special commands */
    // Stop the server (only devs)
    if (comm === 'stop')
      settings.admins.forEach(function(admin) {
        if (nick === admin) {
          this.disconnect('hammer time');
        }
      }, this);
    else {
      // Send all help back to the user, not channel
      if (comm === 'help')
        replyTo = nick;
      // Get text to send
      try {
        replyArray = bot.get(comm, argArray, nick);
      } catch (err) {
        replyArray = [err];
        replyTo = nick;
      }
    }
    // Send array one item at a time
    replyArray.forEach(function(reply) {
      this.say(replyTo, reply);
    }, this);
  }
  // Log all input for debugging purposes
  console.log(nick + ': ' + text);
}
