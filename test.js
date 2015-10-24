var fs = require('fs');
var reload = require('require-reload')(require);
var bot = reload('./bot.js');

var settings = JSON.parse(fs.readFileSync('settings.json'));
readConsole();

function reloadBot() {
  try {

    bot = reload('./bot.js');
    bot.externalFunctions = {
      //'addToReportLog': addToReportLog,
      'reloadBot': reloadBot,
      'isAdmin': isAdmin,
      'cb': settings.cleverbot
    };
  } catch (e) {
    addToReportLog(['failed to reload'], 'bot', false);
  }
}

function isAdmin(nick) {
  return true;
}

function sendArray(arr, replyTo, settings) {
  // Send array one item at a time
  arr.forEach(function(reply) {
    console.log(reply);
  });
}


function readConsole() {
  var readline = require('readline');
  var rl = readline.createInterface(process.stdin, process.stdout);
  rl.setPrompt('> ');
  rl.prompt();
  rl.on('line', function(line) {
    var argArray = line.split(' ');
    bot.getText(argArray, {
      from: 'nick',
      to: 'replyTo',
      callback: sendArray,
      callbackNotice: sendArray,
      sendSettings: {}
    }, true);
    rl.prompt();
  }).on('close', function() {
    process.exit(0);
  });
}
