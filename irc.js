var fs = require('fs');
var irc = require('irc');
var hotload = require('hotload');
var bot = hotload('./bot.js');
var settings = JSON.parse(fs.readFileSync('settings.json'));
var clients = [];
settings.clients.forEach(function(client) {
  var newClient = new irc.Client(client.server, settings.user, {
    userName: 'secret_bot',
    realName: 'secret_online\'s bot'
  });
  newClient.addListener('message', onMessage);
  newClient.addListener('registered', checkUsername);
  newClient.addListener('notice', tryLogin);
  clients.push(newClient);
});

function checkUsername(message) {
  // If the username has been taken, and a new one (with a number on the end) has been assigned
  // try to Ghost the other user
  if (this.nick.match(new RegExp(settings.user + '[0-9]+'))) {
    this.say('nickserv', 'ghost ' + settings.user + ' ' + settings.pass);
  }
}

function tryLogin(nick, to, text, message) {
  try {
    console.log(message.args.join(' '));
    // Log in once NickSev sends the right messages
    if (nick === 'NickServ' && message.args.join(' ').match(/This nickname is registered and protected\./)) {
      console.log('SUCCESS');
      this.say('nickserv', 'identify ' + settings.pass);
    } else
    // When logged in, join the channels
    if (nick === 'NickServ' && message.args.join(' ').match(/Password accepted/)) {
      settings.clients[clients.indexOf(this)].channels.forEach(function(channel) {
        this.join(channel);
      }, this);
      this.removeListener('notice', tryLogin);
    }
  } catch (err) {
    console.log(err);
  }
}
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
      if (comm === 'help' || comm === 'report')
        replyTo = nick;
      // Get text to send
      try {
        replyArray = bot.get(comm, argArray, nick);
      } catch (err) {
        replyArray = [err, 'this error has been logged'];
        replyTo = nick;
        bot.error([err.name, err.message, message], nick, true);
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
