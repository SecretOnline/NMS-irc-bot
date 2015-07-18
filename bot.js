var irc = require('irc');

/**
 * Define Bot object
 */
var Bot = function(client, admins) {
  // Create an IRC client
  irc.Client.call(this, client.server, client.user, {
    'userName': client.user,
    'realName': client.realName,
    'autoConnect': 0
  });

  this.clientSettings = client;
  this.clientAdmins = admins;
  // Event listeners
  this.addListener('message', onMessage);
  this.addListener('join', onJoin);
  this.addListener('registered', checkUsername);
  this.addListener('notice', tryLogin);
  // Connect the bot to the server once rest of constructor is done
  this.connect();
};

// Extend the irc.Client prototype
Bot.prototype = Object.create(irc.Client.prototype, {
  getText: {
    value: getText,
    enumerable: true,
    configurable: true,
    writable: true
  },
  addToReportLog: {
    value: addToReportLog,
    enumerable: true,
    configurable: true,
    writable: true
  },
  onMessage: {
    value: onMessage,
    enumerable: true,
    configurable: true,
    writable: true
  },
  onJoin: {
    value: onJoin,
    enumerable: true,
    configurable: true,
    writable: true
  },
  flipTable: {
    value: flipTable,
    enumerable: true,
    configurable: true,
    writable: true
  }
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
    console.log(message.args.join(' '));
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
    var argArray = text.split(' ');
    var comm = argArray[0];
    // Array of strings to send
    var replyArray = [];
    // Send all help back to the user, not channel
    if (comm === 'help' || comm === 'report')
      replyTo = nick;
    // Get text to send
    try {
      replyArray = this.getText(argArray, nick, replyTo);
    } catch (err) {
      replyArray = [err, 'this error has been logged'];
      replyTo = nick;
      this.addToReportLog([err.message, message.args.splice(1).join(' ')], nick, true);
    }
    // Send array one item at a time
    replyArray.forEach(function(reply) {
      this.say(replyTo, reply);
    }, this);
  }
  // Log all input for debugging purposes
  console.log(nick + ': ' + text);
}

/**
 * To do when bot recieves a message
 */
function onJoin(channel, nick, message) {
  var replyArray;
  if (nick === 'Trentosaurus') {
    replyArray = ['Trent\'s here!', 'raise your ' + emotes['dongers']];
  } else if (nick === 'secret_online') {
    console.log('it works!');
  }

  if (replyArray)
    replyArray.forEach(function(reply) {
      this.say(channel, reply);
    }, this);

  console.log(nick + ' joined ' + channel);
}

/**
 * Returns an array of strings to send
 */
