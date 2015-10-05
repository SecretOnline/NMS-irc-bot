/**
 * Returns an array of strings to send
 */
function getText(args, from, to, admins) {
  // Split into command + arguments for that command
  var comm = args.splice(0, 1)[0].substring(1);
  var returnArray = [];
  // Stop the bot, but only if admin
  if (comm === '') {
    // Do nothing!
  } else
  // Stop the bot, but only if admin
  if (comm === 'stop') {
    if (isAdmin(from, admins))
      this.disconnect('hammer time');
  } else
  // Run a command, but only if admin
  if (comm === 'eval') {
    if (isAdmin(from, admins)) {
      returnArray.push(eval(processText(args, from, to, admins)).toString());
    } else {
      returnArray.push('due to the nature of this command, you are not able to use it.');
    }
  } else
  // Say, but only if admin
  if (comm === 'raw') {
    returnArray.push(args.join(' '));
  } else
  // Say, but only if admin
  if (comm === 'say') {
    returnArray.push(processText(args, from, to, admins));
  } else
  // Get help
  if (comm === 'help')
    return getHelp(args);
  // Bot source
  else if (comm === 'source') {
    if (args.length)
      returnArray.push('https://github.com/SecretOnline/NMS-irc-bot/blob/master/' + processText(args, from, to, admins));
    else
      returnArray.push('https://github.com/SecretOnline/NMS-irc-bot/ ' + processText(args, from, to, admins));
  } else
  // Flip words
  if (comm === 'oneline') {
    // Add to return array
    returnArray.push(processText(args, from, to, admins));
  } else
  // Flip words
  if (comm === 'flip') {
    // Add to return array
    returnArray.push(flip(processText(args, from, to, admins)));
  } else
  // Wikipedia links
  if (comm === 'wiki') {
    var url = 'https://en.wikipedia.org/wiki/';
    if (args.length > 0)
      url += toTitleCase(processText(args, from, to, admins));
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
      url += 'search?q=' + processText(args, from, to, admins);
    url = url.replace(/ /g, '+');
    url = encodeURI(url);
    url = url.replace(/'/g, '%27');
    returnArray.push(url);
  } else
  // Let me Google that for you
  if (comm === 'lmgtfy') {
    var url = 'http://lmgtfy.com/';
    if (args.length > 0)
      url += '?q=' + processText(args, from, to, admins);
    url = url.replace(/ /g, '+');
    url = encodeURI(url);
    url = url.replace(/'/g, '%27');
    returnArray.push(url);
  } else
  // Kickstart trivia
  if (comm === 'ks') {
    returnArray.push('.trivia kickstart');
  } else
  // NMS FAQ
  if (comm === 'faq') {
    returnArray.push('https://www.reddit.com/r/NoMansSkyTheGame/wiki/faq ' + processText(args, from, to, admins));
  } else
  // NMS FAQ
  if (comm === 'archive') {
    returnArray.push('https://www.reddit.com/r/NoMansSkyTheGame/wiki/archive ' + processText(args, from, to, admins));
  } else
  // NMS rules
  if (comm === 'rules') {
    returnArray.push('https://www.reddit.com/r/NoMansSkyTheGame/wiki/rules ' + processText(args, from, to, admins));
  } else
  // Bot accusation
  if (comm === 'bot') {
    returnArray.push('no, you\'re a bot, ' + processText(args, from, to, admins));
    //returnArray.push('no, you\'re a bot, undefined');
  } else
  // Release
  if (comm === 'release') {
    var result = 'It\'s a secret™';

    if (args.length) {
      returnArray.push('Estimated release of ' + processText(args, from, to, admins) + ':');
    } else
      returnArray.push('Estimated release of No Man\'s Sky: ');
    returnArray.push(result);
    // if (showCountdown)
    //   returnArray.push('(when we have a date, go to ~countdown for a, well, countdown)');
  } else
  // Release
  if (comm === 'countdown') {
    returnArray.push('http://secretonline.github.io/NMS-Countdown');
  } else
  // Report generator
  if (comm === 'planetreport') {
    returnArray.push('http://secretonline.github.io/NMS-Report');
  } else
  // Report generator
  if (comm === 'inception') {
    returnArray.push('http://inception.davepedu.com/inception.mp3');
    returnArray.push('warning: noise');
  } else
  // Sean's mindblow
  if (comm === 'mindblow') {
    returnArray.push('http://i.imgur.com/8pTSVjV.gif');
  } else
  // Release
  if (comm === 'hint') {
    returnArray.push('what. you think i know the answer? ' + processText(args, from, to, admins));
  } else
  // CHOO CHOO
  if (comm === 'hype') {
    returnArray.push('choo choo ' + processText(args, from, to, admins));
  } else
  if (comm === 'HYPE') {
    returnArray.push('CHOO CHOO! ALL ABOARD ' + processText(args, from, to, admins));
  } else
  if (comm === 'HYPETRAIN') {
    returnArray.push('/|˳˳_˳˳|[˳˳H˳˳]¬˳˳Y˳˳⌐(˳˳P˳˳)\\˳˳E˳˳/|˳˳!˳˳| ' + processText(args, from, to, admins));
  } else
  // REPORT
  if (comm === 'report') {
    addToReportLog([processText(args, from, to, admins)], from);
    returnArray.push('your error has been logged. Thanks ' + from);
  } else
  // A joke, for devinup
  if (comm === 'generate') {
    returnArray.push('generating universe');
    var numEmotes = Math.floor(Math.random() * 3) + 2;
    for (var j = 0; j < numEmotes; j++)
      returnArray.push(emotes[Object.keys(emotes)[Math.floor(Math.random() * Object.keys(emotes).length)]]);
    returnArray.push('generation complete');
  } else
  // A joke, for irc
  if (comm === 'procedural') {
    var index = Math.floor(Math.random() * procedural.length);
    var text;

    if (args.length) {
      text = processText(args, from, to, admins);
    }

    if (!text)
      text = procedural[index];

    returnArray.push('Every ' + text + ' procedural');
  } else
  // A joke, for melanon68
  if (comm === 'secret_latin') {
    returnArray.push(getSecretLatin(processText(args, from, to, admins)));
  } else
  // A joke, for trkmstrwggy
  if (comm === 'trk_latin') {
    returnArray.push(getTrkLatin(processText(args, from, to, admins)));
  } else
  // A joke, for a certain Mr. Smith
  if (comm === 'jaden_latin') {
    returnArray.push(toTitleCase(processText(args, from, to, admins)));
  } else
  // A joke, for a Hipo and I
  if (comm === 'ohdear_latin') {
    returnArray.push(getSecretLatin(getTrkLatin(toTitleCase(processText(args, from, to, admins)))));
  } else
  // A joke, for trk and I
  if (comm === 'ohfuck_latin') {
    returnArray.push(flip(getSecretLatin(getTrkLatin(toTitleCase(processText(args, from, to, admins))))));
  } else
  // A joke, for a Hipo and I
  if (comm === 'cut') {
    returnArray.push('hey, that\'s not nice.');
  } else
  // A joke, for a Hipo and I
  if (comm === 'rip') {
    returnArray.push('rip in peace, ' + processText(args, from, to, admins));
  } else
  // A joke, for a Hipo and I
  if (comm === 'soon') {
    returnArray.push('not soon enough :(');
  } else
  // A joke, for Snappin
  if (comm === 'hundreds') {
    returnArray.push('hundreds, if not thousands, of ' + processText(args, from, to, admins));
  } else
  // A joke, for trk and I
  if (comm === 'thanks') {
    if (from === 'secret_online')
      returnArray.push('yeah, yeah. you created me.');
    else
      returnArray.push('you\'re welcome.');
  } else
  // A joke, for trkmstrwggy
  if (comm === 'prayer') {
    returnArray.push('Our Murray who art in Guildford,');
    returnArray.push('procedural be thy name.');
    returnArray.push('Thy universe come, thy game be done,');
    returnArray.push('on Planet E3 as in Ethaedair.');
    returnArray.push('Give us this day our IGN First,');
    returnArray.push('and forgive our questions,');
    returnArray.push('as we forgive those who don\'t read the FAQ.');
    returnArray.push('Lead us not into release hype,');
    returnArray.push('but deliver us the game.');
    returnArray.push('For thine is Hello Games, the proc-gen, and the awards.');
    returnArray.push('A-space-goat.');
  } else
  // A joke, for a Hipo and I
  if (comm === 'BANHAMMER') {
    if (args.length) {
      returnArray.push('BANNING ' + processText(args, from, to, admins));
    } else
      returnArray.push('so, uh... you going to specify who to let the banhammer loose on?');
  } else
  // What did you just say to me?
  if (comm === 'respawn') {
    var resIndex = Math.floor(Math.random() * Object.keys(respawns).length);
    returnArray.push("\"" + respawns[resIndex].text + "\"");
    returnArray.push("- " + respawns[resIndex].src);
  } else
  // What did you just say to me?
  if (comm === 'copypasta') {
    //if (isAdmin(from, admins))
    returnArray.push(copyPasta + processText(args, from, to, admins));
    //else
    //  returnArray.push(processText(args, from, to, admins));
  } else
  // Get the meme link
  if (comm === 'meme') {
    if (args[0] && memes[args[0]]) {
      returnArray.push(getMeme(args[0]));
    }
  } else
  // Emotes
  if (emotes[comm]) {
    returnArray.push(getEmote(comm) + ' ' + processText(args, from, to, admins));
  } else
    return ['invalid command: \'' + comm + '\'. please try again'];
  return returnArray;
}

function processText(words, from, to, admins) {
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
      var newString = getText(newArgs, from, to, admins).join(' ');
      str += newString;
      break;
    } else
    // Just add the string
      str += words[i];
  }

  return str;
}

