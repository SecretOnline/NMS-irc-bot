var fs = require('fs');

var aliases = JSON.parse(fs.readFileSync('aliases.json'));


/**
 * Returns an array of strings to send
 */
function getText(args, obj, doCallback) {
  // Split into command + arguments for that command
  var comm = args.splice(0, 1)[0].substring(1);
  var reply = [];
  var replyType = 'normal';
  obj.f = this.externalFunctions;

  if (functions[comm]) {
    if (typeof functions[comm] === 'function')
      reply = functions[comm](args, obj);
    else if (typeof functions[comm] === 'object')
      if (functions[comm].perm && functions[comm].perm > obj.perm) {
        reply.push('insufficient permissions');
        replyType = 'notice';
      } else {
        if (functions[comm].async) {
          functions[comm].f(args, obj);
          return;
        } else {
          if (functions[comm].replyType)
            replyType = functions[comm].replyType;
          reply = functions[comm].f(args, obj);
        }
      }
  } else if (emotes[comm])
    reply.push(emotes[comm] + ' ' + processText(args, obj));
  else if (aliases[comm]) {
    if (aliases[comm].indexOf('{args}') > -1)
      reply.push(aliases[comm].replace(/{args}/g, processText(args, obj)));
    else
      reply.push(aliases[comm] + ' ' + processText(args, obj));
  } else {
    reply.push('invalid command \'' + comm + '\'');
    replyType = 'notice';
  }

  if (doCallback) {
    if (replyType === 'normal')
      obj.callback(reply, obj.to, obj.sendSettings);
    else if (replyType === 'notice')
      obj.callbackNotice(reply, obj.from, obj.sendSettings);
    return;
  } else
    return reply;
}

function getWelcome(nick) {
  var replyArray = [];
  if (nick === 'Trentosaurus') {
    replyArray.push('Trent\'s here!', 'raise your ' + emotes.dongers);
  } else if (nick === 'Hipolipolopigus') {
    replyArray.push('a wild hipolipolopigus appeared o/');
  } else if (nick === 'secret_online') {
    replyArray.push('oh, hello owner');
  } else if (nick === 'Gunter') {
    replyArray.push('hi gunter');
  } else if (nick === 'Doctor_Colossus') {
    replyArray.push('what\'s up, doc?');
  } else if (nick === 'Alvv') {
    replyArray.push('it\'s alvv! put your hands up \\o/');
  } else if (nick === 'trkmstrwggy' || nick === 'trkmstrwggy_mbl') {
    replyArray.push('wlm bak t th hnnl, trk!');
  } else if (nick === 'Toofifty') {
    replyArray.push('too, atlas is broke again... :P');
  } else if (nick === 'Snappin') {
    replyArray.push('hi snappin, \'~realbest ~hype train\'');
  } else if (nick === 'StuartFulcher') {
    replyArray.push('if you hadn\'t put so much pressure on me, i might have made a greeting for you');
  }
  return replyArray;
}

function processText(words, obj) {
  var str = '';

  var retIndex = words.indexOf('~return');
  if (retIndex > -1) {
    words.splice(retIndex);
  }

  var breakIndex = words.indexOf('~break');
  if (breakIndex > -1) {

    var second = words.splice(breakIndex + 1, words.length); // second arg doesn't matter, as it'll just take all the end elements
    words.splice(breakIndex, 1);

    str = processText(words, obj) + ' ' + processText(second, obj);

    return str;
  }

  for (var i = 0; i < words.length; i++) {
    // Add a space between words
    if (i > 0)
      str += ' ';
    // If it's a command
    if (words[i].charAt(0) === '~' || words[i].charAt(0) === '`') {
      // Split into new arguments
      var newArgs = words.splice(i);
      // Get the result, and add it on
      var newString = getText(newArgs, obj).join(' ');
      str += newString;
      break;
    } else
    // Just add the string
      str += words[i];
  }

  return str;
}

