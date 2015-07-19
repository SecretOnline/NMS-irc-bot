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

  newClient.addListener('message', bot.onMessage);
  newClient.addListener('join', bot.onJoin);
  newClient.addListener('registered', bot.checkUsername);
  newClient.addListener('notice', bot.tryLogin);

  newClient.clientSettings = client;
  newClient.clientAdmins = settings.admins;

  clients.push(newClient);
});

readConsole();

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
        aBot.disconnect('stop; hammer time');
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
