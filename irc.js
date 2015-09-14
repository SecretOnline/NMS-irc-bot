var irc = require('irc');
var fs = require('fs');
var hotload = require('hotload');
var bot = hotload('./bot.js');

var settings = JSON.parse(fs.readFileSync('settings.json'));
var clients = [];

settings.clients.forEach(function(client) {
  var newClient = new irc.Client(client.server, client.user, {
    userName: 'secret_bot',
    realName: 'secret_online\'s bot'
  });

  newClient.addListener('message', onMessage);
  newClient.addListener('join', onJoin);
  newClient.addListener('notice', tryLogin);
  if (client.pass)
    newClient.addListener('registered', checkUsername);

  newClient.clientSettings = client;
  newClient.clientAdmins = settings.admins;

  clients.push(newClient);
});

readConsole();

process.on('beforeExit', function() {
  clients.forEach(function(aBot) {
    aBot.disconnect('well, we\'re OUT of cake');
  });
});

/**
 * Perform a check to see if the username is already taken
 * If so, message NickServ to ghost back the name
 */
function checkUsername(message) {
  // If the username has been taken, and a new one (with a number on the end) has been assigned
  // try to Ghost the other user
  if (this.nick.match(new RegExp(this.clientSettings.user + '[0-9]+'))) {
    this.say('nickserv', 'ghost ' + this.clientSettings.user + ' ' + this.clientSettings.pass);
  }
}

/**
 * Check if NickServ has sent the right messages
 * Log in, and once logged in, join the channels
 */
function tryLogin(nick, to, text, message) {
  try {
    botLog(nick + ' ' + message.args.join(' '));
    // Log in once NickSev sends the right messages
    if (nick === 'NickServ' && message.args.join(' ').match(/This nickname is registered and protected\./)) {
      this.say('nickserv', 'identify ' + this.clientSettings.pass);
    } else
    // When logged in, join the channels
    if (nick === 'NickServ' && message.args.join(' ').match(/Password accepted/)) {
      this.clientSettings.channels.forEach(function(channel) {
        this.join(channel);
      }, this);
      this.removeListener('notice', tryLogin);
    }
  } catch (err) {
    botLog(err);
  }
}

/**
 * To do when bot recieves a message
 */
function onMessage(nick, to, text, message) {
  if (nick === 'Gunter')
    addToGunterLog(message.args[1]);
  var bold, italics, underline;
  if (text.indexOf('\x02') > -1) {
    text = text.replace(/[\x02]/g, '');
    bold = true;
  }
  if (text.indexOf('\x1D') > -1) {
    text = text.replace(/[\x1D]/g, '');
    italics = true;
  }
  if (text.indexOf('\x1F') > -1) {
    text = text.replace(/[\x1F]/g, '');
    underline = true;
  }
  // Only operate when ` or ~ is the first character
  if (text.charAt(0) === '`' || text.charAt(0) === '~') {
    // By default, reply to user
    var replyTo = nick;
    // If using ~ from a channel, send back to a channel
    if (text.charAt(0) === '~' && to.charAt(0) === '#')
      replyTo = to;
    // Split into command + array of arguments
    var argArray = text.split(' ');
    var comm = argArray[0].substring(1);
    // Array of strings to send
    var replyArray = [];
    // Send all help back to the user, not channel
    if (comm === 'help' || comm === 'report')
      replyTo = nick;
    // Get text to send
    try {
      replyArray = bot.getText(argArray, nick, replyTo, settings.admins);
    } catch (err) {
      replyArray = [err, 'this error has been logged'];
      replyTo = nick;
      addToReportLog([err.message, message.args.splice(1).join(' ')], nick, true);
    }
    // Send array one item at a time
    replyArray.forEach(function(reply) {
      botLog(reply);
      if (bold)
        reply = '\x02' + reply;
      if (italics)
        reply = '\x1D' + reply;
      if (underline)
        reply = '\x1F' + reply;
      this.say(replyTo, reply);
    }, this);
  }
  // Log all input for debugging purposes
  botLog(nick + ': ' + text);
}

/**
 * To do when bot recieves a message
 */
function onJoin(channel, nick, message) {
  var replyArray;
  if (nick === 'Trentosaurus') {
    replyArray = ['Trent\'s here!', 'raise your ' + bot.emotes['dongers']];
  }

  if (replyArray)
    replyArray.forEach(function(reply) {
      this.say(channel, reply);
    }, this);

  botLog(nick + ' joined ' + channel);
}

/**
 * Add message array to log
 */
function addToReportLog(messageArray, from, isCrash) {
  var fs = require('fs');
  var reports;
  try {
    reports = JSON.parse(fs.readFileSync('reports.json'));
  } catch (err) {
    reports = [];
  }
  var dateString = new Date(Date.now()).toISOString();
  var newReport = {
    'from': from,
    'at': dateString,
    'messages': messageArray,
    'type': 'user report'
  };
  if (isCrash)
    newReport.type = 'crash';
  reports.push(newReport);
  fs.writeFileSync('reports.json', JSON.stringify(reports, null, 2));
}

/**
 * Add message array to log
 */
function addToGunterLog(message) {
  var fs = require('fs');
  var reports;
  try {
    reports = JSON.parse(fs.readFileSync('gunter.json'));
  } catch (err) {
    reports = [];
  }
  reports.push(message);
  fs.writeFileSync('gunter.json', JSON.stringify(reports, null, 2));
}

function botLog(text) {
  console.log(new Date(Date.now()).toLocaleTimeString() + ': ' + text);
}

function readConsole() {
  var readline = require('readline');
  var rl = readline.createInterface(process.stdin, process.stdout);
  rl.setPrompt('');
  rl.prompt();
  rl.on('line', function(line) {
    if (line.match(/(^\?$|^help$)/))
      console.log('\r\nHelp\r\n' +
        'exit    (x): Stop bot\r\n' +
        'reload (r): Reload the bot\r\n' +
        'help    (?): Show this message again\r\n'
      );
    else if (line.match(/(^x$|^exit$)/)) {
      clients.forEach(function(aBot) {
        aBot.disconnect('well, we\'re OUT of cake');
      });
      rl.close();
    } else
    if (line.match(/^r(ebuild)?$/))
      updateBot();
    else
      console.log('Unknown command. Type \'help\' to see available commands');
    rl.prompt();
  }).on('close', function() {
    process.exit(0);
  });
}