function processPerms(args, obj) {
  var reply = [];
  var perms;
  try {
    perms = JSON.parse(fs.readFileSync('perms.json'));
  } catch (err) {
    perms = {};
  }
  perms[args[0]] = args[1];
  fs.writeFileSync('perms.json', JSON.stringify(perms, null, 2));
  reply.push(args[0] + '\'s permission level set to ' + args[1]);
  return reply;
}

var helpHelp = [
  'secret_bot help',
  '`~help commands` - list of commands',
  '`~help emotes` - list of emotes',
  '`~help aliases` - list of aliases (basic commands)',
  'bot version: something',
  'contact secret_online if you\'re having problems'
];
var flipHelp = [
  'flip',
  'this command will flip any text upside down',
  '(not all characters work just yet. soon(tm))',
  'the flip command supports emote injection',
  'example usage:',
  '~flip example text',
  '~flip ~dance'
];
var linkHelp = [
  '`wiki`, `google`, `search`, and `lmgtfy`',
  'these commands simply link to a page',
  'search searches the subreddit for posts',
  'it performs no checks to see if the link is to a valid page or not.',
  'example usage:',
  '~wiki no man\'s sky',
  '~google ~lenny',
  '~lmgtfy no man\'s sky release date',
  '~search release date'
];
var latinHelp = [
  '`secret_latin`, `trk_latin`, `jaden_latin`, `alvv_latin`, `ohdear_latin`, and `ohfuck_latin`',
  'these commands will warp text',
  '`secret_latin` swaps the first two characters of words',
  '`trk_latin` removes all vowels and \'c\'s',
  '`jaden_latin` Puts Things In Title Case',
  '`alvv_latin` replaces a few words with \'alvv\'',
  '`ohdear_latin` does the other three in one go',
  '`ohfuck_latin` flips `ohdear_latin`'
];
var rollHelp = [
  '`roll`',
  'have you prayed to RNGesus lately?',
  'rolls dice for you. virtual dice',
  '[number of dice]d[number of dots on highest face]',
  'example usage:',
  '~roll 4d6',
  '~roll 3d20',
  '~roll 2d4 4d6 3d20'
];
var cbHelp = [
  '`cb`',
  'this bot has basic cleverbot functions',
  'they probably don\'t work, though',
  'example usage:',
  '~cb hello'
];
var returnHelp = [
  '`return`',
  'this isn\'t a function itself',
  'instead it will stop the bot from reading anything past that point',
  'example usage:',
  '~flip this text will be flipped ~return this text won\'t be output',
  '~say ~woo ~return ~woo (this will output `\\o/`, as the `~woo` after ~return is ignored)'
];
var breakHelp = [
  '`break`',
  'this isn\'t a normal function',
  '`~break` will stop the current command\'s processing,',
  'but unlike `~return`, the bot will continue along the line',
  'example usage:',
  '~flip this text will be flipped ~break this text won\'t be flipped',
];

function getHelp(args, obj) {
  var reply = [];
  if (args.length === 0) {
    reply = reply.concat(helpHelp);
  } else {
    if (args[0] === 'all') {
      reply.push('all help');
      reply = reply.concat(getHelp(['commands'], obj));
      reply = reply.concat(getHelp(['aliases'], obj));
      reply = reply.concat(getHelp(['emotes'], obj));
    } else if (args[0] === 'commands') {
      var commString = "";
      var keys = Object.keys(functions);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!(typeof functions[key] === 'object' && functions[key].perm && functions[key].perm > obj.perm)) {
          commString += key;
          if (typeof functions[key] === 'object')
            if (functions[key].help)
              commString += ' *';
          if (i !== keys.length - 1)
            commString += ', ';
        }
      }
      reply.push('list of commands');
      reply.push('`*` denotes detailed help');
      reply.push(commString);
    } else if (args[0] === 'emotes') {
      reply.push('list of emotes');
      reply.push(Object.keys(emotes).join(', '));
    } else if (args[0] === 'aliases') {
      reply.push('list of aliases');
      reply.push(Object.keys(aliases).join(', '));
    } else if (typeof functions[args[0]] === 'object') {
      if (functions[args[0]].help)
        reply = reply.concat(functions[args[0]].help);
    } else {
      reply.push('there\'s no help for ' + args[0] + ' yet');
      reply.push('you should yell at secret_online about it');
    }
  }
  return reply;
}

