var fs = require('fs');
var hotload = require('hotload');
var bot = hotload('./bot.js');

fs.watch('./bot.js', function(event, filename) {
  updateBot();
});

// I don't like this as a way of hotloading,
// but after the big refactor, the old way
// broke slightly.
function updateBot() {
  console.log('updating bot');
  clients.forEach(function(client) {
    client.getText = bot.getText;
    client.onMessage = bot.onMessage;
    client.processText = bot.processText;
    client.addToReportLog = bot.addToReportLog;
  });
}

var settings = JSON.parse(fs.readFileSync('settings.json'));
var clients = [];

settings.clients.forEach(function(client) {
  var newBot = new bot.Bot(client, settings.admins);
  clients.push(newBot);
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
