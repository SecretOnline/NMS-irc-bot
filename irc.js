var irc = require('irc');
var fs = require('fs');
var https = require('https');

var settings = JSON.parse(fs.readFileSync('settings.json'));
var client = new irc.Client(settings.client.server, settings.client.user, {
  userName: 'secret_bot',
  realName: 'secret_online\'s bot'
});

client.addListener('message', onMessage);
client.addListener('notice', tryLogin);
if (settings.client.pass)
  client.addListener('registered', checkUsername);

process.on('beforeExit', function() {
  client.disconnect('well, we\'re OUT of cake');
});

/**
 * Perform a check to see if the username is already taken
 * If so, message NickServ to ghost back the name
 */
function checkUsername(message) {
  // If the username has been taken, and a new one (with a number on the end) has been assigned
  // try to Ghost the other user
  if (client.nick.match(new RegExp(settings.client.user + '[0-9]+'))) {
    client.say('nickserv', 'ghost ' + settings.client.user + ' ' + settings.client.pass);
  }
}

/**
 * Check if NickServ has sent the right messages
 * Log in, and once logged in, join the channels
 */
function tryLogin(nick, to, text, message) {
  try {
    console.log(nick + ' ' + message.args.join(' '));
    // Log in once NickSev sends the right messages
    if (nick === 'NickServ' && message.args.join(' ').match(/This nickname is registered and protected\./)) {
      client.say('nickserv', 'identify ' + settings.client.pass);
    } else
    // When logged in, join the channels
    if (nick === 'NickServ' && message.args.join(' ').match(/Password accepted/)) {
      settings.client.channels.forEach(function(channel) {
        client.join(channel);
      });
      client.removeListener('notice', tryLogin);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * To do when bot recieves a message
 */
function onMessage(nick, to, text, message) {
  if (nick === client.nick)
    return;

  var forceNotice = true;

  // Only operate when ` or ~ is the first character
  if (text.charAt(0) === '`' || text.charAt(0) === '~') {
    // If using ~ from a channel, send back to a channel
    if (text.charAt(0) === '~' && to.charAt(0) === '#')
      forceNotice = false;

    var toSend = {
      user: nick,
      key: settings.key,
      text: text,
      type: 'text'
    };

    var req = https.request({
      hostname: 'api.secretonline.co',
      port: 443,
      path: '/secretbot/',
      method: 'POST'
    }, function(response) {
      var resBody = '';
      response.on('data', function(data) {
        resBody += data;
      }).on('end', function() {

        function send(obj) {
          if (obj.status === 'success') {
            obj.data.forEach(function(item) {
              console.log(item);
              if (obj.private) {
                client.notice(nick, item);
              } else {
                client.say(to, item);
              }
            });
          }
        }

        var obj = JSON.parse(resBody);
        if (forceNotice) {
          obj.private = true;
        }
        send(obj);
      });
    });
    req.write(JSON.stringify(toSend));
    req.end();
  }
}

/**
 * Get the greetig for the user, if exists
 */
function onJoin(channel, nick, message) {
  var toSend = {
    user: nick,
    type: 'greet'
  };

  var req = https.request({
    hostname: 'api.secretonline.co',
    port: 443,
    path: '/secretbot/',
    method: 'POST'
  }, function(response) {
    var resBody = '';
    response.on('data', function(data) {
      resBody += data;
    }).on('end', function() {

      function send(obj) {
        if (obj.status === 'success') {
          obj.data.forEach(function(item) {
            console.log(item);
            client.say(channel, item);
          });
        }
      }

      var obj = JSON.parse(resBody);
      send(obj);
    });
  });
  req.write(JSON.stringify(toSend));
  req.end();
}