function getText(args, from, to) {
  // Split into command + arguments for that command
  var comm = args.splice(0, 1)[0].substring(1);
  var returnArray = [];
  // Stop the bot, but only if admin
  if (comm === 'stop') {
    if (isAdmin(from))
      this.disconnect('hammer time');
  } else
  // Say, but only if admin
  if (comm === 'say') {
    var rValue = '';
    if (isAdmin(from))
      rValue = processText(args, from, to);
    returnArray.push(rValue);
  } else
  // Get help
  if (comm === 'help')
    return getHelp(args);
  // Bot source
  else if (comm === 'source') {
    returnArray.push('https://github.com/SecretOnline/NMS-irc-bot/ ' + processText(args, from, to));
  } else
  // Flip words
  if (comm === 'flip') {
    // Add to return array
    returnArray.push(flip(processText(args, from, to)));
  } else
  // Wikipedia links
  if (comm === 'wiki') {
    var url = 'https://en.wikipedia.org/wiki/';
    if (args.length > 0)
      url += toTitleCase(processText(args, from, to));
    else
      url += 'Main_Page';
    url = url.replace(/ /g, '_');
    url = encodeURI(url);
    url = url.replace(/'/g, '%27');
    returnArray.push(url);
  } else
  // Google links
  if (comm === 'google') {
    var url = 'https://www.google.com/';
    if (args.length > 0)
      url += 'search?q=' + processText(args, from, to);
    url = url.replace(/ /g, '+');
    url = encodeURI(url);
    url = url.replace(/'/g, '%27');
    returnArray.push(url);
  } else
  // Let me Google that for you
  if (comm === 'lmgtfy') {
    var url = 'http://lmgtfy.com/';
    if (args.length > 0)
      url += '?q=' + processText(args, from, to);
    url = url.replace(/ /g, '+');
    url = encodeURI(url);
    url = url.replace(/'/g, '%27');
    returnArray.push(url);
  } else
  // Kickstart trivia
  if (comm === 'ks') {
    returnArray.push('.trivia kickstart ' + processText(args, from, to));
  } else
  // NMS FAQ
  if (comm === 'faq') {
    returnArray.push('https://www.reddit.com/r/NoMansSkyTheGame/wiki/faq ' + processText(args, from, to));
  } else
  // Release
  if (comm === 'release') {
    var result = 'Really Soon ™';
    var showCountdown = true;

    if (args.length) {
      returnArray.push('Estimated release of ' + processText(args, from, to) + ':');
      args.forEach(function(arg) {
        if (emotes[arg.substring(1)])
          result = 'Right Now ™';
      });
      showCountdown = false;
    } else
      returnArray.push('Estimated release of No Man\'s Sky: ');
    returnArray.push(result);
    if (showCountdown)
      returnArray.push('(when we have a date, go to ~countdown for a, well, countdown)');
  } else
  // Release
  if (comm === 'countdown') {
    returnArray.push('http://secretonline.github.io/NMS-Countdown');
  } else
  // Release
  if (comm === 'hint') {
    returnArray.push('what. you think i know the answer? ' + processText(args, from, to));
  } else
  // REPORT
  if (comm === 'report') {
    addToReportLog([processText(args, from, to)], from);
    returnArray.push('your error has been logged. Thanks ' + from, to);
  } else
  // A joke, for devinup
  if (comm === 'generate') {
    returnArray.push('generating universe');
    var numEmotes = Math.floor(Math.random() * 3) + 2;
    for (var j = 0; j < numEmotes; j++)
      returnArray.push(emotes[Object.keys(emotes)[Math.floor(Math.random() * Object.keys(emotes).length)]]);
    returnArray.push('generation complete');
  } else
  // Get the meme link
  if (comm === 'meme') {
    if (args[0] && memes[args[0]]) {
      returnArray.push(getMeme(args[0]));
    }
  } else
  // Emotes
  if (emotes[comm]) {
    returnArray.push(getEmote(comm) + ' ' + processText(args, from, to));
  } else
    return ['invalid command: \'' + comm + '\'. please try again'];
  return returnArray;
}

function processText(words, from, to) {
  var str = '';

  for (var i = 0; i < words.length; i++) {
    // Add a space between words
    if (i > 0)
      str += ' ';
    // If it's a command
    if (words[i].charAt(0) === '~' || words[i].charAt(0) === '`') {
      // Split into new arguments
      var newArgs = words.splice(i);
      // Get the result, and add it on
      var newString = getText(newArgs, from, to).join(' ');
      str += newString;
      break;
    } else
    // Just add the string
      str += words[i];
  }

  return str;
}

function isAdmin(name) {
  var ret = false;
  this.clientAdmins.forEach(function(admin) {
    if (name === admin) {
      ret = true;
    }
  });
  return ret;
}

/**
 * Quick title case
 */
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Emotes
 */
function getEmote(key) {
  return emotes[key] || key;
}
var emotes = {
  'ayy': '☜(ﾟヮﾟ☜)',
  'converge': '(つ°ヮ°)つ',
  'dance': '〜(^∇^〜）（〜^∇^)〜',
  'deal': '( •_•) ( •_•)>⌐■-■ (⌐■_■)',
  'DEAL': '( ಠ益ಠ) ( ಠ益ಠ)>⌐■-■ (⌐■益■)',
  'undeal': '(⌐■_■) ( •_•)>⌐■-■ ( •_•)',
  'derp': '◖|◔◡◉|◗',
  'disapprove': 'ಠ_ಠ',
  'disapprovedance': '┌( ಠ_ಠ)┘',
  'dongers': 'ヽ༼ຈل͜ຈ༽ﾉ',
  'dongers?': '┌༼◉ل͟◉༽┐',
  'dongersmob': 'ヽ༼ຈل͜ຈヽ༼ຈل͜ຈヽ༼ຈل͜ຈヽ༼ຈل͜ຈ༽ﾉل͜ຈ༽ﾉل͜ຈ༽ﾉل͜ຈ༽ﾉ',
  'fliptable': '(╯°□°)╯︵ ┻━┻',
  'FLIPTABLE': '(ノಠ益ಠ)ノ彡┻━┻',
  'flipdouble': '┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻',
  'unfliptable': '┬──┬ ノ( ゜-゜ノ)',
  'UNFLIPTABLE': '┬──┬ ノ(゜益゜ノ)',
  'fliptable?': '┬──┬ ︵ /(.□. \\)',
  'fu': 'ಠ︵ಠ凸',
  'lenny': '( ͡° ͜ʖ ͡°)',
  'lennymob': '( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ͡°) ͜ʖ ͡°)ʖ ͡°)ʖ ͡°)',
  'lennymoney': '[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]',
  'lennywall': '┬┴┬┴┤( ͡° ͜ʖ├┬┴┬┴',
  'lennywink': '( ͡~ ͜ʖ ͡°)',
  'lenny?': '( ͠° ͟ʖ ͡°)',
  'mindblow': 'http://i.imgur.com/8pTSVjV.gif',
  'orly': '﴾͡๏̯͡๏﴿ O\'RLY?',
  'rage': 'ლ(ಠ益ಠლ)',
  'robot': '╘[◉﹃◉]╕',
  'shrug': '¯\\_(ツ)_/¯',
  'squid': '<コ:彡',
  'throwglitter': '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
  'wat': 'ಠ▃ಠ',
  'whyy': 'щ(ಥДಥщ)',
  'woo': '\\o/',
  'whattheshrug': '﻿¯\\(ºдಠ)/¯',
  'zoidberg': '(\\/) (°,,°) (\\/)'
};

/**
 * May-mays
 */
function getMeme(key) {
  return memes[key] || key;
}
var memes = {
  'cage': 'http://i.imgur.com/5EBfpq3.png',
  'confess': 'http://i.imgur.com/BDRyxoG.jpg',
  'everywhere': 'http://i.imgur.com/9PyNjXc.png',
  'picard': 'http://i.imgur.com/CXra35Y.jpg',
  'doublepicard': 'http://i.imgur.com/vzyuVHI.png',
  'picardwhy': 'http://i.imgur.com/v4Ewvxz.png',
  'joker': 'http://i.imgur.com/sLJSLnF.png'
};

/**
 * Flipping
 */
function flip(aString) {
  var last = aString.length - 1;
  var result = new Array(aString.length);
  for (var i = last; i >= 0; --i) {
    var c = aString.charAt(i);
    var r = flipTable[c];
    result[last - i] = r !== undefined ? r : c;
  }
  return result.join('');
}
var flipTable = {
  a: '\u0250',
  b: 'q',
  c: '\u0254',
  d: 'p',
  e: '\u01DD',
  f: '\u025F',
  g: '\u0183',
  h: '\u0265',
  i: '\u0131',
  j: '\u027E',
  k: '\u029E',
  l: '\u05DF',
  m: '\u026F',
  n: 'u',
  r: '\u0279',
  t: '\u0287',
  v: '\u028C',
  w: '\u028D',
  y: '\u028E',
  '.': '\u02D9',
  '[': ']',
  '(': ')',
  '{': '}',
  '?': '\u00BF',
  '!': '\u00A1',
  "\'": ',',
  '<': '>',
  '_': '\u203E',
  '"': '\u201E',
  '\\': '\\',
  ';': '\u061B',
  '\u203F': '\u2040',
  '\u2045': '\u2046',
  '\u2234': '\u2235',
  'A': '∀',
  'B': '\u029A',
  'C': '\u0186',
  'D': '\u2C6D',
  'E': '\u018E',
  //'F': '',
  //'G': '',
  //'J': '',
  //'K': '',
  'L': '\u2510',
  'M': 'W',
  'P': '\u0500',
  //'Q': '',
  'R': '\u1D1A',
  'T': '\u2534',
  'U': '\u2229',
  'V': '\u039B',
  'Y': '\u03BB',
  '（': '）'
};
for (var i in flipTable) {
  flipTable[flipTable[i]] = i;
}

/**
 * Help
 */
function getHelp(helpArgs) {
  // If no number specified, make it 1
  if (helpArgs.length === 0)
    helpArgs.push('1');
  // If no other arg, show main help
  if (helpArgs[0].match(/^[0-9]+$/) && helpArgs[0] <= mainHelp.length)
    return mainHelp[helpArgs[0] - 1];
  // Now we're past that, if there's no number, add 1
  if (helpArgs.length === 1)
    helpArgs.push('1');
  // If it's flip help
  if (helpArgs[0] === 'flip')
    if (helpArgs[1].match(/^[0-9]+$/) && helpArgs[1] <= flipHelp.length)
      return flipHelp[helpArgs[0] - 1];
    else
      return flipHelp[0];
    // If it's wiki help
  else if (helpArgs[0] === 'wiki')
    if (helpArgs[1].match(/^[0-9]+$/) && helpArgs[1] <= wikiHelp.length)
      return wikiHelp[helpArgs[0] - 1];
    else
      return wikiHelp[0];
    // If it's emote listing
  else if (helpArgs[0] === 'emotes')
    return ['list of emotes', 'type \'~[emote name]\' to use', ' '].concat(Object.keys(emotes));
  // Meme listing
  else if (helpArgs[0] === 'memes')
    return ['list of memes', 'type \'~meme [meme name]\' to use', ' '].concat(Object.keys(memes));
  return ['Unknown help argument'];
}

var mainHelp = [
  [
    'secret_bot help',
    'page 1 of 2',
    'commands can use either \'`\' or \'~\'',
    '` commands are replied to you in a private message (may change)',
    '~ commands are replied to the channel they were sent to',
    'EXCEPTION: all help commands are sent via pm',
    'commands can be sent to the bot via pm or in a channel',
    'type \'`help 2\' (or \'~help 2\') to see a list of commands'
  ],
  [
    'page 2 of 2',
    '[emote name]: show unicode emote. \'help emotes\' to see a list',
    'faq: link to the /r/NoMansSkyTheGame faq',
    'flip [text to flip]: flip it and reverse it.',
    'ks: print \'.trivia kickstart\'',
    'wiki [page]: link to a page of wikipedia',
    'meme [meme name]: link to a meme. \'help memes\' to see a list',
    'report [description of error]: write an error report',
    'say [text to say]: make secret_bot say some text',
    'source: link to the source code of the bot'
  ]
];
var flipHelp = [
  [
    'flip',
    'this command will flip any text upside down',
    '(not all characters work just yet. soon(tm))',
    'the flip command supports emote injection',
    'example usage:',
    '~flip example text',
    '~flip ~dance'
  ]
];
var wikiHelp = [
  [
    'wiki',
    'this command simply links to a wikipedia page',
    'it performs no checks to see if the link is to',
    'a valid page or not.',
    'the wiki command supports emote injection',
    'example usage:',
    '~wiki no man\'s sky',
    '~wiki ~lenny'
  ]
];

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

module.exports = {
  getText: getText,
  processText: processText,
  onMessage: onMessage,
  addToReportLog: addToReportLog,
  Bot: Bot
};