function isAdmin(name, admins) {
  var ret = false;
  admins.forEach(function(admin) {
    if (name === admin) {
      ret = true;
    }
  });
  return ret;
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
  'L': '\u2510',
  'M': 'W',
  'P': '\u0500',
  //'Q': '',
  'R': '\u1D1A',
  'T': '\u2534',
  'U': '\u2229',
  'V': '\u039B',
  'Y': '\u03BB',
  '（': '）',
  '☜': '☞'
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
    'countdown: ',
    '[emote name]: show unicode emote. \'help emotes\' to see a list',
    'faq: link to the /r/NoMansSkyTheGame faq',
    'flip [text to flip]: flip it and reverse it.',
    'ks: print \'.trivia kickstart\'',
    'wiki [page]: link to a page of wikipedia',
    'meme [meme name]: link to a meme. \'help memes\' to see a list',
    'report [description of error]: write an error report',
    'respawn: give one of the known respawn texts from the game',
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

var copyPasta = "What did you just say about me? I\'ll have you know I graduated top of my class in the NoManNauts, and I\'ve been involved in numerous secret raids on Hello Games, and I have over 300 confirmed planet sightings. I am trained in space-goat warfare and I\'m the top pilot in the entirety /r/NoMansSkyTheGame. You are nothing to me but just another goat. I will wipe you out with proc-gen tech the likes of which has never been seen before in this system, mark my words. You think you can get away with saying that to me over IRC? Think again. As we speak I am contacting my secret network of sentinels across the galaxy and your ship is being traced right now so you better prepare for the storm. The storm that wipes out the pathetic little thing you call Ictaloris Hyphus. You\'re dead, kid. I can warp anywhere, anytime, and I can kill you in over 18 quintillion ways, and thats just with my multitool. Not only am I extensively trained in multitool combat, but I have access to the entire arsenal of the Malevolent Force and I will use it to its full extent to wipe your E3 Fish off the face of the universe. If only you could have known what unholy retribution your little clever comment was about to bring down upon you, maybe you would have held your tongue. But you couldn\'t, you didn\'t, and now you\'re paying the price. I will fire plasma grenades all over you and you will explode in it. You\'re dead, space-goat.";

module.exports = {
  getText: getText,
  getHelp: getHelp,
  processText: processText,
  emotes: emotes
};