/**
 * Functions
 */
/* TEMPLATE FUNCTION
function template(args, obj) {
  var reply = [];
  // STUFF
  if (reply.length)
    return reply;
} */
function alias(args, obj) {
  var reply = [];
  var comm = args.splice(0, 1)[0];
  var key = args.splice(0, 1)[0];
  if (comm === 'add') {
    var res = processText(args, obj);
    if (aliases[key])
      reply.push('alias already exists');
    else {
      aliases[key] = res;
      reply.push('alias \'' + key + '\' added');
    }
  } else if (comm === 'remove') {
    if (aliases[key]) {
      delete aliases[key];
      reply.push('alias \'' + key + '\' removed');
    } else
      reply.push('alias doesn\'t exist');
  }

  fs.writeFileSync('aliases.json', JSON.stringify(aliases, null, 2));

  return reply;
}

function reload(args, obj) {
  var reply = [];
  // Reload bot functions
  obj.f.reloadBot();
  aliases = JSON.parse(fs.readFileSync('aliases.json'));
  reply.push('reloaded');
  return reply;
}

function evaluate(args, obj) {
  var reply = [];
  // Evaluate input
  reply.push(eval(processText(args, obj)).toString());
  if (reply.length)
    return reply;
}

function sayRaw(args, obj) {
  var reply = [];
  reply.push(args.join(' '));
  if (reply.length)
    return reply;
}

function say(args, obj) {
  var reply = [];
  reply.push(processText(args, obj));
  if (reply.length)
    return reply;
}

function getSource(args, obj) {
  var reply = [];
  if (args.length)
  // Link to a file
    reply.push('https://github.com/SecretOnline/NMS-irc-bot/blob/master/' + processText(args, obj));
  else
  // Link to main page
    reply.push('https://github.com/SecretOnline/NMS-irc-bot/ ' + processText(args, obj));
  if (reply.length)
    return reply;
}

function getFlip(args, obj) {
  var reply = [];
  // Add to return array
  reply.push(flip(processText(args, obj)));
  if (reply.length)
    return reply;
}

