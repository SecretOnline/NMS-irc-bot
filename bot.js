/**
 * Returns an array of strings to send
 */
function getText(comm, args, from) {
  var returnArray = [];
  // Get help
  if (comm === 'help')
    return getHelp(args);
  // Flip words
  else if (comm === 'flip') {
    var flipped = '';
    // For every word (in reverse)
    for (var i = args.length - 1; i >= 0; i--) {
      // If it's an emote
      if (args[i].charAt(0) === '~' || args[i].charAt(0) === '`') {
        try {
          // Try flip the emote
          var emote = getEmote(args[i].substring(1));
          flipped += flip(emote);
        } catch (err) {
          // Flip the name of the emote
          flipped += flip(args[i]);
        }
      } else
      // Flip the string
        flipped += flip(args[i]);
      flipped += ' ';
    }
    // Add to return array
    returnArray.push(flipped);
  } else if (comm === 'meme') {
    // Get the meme link
    if (args[0] && memes[args[0]]) {
      returnArray.push(getMeme(args[0]));
    }
  } else if (comm === 'say') {
    // Say, but only if admin
    var rValue;
    JSON.parse(require('fs').readFileSync('settings.json')).admins.forEach(function(admin) {
      if (from === admin) {
        rValue = args.join(' ');
      }
    }, this);
    returnArray.push(rValue);
  } else if (comm === 'ks') {
    // Kickstart trivia
    returnArray.push('.trivia kickstart');
  } else if (comm === 'generate') {
    // A joke, for devinup
    returnArray.push('generating universe');
    var numEmotes = Math.floor(Math.random() * 3) + 2;
    for (var j = 0; j < numEmotes; j++)
      returnArray.push(emotes[Object.keys(emotes)[Math.floor(Math.random() * Object.keys(emotes).length)]]);
    returnArray.push('generation complete');
  } else if (emotes[comm]) {
    // If there's an emote, send it
    returnArray.push(getEmote(comm));
  } else
    throw 'invalid command: \'' + comm + '\'. please try again';
  return returnArray;
}
/**
 * Returns an array of strings to send
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
    // If it's emote listing
  else if (helpArgs[0] === 'emotes')
    return ['list of emotes', 'type \'~[emote name]\' to use', ' '].concat(Object.keys(emotes));
  // Meme listing
  else if (helpArgs[0] === 'memes')
    return ['list of memes', 'type \'~meme [meme name]\' to use', ' '].concat(Object.keys(memes));
  return ['Unknown help argument'];
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
  'derp': '◖|◔◡◉|◗',
  'undeal': '(⌐■_■) ( •_•)>⌐■-■ ( •_•)',
  'disapprove': 'ಠ_ಠ',
  'disapprovedance': '┌( ಠ_ಠ)┘',
  'dongers': 'ヽ༼ຈل͜ຈ༽ﾉ',
  'dongers?': '┌༼◉ل͟◉༽┐',
  'fliptable': '(╯°□°)╯︵ ┻━┻',
  'FLIPTABLE': '(ノಠ益ಠ)ノ彡┻━┻',
  'flipdouble': '┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻',
  'unfliptable': '┬──┬ ノ( ゜-゜ノ)',
  'UNFLIPTABLE': '┬──┬ ノ(゜益゜ ノ)',
  'fliptable?': '┬─┬﻿ ︵ /(.□. \\)',
  'fu': 'ಠ︵ಠ凸',
  'lenny': '( ͡° ͜ʖ ͡°)',
  'lennymob': '( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ͡°) ͜ʖ ͡°)ʖ ͡°)ʖ ͡°)',
  'lennymoney': '[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]',
  'lennywall': '┬┴┬┴┤( ͡° ͜ʖ├┬┴┬┴',
  'lennywink': '( ͡~ ͜ʖ ͡°)',
  'orly': '﴾͡๏̯͡๏﴿ O\'RLY?',
  'rage': 'ლ(ಠ益ಠლ)',
  'robot': '╘[◉﹃◉]╕',
  'shrug': '¯\\_(ツ)_/¯',
  'throwglitter': '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
  'wat': 'ಠ▃ಠ',
  'whyy': 'щ(ಥДಥщ)',
  'whattheshrug': '﻿¯\\(ºдಠ)/¯',
  'zoidberg': '(\\/) (°,,°) (\\/)',
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
  //'B': '',
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
  'Y': '\u028E'
};
for (var i in flipTable) {
  flipTable[flipTable[i]] = i;
}

/**
 * Help
 */
var mainHelp = [
  [
    'secret_bot help',
    'page 1 of 2',
    'commands can use either \'`\' or \'~\'',
    '` commands are replied to you in a private message (may change)',
    '~ commands are replied to the channel they were sent to',
    'type \'`help 2\' (or \'~help 2\') to see a list of commands'
  ],
  [
    'page 2 of 2',
    'flip [text to flip]: flip it and reverse it.',
    'ks: print \'.trivia kickstart\'',
    'meme [meme name]: link to a meme. \'help memes\' to see a list',
    '[emote name]: show unicode emote. \'help emotes\' to see a list'
  ]
];
var flipHelp = [
  [
    'flip',
    'this command will flip any text upside down',
    '(not all characters work just yet. soon(tm))',
    'you can also specify emotes for it to flip',
    'example usages:',
    '`flip example text',
    '`flip `dance'
  ]
];

module.exports = {
  'flip': flip,
  'emotes': getEmote,
  'get': getText,
  'help': getHelp
};