function getWikiLink(args, obj) {
  var reply = [];
  var url = 'https://en.wikipedia.org/wiki/';
  if (args.length > 0)
    url += toTitleCase(processText(args, obj));
  else
    url += 'Main_Page';
  url = url.replace(/ /g, '_');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getYtLink(args, obj) {
  var reply = [];
  var url = 'https://www.youtube.com/';
  if (args.length > 0)
    url += 'results?search_query=' + processText(args, obj);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getGoogleLink(args, obj) {
  var reply = [];
  var url = 'https://www.google.com/';
  if (args.length > 0)
    url += 'search?q=' + processText(args, obj);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getLmgtfyLink(args, obj) {
  var reply = [];
  var url = 'http://lmgtfy.com/';
  if (args.length > 0)
    url += '?q=' + processText(args, obj);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getSearchLink(args, obj) {
  var reply = [];
  var url = 'https://www.reddit.com/r/NoMansSkyTheGame/';
  if (args.length > 0)
    url += 'search?sort=new&restrict_sr=on&t=all&q=' + processText(args, obj);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getRelease(args, obj) {
  var reply = [];

  var result = 'It\'s a secret™';

  if (args.length) {
    reply.push('Estimated release of ' + processText(args, obj) + ':');
  } else
    reply.push('Estimated release of No Man\'s Sky: ');
  reply.push(result);

  if (reply.length)
    return reply;
}

function getInceptionNoise(args, obj) {
  var reply = [];
  reply.push('http://inception.davepedu.com/inception.mp3');
  reply.push('warning: noise');
  if (reply.length)
    return reply;
}

function makeErrorReport(args, obj) {
  var reply = [];
  obj.f.addToReportLog([processText(args, obj)], obj.from);
  reply.push('your error has been logged. Thanks ' + obj.from);
  if (reply.length)
    return reply;
}

function getUniverse(args, obj) {
  var reply = [];
  reply.push('generating universe');
  var numEmotes = Math.floor(Math.random() * 3) + 2;
  for (var j = 0; j < numEmotes; j++)
    reply.push(emotes[Object.keys(emotes)[Math.floor(Math.random() * Object.keys(emotes).length)]]);
  reply.push('generation complete');
  if (reply.length)
    return reply;
}

function getProcedural(args, obj) {
  var reply = [];
  var index = Math.floor(Math.random() * procedural.length);
  var text;

  if (args.length) {
    text = processText(args, obj);
  }

  if (!text)
    text = procedural[index];

  reply.push('Every ' + text + ' procedural');
  if (reply.length)
    return reply;
}

function getSecretText(args, obj) {
  var reply = [];
  reply.push(getSecretLatin(processText(args, obj)));
  if (reply.length)
    return reply;
}

function getTrkText(args, obj) {
  var reply = [];
  reply.push(getTrkLatin(processText(args, obj)));
  if (reply.length)
    return reply;
}

function getJadenText(args, obj) {
  var reply = [];
  reply.push(toTitleCase(processText(args, obj)));
  if (reply.length)
    return reply;
}

function getAlvvText(args, obj) {
  var reply = [];
  reply.push(getAlvvLatin(processText(args, obj)));
  //reply.push('nope');
  if (reply.length)
    return reply;
}

function getMessText(args, obj) {
  var reply = [];
  reply.push(getSecretLatin(getTrkLatin(toTitleCase(processText(args, obj)))));
  if (reply.length)
    return reply;
}

function getFuckText(args, obj) {
  var reply = [];
  reply.push(flip(getSecretLatin(getTrkLatin(toTitleCase(processText(args, obj))))));
  if (reply.length)
    return reply;
}

function getThanks(args, obj) {
  var reply = [];
  var text = processText(args, obj);
  if (text === '')
    if (obj.from === 'secret_online')
      reply.push('yeah, yeah. you created me.');
    else
      reply.push('you\'re welcome.');
  else if (text === 'mr skeletal')
    reply.push('doot doot');
  else
    reply.push('thank you ' + text);
  if (reply.length)
    return reply;
}

function getPrayer(args, obj) {
  var reply = [];
  reply.push('Our Murray who art in Guildford,');
  reply.push('procedural be thy name.');
  reply.push('Thy universe come, thy game be done,');
  reply.push('on Planet E3 as in Ethaedair.');
  reply.push('Give us this day our IGN First,');
  reply.push('and forgive our questions,');
  reply.push('as we forgive those who don\'t read the FAQ.');
  reply.push('Lead us not into release hype,');
  reply.push('but deliver us the game.');
  reply.push('For thine is Hello Games, the proc-gen, and the awards.');
  reply.push('A-space-goat.');
  if (reply.length)
    return reply;
}

function getBan(args, obj) {
  var reply = [];
  if (args.length) {
    reply.push('BANNING ' + processText(args, obj));
  } else
    reply.push('so, uh... you going to specify who to let the banhammer loose on?');
  if (reply.length)
    return reply;
}

function getRespawn(args, obj) {
  var reply = [];
  var resIndex = Math.floor(Math.random() * Object.keys(respawns).length);
  reply.push("\"" + respawns[resIndex].text + "\"");
  reply.push("- " + respawns[resIndex].src);
  if (reply.length)
    return reply;
}

function getGreeting(args, obj) {
  var reply = [];
  reply = getWelcome(processText(args, obj));
  if (!reply.length)
    reply.push('nothing for you yet. you should probably yell at secret for that');
  if (reply.length)
    return reply;
}

function getCopyPasta(args, obj) {
  var reply = [];
  reply.push(copyPasta + processText(args, obj));
  if (reply.length)
    return reply;
}

function getMeme(args, obj) {
  var reply = [];
  if (args[0] && memes[args[0]]) {
    reply.push(memes[args[0]]);
  }
  if (reply.length)
    return reply;
}

function getClever(args, obj) {
  var reply = [];
  var res = '';

  // var https = require('https');
  // var querystring = require('querystring');
  //
  // var txt = processText(args, obj);
  //
  // var postData = querystring.stringify({
  //   user: obj.f.cb.user,
  //   key: obj.f.cb.key,
  //   nick: obj.f.cb.session,
  //   text: txt
  // });
  //
  // var options = {
  //   hostname: 'cleverbot.io',
  //   port: 80,
  //   path: '/1.0/ask',
  //   method: 'POST',
  //   headers: {
  //     //'Content-Type': 'application/x-www-form-urlencoded',
  //     //'Content-Length': Buffer.byteLength(postData)
  //   }
  // };
  //
  // var req = https.request(options, function(res) {
  //   res.setEncoding('utf8');
  //   res.on('data', function(chunk) {
  //     res += chunk;
  //   });
  //   res.on('end', function() {
  //     var cbReply = JSON.parse(res);
  //     if (cbReply.status == 'success')
  //       reply.push(cbReply.response);
  //     else {
  //       reply.push('error: ' + cbReply.status);
  //     }
  //     obj.callback(reply, obj.to, obj.sendSettings);
  //   });
  // });
  //
  // req.on('error', function(e) {
  //   reply.push('error with cleverbot: ' + e);
  //   obj.callback(reply, obj.to, obj.sendSettings);
  // });
  //
  // // write data to request body
  // req.write(postData);
  // req.end();

  var cleverbot = require('cleverbot.io');
  cb = new cleverbot(obj.f.cb.user, obj.f.cb.key);
  cb.setNick(obj.f.cb.session);

  cb.ask(processText(args, obj), function(err, response) {
    if (err) {
      reply.push('something went wrong with cleverbot');
      reply.push('message: ' + response);
    } else {
      reply.push(response);
    }
    obj.callback(reply, obj.to, obj.sendSettings);
  });
}

function getRoll(args, obj) {
  var reply = [];
  var retString = "";
  args.forEach(function(roll) {
    if (roll.match(/\d+d\d+/)) {
      var rSplit = roll.split('d');
      var fResult = 0;
      var rolls = "";
      for (var i = 1; i <= rSplit[0]; i++) {
        var result = Math.floor(Math.random() * rSplit[1]) + 1;
        fResult += result;
        rolls += result + '';
        if (i != rSplit[0])
          rolls += '+';
      }
      retString += fResult + ' (' + rolls + ') ';
    } else
      retString += 'bad roll ';
  });
  reply.push(retString);
  if (reply.length)
    return reply;
}

function getReturn(args, obj) {
  var reply = [];
  reply.push('type `~help return` for proper usage');
  if (reply.length)
    return reply;
}

function getBreak(args, obj) {
  var reply = [];
  reply.push('type `~help break` for proper usage');
  if (reply.length)
    return reply;
}

// Big functions dictionary
var functions = {
  'alias': {
    f: alias,
    perm: 3
  },
  'setlevel': {
    f: processPerms,
    perm: 10
  },
  'reload': {
    f: reload,
    perm: 10,
    replyType: 'notice'
  },
  'eval': {
    f: evaluate,
    perm: 10
  },
  'say': say,
  'raw': sayRaw,
  'return': {
    f: getReturn,
    help: returnHelp,
    replyType: 'notice'
  },
  'break': {
    f: getBreak,
    help: breakHelp,
    replyType: 'notice'
  },
  'help': {
    f: getHelp,
    help: helpHelp,
    replyType: 'notice'
  },
  'source': getSource,
  'flip': {
    f: getFlip,
    help: flipHelp
  },
  'wiki': {
    f: getWikiLink,
    help: linkHelp
  },
  'google': {
    f: getGoogleLink,
    help: linkHelp
  },
  'lmgtfy': {
    f: getLmgtfyLink,
    help: linkHelp
  },
  'search': {
    f: getSearchLink,
    help: linkHelp
  },
  'release': getRelease,
  'inception': getInceptionNoise,
  'report': makeErrorReport,
  'generate': getUniverse,
  'procedural': getProcedural,
  'secret_latin': {
    f: getSecretText,
    help: latinHelp
  },
  'trk_latin': {
    f: getTrkText,
    help: latinHelp
  },
  'jaden_latin': {
    f: getJadenText,
    help: latinHelp
  },
  'alvv_latin': {
    f: getAlvvText,
    help: latinHelp
  },
  'ohdear_latin': {
    f: getMessText,
    help: latinHelp
  },
  'ohfuck_latin': {
    f: getFuckText,
    help: latinHelp
  },
  'thanks': getThanks,
  'prayer': getPrayer,
  'BANHAMMER': getBan,
  'respawn': getRespawn,
  'greet': getGreeting,
  'copypasta': {
    f: getCopyPasta,
    perm: 2
  },
  'meme': getMeme,
  'roll': getRoll,
  'cb': {
    f: getClever,
    help: cbHelp,
    async: 1,
    perm: 1
  }
};

function getAlvvLatin(string) {
  var words = string.split(' ');
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > 3) {
      if (words[i].indexOf('ing') === words[i].length - 3)
        words[i] = 'alvving';
      else if (words[i].indexOf('ed') === words[i].length - 2)
        words[i] = 'alvved';
      else if (words[i].indexOf('er') === words[i].length - 2)
        words[i] = 'alvver';
      else if (words[i].indexOf('n\'t') === words[i].length - 3)
        words[i] = 'alvvn\'t';
      else if (words[i].indexOf('nt') === words[i].length - 2)
        words[i] = 'alvvnt';
      else if (words[i].indexOf('\'s') === words[i].length - 2)
        words[i] = 'alvv\'s';
      else if (words[i].indexOf('es') === words[i].length - 2)
        words[i] = 'alvves';
      else if (words[i].indexOf('s') === words[i].length - 1)
        words[i] = 'alvvs';
      else if (words[i].indexOf('y') === words[i].length - 1)
        words[i] = 'alvvy';
      else
        words[i] = 'alvv';
    }
  }
  return words.join(' ');
}

function getSecretLatin(string) {
  var words = string.split(' ');
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > 2)
      words[i] = words[i].substring(1, 2) + words[i].substring(0, 1) + words[i].substring(2);
  }
  return words.join(' ');
}

function getTrkLatin(string) {
  var newString = string.replace(/[aeiouc]/gi, '');
  return newString;
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
  'coffee': '☕',
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
  'dongersmoney': '[̲̅$̲̅(̲̅ヽ̲̅༼̲̅ຈ̲̅ل͜ຈ̲̅༽̲̅ﾉ̲̅)̲̅$̲̅]',
  'dongerswall': '┬┴┬┴┤ヽ༼ຈل͜├┬┴┬┴',
  'fliptable': '(╯°□°)╯︵ ┻━┻',
  'FLIPTABLE': '(ノಠ益ಠ)ノ彡┻━┻',
  'flipdouble': '┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻',
  'unfliptable': '┬──┬ ノ(゜-゜ノ)',
  'UNFLIPTABLE': '┬──┬ ノ(゜益゜ノ)',
  'undisapprovetable': '┬──┬ ノ(ಠ_ಠノ)',
  'fliptable?': '┬──┬ ︵ /(.□. \\)',
  'flipflipper': '(╯°Д°）╯︵ /(.□ . \\)',
  'disapprovetable': '(╯ಠ_ಠ)╯︵ ┻━┻',
  'dongerstable': '༼ﾉຈل͜ຈ༽ﾉ︵ ┻━┻',
  'lennytable': '(╯ ͡° ͜ʖ ͡°)╯︵ ┻━┻',
  'wattable': '(╯ಠ▃ಠ)╯︵ ┻━┻',
  'fu': 'ಠ︵ಠ凸',
  'HYPETRAIN': '/|˳˳_˳˳|[˳˳H˳˳]┐˳˳Y˳˳┌(˳˳P˳˳)\\˳˳E˳˳/|˳˳!˳˳|',
  'lenny': '( ͡° ͜ʖ ͡°)',
  'lennymob': '( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ͡°) ͜ʖ ͡°)ʖ ͡°)ʖ ͡°)',
  'lennymoney': '[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]',
  'lennywall': '┬┴┬┴┤( ͡° ͜ʖ├┬┴┬┴',
  'lennywink': '( ͡~ ͜ʖ ͡°)',
  'lenny?': '( ͠° ͟ʖ ͡°)',
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

var respawns = [{
  text: 'There is a fullness and a calmness there which can only come from knowing pain.',
  src: 'Dan Simmons, Hyperion'
}, {
  text: 'choo choo choo choo train',
  src: 'lenny'
}];

var procedural = [
  'planet',
  'star',
  'solar system',
  'galaxy',
  'voxel',
  'animal',
  'plant',
  'bush',
  'tree',
  'ship',
  'mountain',
  'hill',
  'cave',
  'river',
  'ocean',
  'mountain',
  'weapon',
  'comment',
  'procedure',
  'release date',
  'tweet',
  'post',
  'article',
  'wallpaper',
  'fan art',
  '"Every x procedural"',
  'atom',
  'planet name convention',
  'theory',
  'extension',
  'space whale',
  'photoshop of Sean\'s face',
  'interview',
  'meme',
  'spoiler',
  'post flair',
  'comment generator',
  'Spotify playlist',
  'space goat',
  'subscriber',
  'IGN video',
  'photoshopped Steam page',
  'dream'
];

var memes = {
  'cage': 'http://i.imgur.com/5EBfpq3.png',
  'confess': 'http://i.imgur.com/BDRyxoG.jpg',
  'everywhere': 'http://i.imgur.com/9PyNjXc.png',
  'picard': 'http://i.imgur.com/CXra35Y.jpg',
  'doublepicard': 'http://i.imgur.com/vzyuVHI.png',
  'picardwhy': 'http://i.imgur.com/v4Ewvxz.png',
  'joker': 'http://i.imgur.com/sLJSLnF.png',
  'itshappening': 'http://i.imgur.com/7drHiqr.gif'
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
  'L': '˥',
  'M': 'W',
  'P': '\u0500',
  //'Q': '',
  'R': '\u1D1A',
  'T': '\u2534',
  'U': '\u2229',
  'V': '\u039B',
  'Y': '\u03BB',
  '（': '）',
  '☜': '☞',
  '˳': '°',
  '⌐': '¬',
  '┌': '┘',
  '┐': '└',
  '͜': '͡',
  'ʕ': 'ʖ'
};
for (var i in flipTable) {
  flipTable[flipTable[i]] = i;
}

var copyPasta = "What did you just say about me? I\'ll have you know I graduated top of my class in the NoManNauts, and I\'ve been involved in numerous secret raids on Hello Games, and I have over 2^64 confirmed planet sightings. I am trained in space-goat warfare and I\'m the top pilot in the entirety of /r/NoMansSkyTheGame. You are nothing to me but just another goat. I will wipe you out with proc-gen tech the likes of which has never been seen before in this system, mark my words. You think you can get away with saying that to me over IRC? Think again. As we speak I am contacting my secret network of sentinels across the galaxy and your ship is being traced right now so you better prepare for the storm. The storm that wipes out the pathetic little thing you call Ictaloris Hyphus. You\'re dead, kid. I can warp anywhere, anytime, and I can kill you in over 18 quintillion ways, and thats just with my multitool. Not only am I extensively trained in multitool combat, but I have access to the entire arsenal of the Malevolent Force and I will use it to its full extent to wipe your E3 Fish off the face of the universe. If only you could have known what unholy retribution your little clever comment was about to bring down upon you, maybe you would have held your tongue. But you couldn\'t, you didn\'t, and now you\'re paying the price. I will fire plasma grenades all over you and you will explode in it. You\'re dead, space-goat.";

module.exports = {
  getText: getText,
  getWelcome: getWelcome,
  getHelp: getHelp,
  processText: processText,
  emotes: emotes,
  functions: functions
};
