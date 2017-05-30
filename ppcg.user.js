// ==UserScript==
// @name        PPCG Graduation Script
// @namespace   https://github.com/vihanb/PPCG-Design
// @version     3.11.5
// @description A script to self-graduate PPCG
// @match       *://*.codegolf.stackexchange.com/*
// @match       *://codegolf.meta.stackexchange.com/*
// @match       *://chat.stackexchange.com/*
// @author      PPCG Community
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @updateURL   https://rawgit.com/vihanb/PPCG-Design/master/ppcg.user.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////
//////////////////////                        //////////////////////////
//////////////////////    GLOBAL VARIABLES    //////////////////////////
//////////////////////                        //////////////////////////
////////////////////////////////////////////////////////////////////////
var site = window.location.hostname; // main, meta, or chat
if (/meta/.test(site)) site = 'meta';
else if (/chat/.test(site)) site = 'chat';
else site = 'main';

$('[rel="shortcut icon"][href^="//cdn.sstatic.net/Sites/codegolf/img/favicon.ico"]').attr('href', 'https://i.stack.imgur.com/oHkfe.png');
$('img[src^="//cdn.sstatic.net/Sites/codegolf/img/favicon.ico"]').attr('src', 'https://i.stack.imgur.com/oHkfe.png');

if (site === 'chat' && !$('[rel="shortcut icon"]')[0].href.startsWith('https://i.stack.imgur.com/oHkfe.png'))
  throw 'Site is chat site but not PPCG chat, aborting PPCG design userscript';

// ['Propose', 'Porpoise'], // >:D
var reps = [
  ['Helka Homba', 'Calvin\'s Hobbies'],
  ['HelkaHomba', 'CalvinsHobbies'],
  ['Helka', 'Calvin'],
  ['fItaJ.png', 'qkXJy.png'],
  ['Aqua Tart', 'quartata'],
  ['Don Musolini', 'Luis Mendo'],
  ['DonMusolini', 'LuisMendo'],
  ['AandN', 'Adnan'],
  ['A and N', 'Adnan'],
  ['lirtosiast', 'Thomas Kwa'],
  ['I Go Best', 'Geobits'],
  ['IGoBest', 'Geobits'],

  //['Code Review', 'the evil code reviewers'] ihaichu - EasterlyIrk on behalf of CR.
];

var rReps = new RegExp(reps.map(function (arr) {
  return arr[0].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}).join(''), 'g');

var repMap = new Map(reps);

/* These are the alternating tag choices for the QOD widget */
var QOD_ALTERNATING_TAGS = ['string', 'popularity-contest', 'ascii-art', 'number',
  'kolmogorov-complexity', 'graphical-output', 'king-of-the-hill', 'fastest-code',
  'restricted-source', 'arithmetic', 'sequence', 'game',
  'tips', 'geometry', 'number-theory', 'random', 'primes',
  'array-manipulation', 'date', 'image-processing', 'graphs',
  'sorting', 'interpreter', 'optimization', 'parsing',
  'path-finding', 'puzzle-solver', 'underhanded', 'source-layout',
  'base-conversion'
];

if (site === 'chat' && (GM_getValue('main.RUN_IN_CHAT') !== true)) throw 'Not executing script';

// Fonts
var HEADER_FONT = 'Lato, "Open Sans", Arial, sans-serif'; // Header text
var TEXT_FONT = '"Open Sans", Lato, "Helvetica Neue", Arial, sans-serif'; // Everything else besides code
var MONOSPACE_FONT = 'Inconsolata, monospace'; // Monospace font & Tag font
var FONT_URL = '//fonts.googleapis.com/css?family=Lato:700|Open+Sans|Inconsolata'; // import any webfonts here

// Colors
var MOD_FLAIR = '#F0C800'; // Mod diamond
var MOD_FLAIR_HOVER = '#FFE32E';

/** ~~~~~~~~~~~~~~~~ MAIN SITE CUSTOMIZABLE PROPERTIES ~~~~~~~~~~~~~~~~ **/

var main = {
  FAVICON: '//i.stack.imgur.com/oHkfe.png',
  SPRITE_SHEET: '//cdn.rawgit.com/vihanb/PPCG-Design/master/assets/sprites.svg',
  SEARCH_TEXT: 'Search codegolf.SE',

  // Set to empty string for no background image
  BACKGROUND_IMAGE: '//i.stack.imgur.com/4Y7TE.png',
  PAGE404: '//i.stack.imgur.com/ToEtE.png',
  BG_COL: '#175D2E',
  BG_COL_HOVER: 'white',
  BG_START: 'white',
  BG_REV: '#329300',

  GOAT_MODE: (GM_getValue('main.GOAT_MODE') === true), // default false
  BACKGROUND_LIGHT: (GM_getValue('main.BACKGROUND_LIGHT') === true), // Lighter shade of the background, CHANGE THROUGH OPTIONS
  MODE_DARK: (GM_getValue('main.MODE_DARK') === true),
  RUN_IN_CHAT: (GM_getValue('main.RUN_IN_CHAT') !== false),
  USE_LEADERBOARD: (GM_getValue('main.USE_LEADERBOARD') !== false), // default is true
  SHOW_QOD_WIDGET: (GM_getValue('main.SHOW_QOD_WIDGET') !== false), // default is true
  USE_AUTOTIO: (GM_getValue('main.USE_AUTOTIO') !== false), // default is true
  PROPOSE: GM_getValue('main.PROPOSE') || 'Propose',
  REPLACE_NAMES: GM_getValue('main.REPLACE_NAMES') === true, // default is false
  SHOW_BYTE_COUNTS: GM_getValue('main.SHOW_BYTE_COUNTS') !== false, // default is true

  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: '#FAFAFA',
  HEADER_BG_COLOR: 'transparent',
  HEADER_BG_IMAGE: '',
  HEADER_TEXT_COLOR: '#FFF',
  CURR_TAB_COLOR: '#62BA15',
  BULLETIN_BG_COLOR: '#fff8dc',
  STATS_COLOR: '#FAFAFA',
  LINK_COLOR: 'rgb(60, 100, 60)',
  VISITED_LINK_COLOR: 'rgb(30,50,30)',
  HOVER_LINK_COLOR: 'rgb(45,75,45)',
  POST_QUESTION_COLOR: 'rgba(140,180,140,0.75)',
  POST_QUESTION_CORNER_RADIUS: '5px',
  TEXT_COLOR: 'black',
  CODE_COLOR: 'black',
  CODE_BACKGROUND: '#EEE',
  TOPBAR: 'rgba(12, 13, 14, .86)',
  LABEL_KEY: '#9199A1',
  LABEL_KEY_B: '#3B4045',
  MODULE_H4: '#3B4045',
  HYPERLINK: '#4E82C2',
  HYPERLINK_VISITED: '#18529A',
  POST_HYPERLINK: '#4E82C2',
  POST_HYPERLINK_VISITED: '#18529A',
  QUESTION_STATUS: '#FFF7E5',
  OWNER: '#E1ECF9',
  USER_INFO: '#848D95',

  TAG_COLOR: '#D4F493',
  TAG_HOVER: '#329300',

  TAG_SHADOW_COLOR: '#BACD56',
  TAG_HOVER_SHADOW_COLOR: '#256C00',

  BUTTON_COLOR: '#6DAB71',
  BUTTON_HOVER: '#5DA261',

  // Specify nothing to make these default color
  BOUNTY_COLOR: 'rgb(72,125,75)',
  BOUNTY_BG_COLOR: 'rgb(172,225,175)',
  BOUNTY_INDICATOR: '#6DAB71',

  // QOD Settings
  QOD_NUMBER_OF_QS_SHOWN: GM_getValue('QOD_NUMBER_OF_QS_SHOWN') || 5,
  QOD_ALWAYS_SHOWN_TAGS: JSON.parse(GM_getValue('QOD_ALWAYS_SHOWN_TAGS') || 0) || ['code-golf', 'code-challenge', 'math']
};

/** ~~~~~~~~~~~~~~~~ META SITE CUSTOMIZABLE PROPERTIES ~~~~~~~~~~~~~~~~ **/

var meta = {
  FAVICON: '//i.imgur.com/xJx4Jdd.png',
  DISP_ICON: '//i.stack.imgur.com/dY4TQ.png',
  SPRITE_SHEET: '//cdn.rawgit.com/vihanb/PPCG-Design/master/assets/sprites.svg',

  SEARCH_TEXT: 'Search codegolf.meta.SE',

  // Set to empty string for no background image
  BACKGROUND_IMAGE: '//i.stack.imgur.com/4535h.png',
  PAGE404: '',
  BG_COL: '#474747',
  BG_COL_HOVER: '#474747',
  BG_START: 'rgba(255, 255, 255, 0.8)',
  BG_REV: 'white',

  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: '#FAFAFA',
  HEADER_BG_COLOR: 'transparent',
  HEADER_TEXT_COLOR: '#FFF',
  CURR_TAB_COLOR: 'rgb(72,125,75)',
  BULLETIN_BG_COLOR: '#fff8dc',
  STATS_COLOR: '#FCFCFC', // Content BG
  TAG_COLOR: '',
  TAG_BORDER_COLOR: '',
  BUTTON_COLOR: '#303030',
  POST_QUESTION_COLOR: 'rgba(255, 255, 255, 0.75)',
  POST_QUESTION_CORNER_RADIUS: '5px',
  TEXT_COLOR: 'black',
  CODE_COLOR: 'black',
  CODE_BACKGROUND: '#EEE',
  TOPBAR: 'rgba(12, 13, 14, .86)',
  LABEL_KEY: '#9199A1',
  LABEL_KEY_B: '#3B4045',
  MODULE_H4: '#3B4045',
  HYPERLINK: '#4E82C2',
  HYPERLINK_VISITED: '#18529A',
  POST_HYPERLINK: '#4E82C2',
  POST_HYPERLINK_VISITED: '#18529A',
  QUESTION_STATUS: '#FFF7E5',
  OWNER: '#E1ECF9',
  USER_INFO: '#848D95',

  // Specify nothing to make these default color
  BOUNTY_COLOR: 'rgb(72,125,75)',
  BOUNTY_BG_COLOR: 'rgb(172,225,175)',
  BOUNTY_INDICATOR: '#6DAB71'
};

var darktheme = {
  BACKGROUND_COLOR: 'red',
  BACKGROUND_IMAGE: '//i.stack.imgur.com/vAWfF.png',
  STATS_COLOR: '#364',
  BULLETIN_TITLE: '#000000',
  BULLETIN_BG_COLOR: 'rgb(136,170,131)',
  META_LINK_COLOR: 'rgb(34,36,38)',
  POST_QUESTION_COLOR: 'rgba(134,180,140,0.75)',
  POST_QUESTION_RADIUS: '5px',
  LINK_COLOR: 'rgb(160, 213, 162)',
  VISITED_LINK_COLOR: 'rgb(110,150,110)',
  RIGHTBAR_BG: '#B0D4AB',
  RIGHTBAR_BORDER: 'none',
  TEXT_COLOR: '#D6ECCB',
  CODE_COLOR: '#BDB',
  CODE_BACKGROUND: '#264730',
  TOPBAR: 'rgba(45, 64, 46, .86)',
  LABEL_KEY: '#8FAF8E',
  LABEL_KEY_B: '#B7D4A8',
  MODULE_H4: '#B7D4A8',
  HYPERLINK: '#6EC171',
  HYPERLINK_VISITED: '#6EC171',
  POST_HYPERLINK: '#6EC171',
  POST_HYPERLINK_VISITED: '#6EC171',
  QUESTION_STATUS: '#6B7D5A',
  OWNER: '#609C86',
  USER_INFO: '#B8C4CE'
};

var metadark = {
  STATS_COLOR: '#555',
  BULLETIN_TITLE: '#000000',
  BULLETIN_BG_COLOR: '#AAA',
  META_LINK_COLOR: 'rgb(34,36,38)',
  POST_QUESTION_COLOR: 'rgba(150,150,150,0.75)',
  POST_QUESTION_RADIUS: '5px',
  LINK_COLOR: '#DDD',
  VISITED_LINK_COLOR: '#BBB',
  HOVER_LINK_COLOR: '#CCC',
  RIGHTBAR_BG: '#B0D4AB',
  RIGHTBAR_BORDER: 'none',
  TEXT_COLOR: '#DDD',
  CODE_COLOR: '#CCC',
  CODE_BACKGROUND: '#222',
  TOPBAR: 'rgba(12, 13, 14, .86)',
  LABEL_KEY: '#9199A1',
  LABEL_KEY_B: '#C1C1C1',
  MODULE_H4: '#9199A1',
  HYPERLINK: '#4E82C2',
  HYPERLINK_VISITED: '#99B4D6',
  POST_HYPERLINK: '#4E82C2',
  POST_HYPERLINK_VISITED: '#18529A',
  QUESTION_STATUS: '#FFF7E5',
  OWNER: '#E1ECF9',
  USER_INFO: '#848D95'
};

var lightbg = {
  BACKGROUND_COLOR: 'red',
  BACKGROUND_IMAGE: '//i.stack.imgur.com/t8GhU.png'
};

var optionbox = { // Customizes option box
  BACKGROUND_TINT: 'linear-gradient(rgba(69, 174, 103, 0.57), rgba(73, 166, 83, 0.47))',
  BACKGROUND_COLOR: '#FAFAFA'
};

var BGHEIGHT = 0; // this + 130

var PARSE_CODEBLOCKS = main.SHOW_BYTE_COUNTS; // set to false to not parse code block lengths
var PARSE_HEXDUMPS = main.SHOW_BYTE_COUNTS; // set to false to not parse hexdump lengths

if (GM_getValue('main.MODE_DARK') === true) {
  main = $.extend(main, darktheme);
  meta = $.extend(meta, metadark);
}
if (GM_getValue('main.BACKGROUND_LIGHT') === true) {
  main = $.extend(main, lightbg);
  document.body.style.backgroundRepeat = "repeat";
}

/** ~~~~~~~~~~~~~~~~ END CSS PROPERTIES ~~~~~~~~~~~~~~~~ **/

// add favicon 
document.head.innerHTML += '<style>.favicon-codegolf{background-position: initial !important; background-image: url("' + main.FAVICON + '"); background-size: 100% 100% !important;}' +
  '.favicon-codegolfmeta{background-position: initial !important; background-image: url("' + meta.FAVICON + '"); background-size: 100% 100% !important;}</style>';
$('.small-site-logo').each(function (i, el) {
  if ($(el).attr('title') === 'Programming Puzzles & Code Golf') {
    $(el).attr('src', main.FAVICON);
  }
});

// apply goat mode
if (main.GOAT_MODE) {
  $('head').append($('<style/>', {
    html: '.vote-up-off {' +
      '  background-image: url(https://cdn.rawgit.com/somebody1234/Misc-Files/master/upgoat-off.svg) !important;' +
      '  background-size: 100% !important;' +
      '  background-position: 0px 0px;' +
      '}' +
      '.vote-down-off {' +
      '  background-image: url(https://cdn.rawgit.com/somebody1234/Misc-Files/master/downgoat-off.svg) !important;' +
      '  background-size: 100% !important;' +
      '  background-position: 0px 0px;' +
      '}' +
      '.vote-up-on {' +
      '  background-image: url(https://cdn.rawgit.com/somebody1234/Misc-Files/master/upgoat.svg) !important;' +
      '  background-size: 100% !important;' +
      '  background-position: 0px 0px;' +
      '}' +
      '.vote-down-on {' +
      '  background-image: url(https://cdn.rawgit.com/somebody1234/Misc-Files/master/downgoat.svg) !important;' +
      '  background-size: 100% !important;' +
      '  background-position: 0px 0px;' +
      '}'
  }));
}

// What does this do??

var match = $('link[href="//cdn.sstatic.net/codegolf/img/favicon.ico?v=cf"]').attr('href', main.FAVICON);
if (match.length > 0) {
  $('#input-area').css('background', 'url(' + 'https://i.stack.imgur.com/oqoGQ.png' + ')');
  $('#input-area').css('background-size', '600px 400px');
  if (GM_getValue('main.MODE_DARK') == 'true') $('#input-area').css('background', 'url(' + darktheme.BACKGROUND_IMAGE + ')');
  if (GM_getValue('main.BACKGROUND_LIGHT') == 'true') $('#input-area').css('background', 'url(' + lightbg.BACKGROUND_IMAGE + ')');
  document.head.innerHTML +=
    ('<style>' +
      'a.post-tag{border-radius: 0;text-align:center;font-family:' + MONOSPACE_FONT + ';font-size:12px;white-space: nowrap;background-color:$$TAG_COLOR;border:none; -webkit-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -moz-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -ms-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -o-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; border-bottom: 2px solid $$TAG_SHADOW_COLOR}' +
      'a.post-tag:hover{border-bottom-color: $$TAG_HOVER_SHADOW_COLOR;background: $$TAG_HOVER; color: white}' +
      '</style>').replace(/\$\$(\w+)/g, function (_, m) {
      return main[m];
    });
}

////////////////////////////////////////////////////////////
//////////////////    CHAT STYLES     //////////////////////
////////////////////////////////////////////////////////////

if (site === 'chat') {
  $('body').css('background', 'white');
  $('#sound').css({
    'background': 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/200px-Speaker_Icon.svg.png)',
    'background-size': '16px 16px'
  });
  $('#roomname').css('font-family', 'Lato');
  $('#roomname').css('font-weight', '800');
  $('#searchbox').css('padding-left', '4px !important');
  $('#footer-logo a').text('Programming Puzzles & Code Golf').css('color', '#2A2');
  $('#input-area').css('background', 'url(' + main.BACKGROUND_IMAGE + ')');

  /*  $('body').append('<img id="CHATBOX" style="z-index: 1000; display:none; position: fixed;">');
  $(document).on('mouseenter', 'li[id^="summary_"], li[id^="summary_"] *', function () {
    $('#CHATBOX').show();
    var src = $(this).find('a[href*=".png"],a[href*=".jpeg"],a[href*=".jpg"],a[href*=".gif"],a[href*=".svg"]').attr('href');
    var pos = $(this).get(0).getBoundingClientRect();
    var i = new Image(src);
    i.onload = function () {
      $('#CHATBOX').attr({
        'src': src,
      });
      $('#CHATBOX').css({
      'left': pos.left - i.width + 'px',
      'top': pos.top - i.height + 'px'
    });
    }
  });
  $(document).on('mouseleave', 'li[id^="summary_"]', function () {
    $('#CHATBOX').hide();
  });//*/ // Doesn't work :(

  document.head.innerHTML += '<style>' +
    '@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic|Open+Sans:400,400italic,700,700italic&subset=latin,greek);' +
    'body { font-family: "Open Sans"; font-size: 12px; }' +

    '.button { cursor: pointer; background: #96db62; border: none; border-bottom: 1px solid rgb(106, 194, 65) }' +
    '.button:hover { background: #51cc47; border-bottom-color: #449656; }' +

    '.favorite-room-vote { background: url(https://i.stack.imgur.com/DhUx0.png); background-size: 16px 16px }' +
    '.favorite-room-vote.favorite-room { background: url(https://i.stack.imgur.com/lbBdl.png); background-size: 16px 16px }' +

    '.message:hover { border: 1px solid #e3e3e3 !important }' +

    '.message:hover .action-link, .message:hover .action-link .img.menu { background-color: #F3F3F3 !important }' +
    '.message:hover .action-link .img.menu { background-image: url(https://i.stack.imgur.com/3gBKh.png) !important; background-size: 16px 16px; background-position: 0px -1px !important; }' +

    '.vote-count-container.stars .img { background-image: url(https://i.stack.imgur.com/DhUx0.png) !important; background-size: 10px 10px; background-position: initial !important; }' +
    '.vote-count-container.stars.user-star .img { background-image: url(https://i.stack.imgur.com/lbBdl.png) !important; }' +

    '.monologue { margin-bottom: 0; padding-top: 0; }' +
    '.monologue:first-child .messages { border-top: 1px solid #F2F2F2 }' +
    '.messages { background-color: #fff; padding: 8px 8px 8px 0px; border-radius: 0; border-top: none }' +

    '.catchup-marker { border: none !important; margin-top: 10px }' +
    '.catchup-marker .messages { border-top: 1px solid #F2F2F2; }' +

    '.popup { border-radius: 2px; border: none; box-shadow: 0 0 8px #9C9C9C }' +
    '.popup .small-site-logo { right: initial; top: 38px }' +

    '#footer-legal a { color: #366fb3 !important }' +

    '#sidebar { background: #fbfbfb; box-shadow: 5px 0px 5px -3px #EEE inset; padding-left: 3px } ' +

    'input[type=text], #input, #chat-body input#searchbox { border-radius: 2px; border: 1px solid #c2c2c2; padding: 3px 2px !important; box-shadow: none; outline: none; -webkit-transition: box-shadow 0.30s ease-in-out; -moz-transition: box-shadow 0.30s ease-in-out; -ms-transition: box-shadow 0.30s ease-in-out; -o-transition: box-shadow 0.30s ease-in-out; transition: box-shadow 0.30s ease-in-out }' +
    'input[type=text]:focus, #input:focus, #chat-body input#searchbox:focus { outline: none; box-shadow: 0px 0px 4px #3AE; border: 1px solid #70d2ff; }' +
    '#input:hover { box-shadow: 0px 0px 6px #50c8ff; }' +

    'span.mention { padding: 0px 3px; background: #D2FFCC !important }' +
    '</style>';
}

//////////////////////////////////////////////////////////
///////////////    END CHAT STYLES    ////////////////////
//////////////////////////////////////////////////////////

// what is this for?
//x=document.getElementsByClassName('community-bulletin')[0].getElementsByClassName('question-hyperlink')
//for (var i=0;i<x.length;i++){
//  x[i].style.color=META_LINK_COLOR
//}

var siteProperties = site == 'meta' ? meta : main;

if (site === 'main' || site === 'meta') {
  applyCss();

  if (main.REPLACE_NAMES) {
    replaceNames();
  }

  $('#search input').attr('placeholder', siteProperties.SEARCH_TEXT);
  $('#search input').queue('expand', function () {});
  $('#nav-askquestion').text(site === 'main' ? 'Post Challenge' : 'Ask Question');
  $('.bulletin-title:contains("Featured on Meta")').html('<a href="//codegolf.meta.stackexchange.com" class="bulletin-title" style="color: inherit !important"> Meta </a>');

  addSettingsPane();

  showProposeChallengeButton();

  if (site == 'main') {
    document.getElementById('nav-questions').textContent = 'Challenges';
    showLeaderboard();
    // either editing or asking a question
    if (/questions\/ask/.test(document.location.href)) {
      $('#wmd-preview').after('<div>Before you post, take some time to read through the <a href="https://codegolf.meta.stackexchange.com/questions/1061/loopholes-that-are-forbidden-by-default" target="_blank">forbidden loopholes</a> if you haven\'t done so already.</div>');
    }
  }

  if (site === 'meta') {
    // show meta logo
    qS('#hlogo > a').innerHTML = '<table id="newlogo"><tr><td><img src="' + meta.DISP_ICON + '" height=60></td><td>Programming Puzzles &amp; Code Golf <span class="meta-title" style="font-size: 14px; color: #CF7720">meta</span></td></tr></table>';

    if (window.location.href.indexOf('/2140/') > 0) showSandboxMsg();
  }

  // tio.net (WIP) support
  if (main.USE_AUTOTIO && window.location.pathname.indexOf('/questions/') > -1) { // question
    breakoutTIOLinks();
  }

  // replace all icons with the sites favicon
  try {
    qS('link[rel$=\'icon\']').href = siteProperties.FAVICON;
  } catch (e) {}

  if (PARSE_CODEBLOCKS) showByteCounts();

  // apply background image
  $('body .container').prepend('<div style="position: absolute;width: inherit; z-index: 0; height: 130px; background: url(' + siteProperties.BACKGROUND_IMAGE + '); background-attachment: fixed; background-size: 50%;"></div>');

  $('.bounty-indicator, .bounty-award').css('background-color', main.BOUNTY_INDICATOR);
  $('.started a:not(.started-link)').css('color', '#487D4B');

  // does this really need to be in setTimeout?
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.getElementById('footer').setAttribute('style', 'background: transparent url("' + siteProperties.BACKGROUND_IMAGE + '") repeat fixed; background-size: 50%;');
    }, 300);
  });

  // identify 404
  if (~document.title.indexOf('Page Not Found - Programming Puzzles & Code Golf')) {
    console.log('404, PAGE NOT FOUND');
    style404();
  }

  if (main.SHOW_QOD_WIDGET && site == 'main')
    addQuestionOfTheDay();

  showVoteCounts();
}

////////////////////////////////////////////////////////////////////
//////////////////                           ///////////////////////
//////////////////        STTINGS PANE       ///////////////////////
//////////////////                           ///////////////////////
////////////////////////////////////////////////////////////////////

function addSettingsPane() {
  // Options Menu
  $('.topbar-wrapper > .network-items').append('<a id="USER_Opt" class="topbar-icon yes-hover" style="z-index:1;width: 36px; background-image: url(' + main.SPRITE_SHEET + '); background-position: 0px 0px;"></a>');

  $('body').prepend(
    '<div id="USER_OptMenu" style="width: inherit; height: inherit; display: none;">' +
    '    <div id="USER_Backblur" style="position:fixed;z-index:2;width:100%;height:100%;background:rgba(0,0,0,0.5)"></div>' +
    '    <div style="position:fixed;z-index:3;width:40%;min-width:600px;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);background:' + optionbox.BACKGROUND_COLOR + ';padding:1em;" class="settings-page">' +
    '       <h1>Userscript Options</h1>' +
    '       <div style="/*width:50%;height:100%;float:left;*/max-height: 70vh;overflow-y: scroll;/*! overflow-x: none; */">' +
    '           <div class="inner-container inner-container-flex">' +
    '               <div class="title-box">' +
    '                   <div class="title">' +
    '                       Theme' +
    '               </div></div>' +
    '               <div class="content">' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool" data-var="main.GOAT_MODE" id="goat-mode" type="checkbox">' +
    '                           <label for="goat-mode">Use goats instead of boats</label>' +
    '                   </div></div>' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool" data-var="main.BACKGROUND_LIGHT" id="light_bg_on" type="checkbox">' +
    '                           <label for="light_bg_on">Use Lighter Background</label>' +
    '                   </div></div>' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool" data-var="main.MODE_DARK" id="dark_theme_on" type="checkbox">' +
    '                           <label for="dark_theme_on">Use Dark Theme <span style="color: #aaa;/*! font-size: 0.6em; *//*! position: center; */">(WIP)</span>' +
    '                           </label>' +
    '                   </div></div>' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool"  data-var="main.RUN_IN_CHAT" id="chat_on" type="checkbox">' +
    '                           <label for="chat_on">Use modified theme in chat</label>' +
    '           </div></div></div></div>' +
    '           <div class="inner-container inner-container-flex">' +
    '               <div class="title-box">' +
    '                   <div class="title">' +
    '                       Features' +
    '               </div></div>' +
    '               <div class="content">' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool" data-var="main.USE_LEADERBOARD" id="useleader" type="checkbox">' +
    '                           <label for="useleader">Use Auto Leaderboard</label>' +
    '                   </div></div>' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool" data-var="main.SHOW_QOD_WIDGET" id="useqod" type="checkbox">' +
    '                           <label for="useqod">Show the Challenge Of The Day&trade; widget</label>' +
    '                   </div></div>' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool" data-var="main.USE_AUTOTIO" id="usetio" type="checkbox">' +
    '                           <label for="usetio">Use Auto-TryItOnline™ execution</label>' +
    '                   </div></div>' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool" data-var="main.REPLACE_NAMES" id="repnames" type="checkbox">' +
    '                           <label for="repnames">Replace common usernames <span style="color: #aaa;/*! font-size: 0.6em; *//*! position: center; */">(WIP)</span></label>' +
    '                   </div></div>' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <input class="OPT_Bool" data-var="main.SHOW_BYTE_COUNTS" id="showbcts" type="checkbox">' +
    '                           <label for="showbcts">Show byte counts</span></label>' +
    '                   </div></div>' +
    '           </div></div>' +
    '           <div class="inner-container inner-container-flex">' +
    '               <div class="title-box">' +
    '                   <div class="title">' +
    '                       Challenge of the day' +
    '               </div></div>' +
    '               <div class="content">' +
    '                   <div class="row">' +
    '                       <div class="col-12 with-padding">' +
    '                           <p>Number of questions shown</p>' +
    '                           <select id="qod-item-cnt">' +
    '                               <option value="qs-3">3</option>' +
    '                               <option value="qs-4">4</option>' +
    '                               <option value="qs-5">5</option>' +
    '                               <option value="qs-6">6</option>' +
    '                               <option value="qs-7">7</option>' +
    '                               <option value="qs-8">8</option>' +
    '                               <option value="qs-9">9</option>' +
    '                           </select>' +
    '                   </div></div>' +
    '                   <div class="row" style="margin-top:1.2em;">' +
    '                       <div class="col-12">' +
    '                           Always show these tags: <span style="color: #999;">(format is \'tag-1,tag-2,tag-n,...\' for as many tags as you want)</span>' +
    '                           <br>' +
    '                           <input id="qod-always-shown-tags" type="text">' +
    '           </div></div></div></div>' +
    '           <div class="inner-container inner-container-flex">' +
    '               <div class="title-box">' +
    '                   <div class="title">' +
    '                       Extras' +
    '               </div></div>' +
    '               <div class="content">' +
    '                   <div class="row">' +
    '                       <div class="col-12">' +
    '                           <p>What text to use for the porpise challenge button?</p>' +
    '                           <select id="proposechoice">' +
    '                               <option value="Porpoise">Porpoise Challenge</option>' +
    '                               <option value="Propose">Propose Challenge</option>' +
    '                               <option value="Propoise">Propoise Challenge</option>' +
    '                   </select></div></div>' +
    '       </div></div></div>' +
    '       <button onclick="location.reload()" style="float: right;margin-top: 1em;">Apply Changes</button>' +
    '</div></div>');

  $('#proposechoice').val(main.PROPOSE);
  $('#proposechoice').change(function () {
    var str = $(this).find('option:selected').val();
    GM_setValue('main.PROPOSE', str);
  });
  $('#qod-item-cnt').val('qs-' + main.QOD_NUMBER_OF_QS_SHOWN);
  $('#qod-item-cnt').change(function () {
    var n = +$(this).find('option:selected').val().slice(3);
    GM_setValue('QOD_NUMBER_OF_QS_SHOWN', +n);
    resetData();
  });
  $('#qod-always-shown-tags').val(main.QOD_ALWAYS_SHOWN_TAGS.join());
  $('#qod-always-shown-tags').keypress(function () {
    var str = $('#qod-always-shown-tags').val().split(',');
    console.log('putting', str, 'old', main.QOD_ALWAYS_SHOWN_TAGS);
    GM_setValue('QOD_ALWAYS_SHOWN_TAGS', JSON.stringify(str));
    resetData();
  });

  $('#USER_Opt, #USER_Backblur').click(function () {
    $('#USER_OptMenu').fadeToggle(50);
  });
  $('.OPT_Bool').prop('checked', function () {
    console.log('checking', $(this).data('var'), eval($(this).data('var')));
    return eval($(this).data('var'));
  });
  $('.OPT_Bool').change(function () {
    GM_setValue($(this).data('var'), $(this).is(':checked'));
  });
  $('<a>')
    .addClass('topbar-icon yes-hover')
    .css({
      'z-index': 1,
      'width': '36px',
      'background-size': '19px 19px',
      'background-position': '8px 7px',
      'background-image': 'url(//i.imgur.com/n246U22.png)'
    })
    .attr({
      id: 'toggleSite',
      href: '//codegolf' + (site === 'meta' ? '' : '.meta') + '.stackexchange.com',
      title: 'Switch to ' + (site === 'meta' ? 'main' : 'meta')
    })
    .appendTo('.network-items');
}

function showSandboxMsg() {
  $('#wmd-preview').after('<div>Try reading through <a href="https://codegolf.meta.stackexchange.com/q/8047">the things to avoid when writing challenges</a> before you post.</div>');
}

function showByteCounts() {
  $('.answer').each(function () {
    // Find the first header or strong element (some old posts use **this** for header) and set header to its text
    var header = $(this).find('h1, h2, h3, strong').first().text();
    $(this).find('pre code').each(function () {
      var text = $(this).text().replace('\r\n', '\n');
      $(this).parent().before('<div style="padding-bottom:4px;font-size:11px;font-family:' + TEXT_FONT + '">' + bytes(text, header) + ', ' + formatChars(text) + '</div>');
    });
  });
}

function style404() {
  var TEXT = $('#mainbar-full > .leftcol > p')[0];
  if (TEXT) {
    TEXT.textContent = 'We couldn\'t find the page you wanted. We did, however, find this program.';
  }
  $('#mainbar-full > .rightcol > img').attr('src', siteProperties.PAGE404);
}

function showProposeChallengeButton() {
  $('div.nav.askquestion ul').append('<li><a href="https://codegolf.meta.stackexchange.com/questions/2140/sandbox-for-proposed-challenges#show-editor-button" id="nav-asksandbox" title="Propose a question in the sandbox">' + main.PROPOSE + ' Challenge</a></li>');
  document.head.innerHTML += '<script src="https://cdn.sstatic.net/Js/wmd.en.js"></script>';
}

function showVoteCounts() {
  /*=== SHOWS VOTE COUNTS ===*/
  try {
    void

    function (t) {
      var e = t.head || t.getElementsByTagName('head')[0] || t.documentElement,
        o = t.createElement('style'),
        n = '/*Added through UserScript*/.vote-count-post{cursor:pointer;}.vote-count-post[title]{cursor:default;}.vote-count-separator{height:0;*margin-left:0;}';
      e.appendChild(o);
      if (o.styleSheet) o.styleSheet.cssText = n;
      else
        o.appendChild(t.createTextNode(n));
      var s = t.createElement('script');
      s['textContent' in s ? 'textContent' : 'text'] = '(' + function () {
        var t = location.protocol + '//api.stackexchange.com/2.0/posts/',
          e = '?filter=!)q3b*aB43Xc&key=DwnkTjZvdT0qLs*o8rNDWw((&site=' + location.hostname,
          o = 1,
          n = StackExchange.helpers,
          s = $.fn.click;
        $.fn.click = function () {
          return this.hasClass('vote-count-post') && !o ? this : s.apply(this, arguments);
        };
        var r = function (s) {
          var r, a = $(this),
            i = this.title;
          if (!(/up \/ /.test(i) || /View/.test(i) && o)) {
            o = 0;
            var c = a.siblings('input[type="hidden"]').val();
            if (c || (r = a.closest('[data-questionid],[data-answerid]'), c = r.attr('data-answerid') || r.attr('data-questionid')), c || (r = a.closest('.suggested-edit'), c = $.trim(r.find('.post-id').text())), c || (r = a.closest('.question-summary'), c = /\d+/.exec(r.attr('id')), c = c && c[0]), !c) return void console.error('Post ID not found! Please report this at https://stackapps.com/q/3082/9699');
            n.addSpinner(a);
            $.ajax({
              type: 'GET',
              url: t + c + e + '&callback=?',
              dataType: 'json',
              success: function (t) {
                t = t.items[0];
                var e = t.up_vote_count,
                  o = t.down_vote_count;
                e = e ? '+' + e : 0;
                o = o ? '-' + o : 0;
                $('.error-notification').fadeOut('fast', function () {
                  $(this).remove();
                });
                a.css('cursor', 'default').attr('title', e + ' up / ' + o + ' down').html('<div style="color:green">' + e + '</div><div class="vote-count-separator"></div><div style="color:maroon">' + o + '</div>');
              },
              error: function (t) {
                n.removeSpinner();
                n.showErrorPopup(a.parent(), t.responseText && t.responseText.length < 100 ? t.responseText : 'An error occurred during vote count fetch');
              }
            });
            s.stopImmediatePropagation();
          }
        };
        if ($.fn.on)
          $(document).on('click', '.vote-count-post', r);
        else
          $(document).delegate('.vote-count-post', 'click', r);
      } + ')();';
      e.appendChild(s);
      s.parentNode.removeChild(s);
    }(document);
  } catch (e) {
    console.log('An error occured loading vote distribution viewer thing:', e);
  }
}

function breakoutTIOLinks() {
  $('.answer').each(function () {
    var tiolinks = $(this).find('a[href*="tryitonline.net"]');
    if (tiolinks[0]) {
      // They are tryitonline links
      var counter = 0;
      var run = function run($this) {
        var parts = {};
        if ($this.attr('href').split('#')[1]) {
          var _parts = $this.attr('href').split('#')[1].split('&').map(function (i) {
            return [i.split('=')[0], i.split('=')[1]];
          }).forEach(function (l) {
            parts[l[0]] = l[1];
          });

          try {
            console.log((parts.code || '').replace(/\s+/g, ''));
            console.log((parts.input || '').replace(/\s/g, ''));
            var code = escape(atob((parts.code || '').replace(/\s+/g, '')));
            var input = escape(atob((parts.input || '').replace(/\s/g, '')));
            var url = $this.attr('href').match(/https?:\/\/[^\/]+/)[0];
            if (url && code) { // Was able to get data
              var r = new XMLHttpRequest();
              var running = false;
              var uuid = '';
              var output = '';
              r.open('POST', url + '/cgi-bin/backend');
              running = true;
              r.onreadystatechange = function () {
                if (running && r.responseText.length > 32) {
                  uuid = r.responseText.substr(0, 32);
                }
                if (r.responseText.length < 100033) {
                  output = r.responseText.substr(33);
                }
                if (r.readyState === 4) {
                  output = r.responseText.substr(33);
                  running = false;
                  $this.after('<span style="padding-left: 5px; font-size: 10px;">Try it online result: <pre id="tiouuid-' + uuid + '"></pre></span>');
                  $('#tiouuid-' + uuid).text(output);
                  if (counter + 1 < tiolinks.length) run(tiolinks.eq(counter++));
                }
              };
              r.responseType = 'text/plain;charset=UTF-8';
              r.send('code=' + code + '&input=' + input);
            }
          } catch (e) {
            console.log('Bad TIO™ Permalink.', e);
          }
        }
        if (tiolinks.eq(counter)[0]) run(tiolinks.eq(counter++));
      };
      run(tiolinks.eq(counter++));
    }
  });
}

function showLeaderboard() {
  qS('#hlogo > a').innerHTML = '<table id="newlogo"><tr><td><img src="' + main.FAVICON + '" height=60></td><td>Programming Puzzles &amp; Code Golf</td></tr></table>';
  // Leaderboard
  if (main.USE_LEADERBOARD && $('.post-taglist .post-tag[href$="code-golf"]')[0] && !$('.post-taglist .post-tag[href$="tips"]')[0] && $('.answer')[1]) { // Tagged code-golf and has more than 1 answers
    var answers = [];
    loadAnswers(function (json) {
      answers = json.map(function (i, l, a) {
        i.body = i.body.replace(/[\u2010-\u2015\u2212]/g, '-').replace(/^(?!<p><strong>|<h\d>)(.(?!<p><strong>|<h\d>))*/, '').replace(/<(strike|s|del)>.*?<\/\1>/g, '').replace(/<a [^>]+>(.*)<\/a>/g, '$1').replace(/\(\s*(\d+)/g, ', $1').replace(/\s*-\s+|:\s*/, ', ').replace(/(\d+)\s*\+\s*(\d+)/g, function (_, x, y) {
          return +x + (+y);
        });
        var copyvalue = i.body;
        var header = ((copyvalue.match(/<(h\d|strong)>(.+?)<\/\1>/) || [])[2] || '')
          .replace(/<(\\a|a .*?)>/g, '');
        var j = +(
          /no[nt].?competi(?:ng|tive)|invalid|cracked/i.test(header) ? NaN :
          (header.match(/.+?(-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/i) || [])[1] ||
          (header.match(/[^,\d]+,\s+(-?\d+(?:\.\d+)?)\s*(?:\n|$)/i) || [])[1] ||
          (i.body.match(/(?:<h\d>|<p><strong>).+?(-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/i) || [])[1] ||
          (i.body.match(/^\s*(?:<h\d>|<p><strong>).*?(-?\d+(?:\.\d+)?)\D*?<\/(?:h\d|strong)>/i) || [])[1]
        );
        i.body = i.body.replace(RegExp(',?\\s*' + j + '.*'), '');
        // Taken (and modified) from https://codegolf.stackexchange.com/a/69936/40695
        var e = ((copyvalue.match(/<(h\d|strong)>(.+?)<\/\1>/) || [])[2] || 'Unknown Language').replace(/<.*?>/g, '').replace(/^([A-Za-z]+)\s+\d+$/, '$1').replace(/([\–\|\/\-:\—,]\s*\d+\s*(b[l]?y[te]{2}s?|Lab  ?View|char[a-z]*|codels?)\s*)+/g, '').replace(/(,| [-&(–—5]| [0-7]\d)(?! W|...\)).*/g, '').replace(/2 |:/g, '').replace(/(Ver(sion)?.?\s*)\d{2,}w\d{2,}a/g, '');
        return [j, i, copyvalue, e];
      });
      var lv = 0;
      answers = answers.filter(function (a) {
        return !isNaN(a[0]);
      }).sort(function (a, b) {
        return a[0] - b[0];
      });
      var generatedanswertable = answers.map(function (l, i, a) {
        if ((a[i - 1] || [NaN])[0] !== l[0]) lv = (i || 0) + 1;
        return '<tr><td>' + lv + '</td><td><a href="' + l[1].owner.link + '">' + l[1].owner.display_name + '</a></td><td>' + (l[3] /*(l[2].match(/(?:<h\d>|<p><strong>)(.+?)[,  -]\s*(?:(?:\d*\.\d+|\d+)(?:\s*%)?(?:\s*[+*\/\-]\s*(?:\d*\.\d+|\d+)(?:\s*%)?)+\s*=\s*)?(?:-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/)||[])[1]||(l[2].match(/\s*(?:<h\d>|<p><strong>)(\s*<a [^ >]+.+?<\/a>|(?:[#A-Za-z_\s\.\u00FF-\uFFFF!?]|(?:(?=\d+[^\d\n]+\d+\D*(?:<\/|$|\n))\d)|(?:(?=-\s?[A-Za-z_\u00FF-\uFFFF!?]).)|(?:(?=.+(,)),))+)/)||[0,'Lang N/A'])[1]*/ ).trim() + '</td><td>' + l[0] + ' bytes</td><td><a href="' + l[1].link + '">Link</a></td></tr>';
      });
      var tryitonlineattempt = $(answers[0][2]).find('a[href*=".tryitonline.net"]').attr('href');
      $('#answers').prepend('<div style="border: 1px solid #e0e0e0; border-left: none; border-right: none; margin: 15px 0px; padding: 15px;"> <b>The current winner</b> is <a href="' + answers[0][1].owner.link + '">' + answers[0][1].owner.display_name + '&apos;s</a> ' + answers[0][3] + ' <a href="' + answers[0][1].link + '">answer</a> at ' + answers[0][0] + ' bytes ' + (tryitonlineattempt ? ' &#8213 <a href="' + tryitonlineattempt + '">TryItOnline&trade;</a>!' : '') + '</div>');
      $('.question .post-text').append('<span><a id="USER_BOARD_TEXT">Show Answer Leadboard ▶</a></span>' +
        '<div id="USER_BOARD" style="display:none"><table class="LEADERBOARD"><thead><tr><td>Rank</td><td>Author</td><td>Language</td><td>Score</td><td>Link</td></tr></thead><tbody>' + generatedanswertable.join('\n') + '</tbody></table> </div>');
      $('#USER_BOARD_TEXT').click(function () {
        $('#USER_BOARD').slideToggle(50, function () {
          $('#USER_BOARD_TEXT').text(function () {
            return $('#USER_BOARD').is(':visible') ? 'Hide Answer Leadboard ▼' : 'Show Answer Leadboard ▶';
          });
        });
      });
    });
    //qS('#hlogo > a').innerHTML = '<table id=\'newlogo\'><tr><td><img src=\'' + main.FAVICON + '\' height=60></td><td>Programming Puzzles &amp; Code Golf</td></tr></table>';

  }
}

function applyCss() {

  console.log('applying the css', siteProperties);
  // style
  $('#mainbar').css('padding', '15px');
  document.head.innerHTML +=
    ('<style>@import url(' + FONT_URL + ');' +
      'body{color: $$TEXT_COLOR}' +
      'code,pre{color:$$CODE_COLOR;background-color:$$CODE_BACKGROUND}' +
      '.topbar{background:$$TOPBAR}' +
      '.label-key{color:$$LABEL_KEY}' +
      '.label-key b,.label-key strong{color:$$LABEL_KEY_B}' +
      '.module h4{color:$$MODULE_H4}' +
      '.owner{background:$$OWNER}' +
      '.user-info{color:$$USER_INFO}' +
      '.question-status{background:$$QUESTION_STATUS}' +
      '.question-hyperlink,.answer-hyperlink,#hot-network-questions ul a{color:$$HYPERLINK}' +
      '.question-hyperlink:visited,.answer-hyperlink:visited,#hot-network-questions ul a:visited{color:$$HYPERLINK_VISITED}' +
      '.post-text a,.comment-text a:not(.comment-user){color:$$POST_HYPERLINK}' +
      '.post-text a:visited,.comment-text a:not(.comment-user):visited{color:$$POST_HYPERLINK_VISITED}' +
      '.envelope-on,.envelope-off,.vote-up-off,.vote-up-on,.vote-down-off,.vote-down-on,.star-on,.star-off,.comment-up-off,.comment-up-on,.comment-flag,.edited-yes,.feed-icon,.vote-accepted-off,.vote-accepted-on,.vote-accepted-bounty,.badge-earned-check,.delete-tag,.grippie,.expander-arrow-hide,.expander-arrow-show,.expander-arrow-small-hide,.expander-arrow-small-show,.anonymous-gravatar,.badge1,.badge2,.badge3,.gp-share,.fb-share,.twitter-share,#notify-containerspan.notify-close,.migrated.to,.migrated.from{background-image:url(\'$$SPRITE_SHEET\');background-size: initial;}' +
      '.youarehere{color:$$CURR_TAB_COLOR !important;border-bottom:2px solid $$CURR_TAB_COLOR !important;}' +
      '#sidebar #beta-stats, #sidebar #promo-box{background:$$RIGHTBAR_BG;border:$$RIGHTBAR_BORDER}' +
      (siteProperties.BOUNTY_COLOR ? '.bounty-indicator-tab{background:$$BOUNTY_BG_COLOR;color:$$BOUNTY_COLOR !important;}' : '') +
      '#sidebar .module.community-bulletin{background:$$BULLETIN_BG_COLOR;}' +
      '.bulletin-title{color:$$BULLETIN_TITLE;}' +
      'div.module.newuser,#promo-box{border-color:#e0dcbf;border-style:solid;border-width:1px;}' +
      '.yes-hover{cursor:pointer !important;}' +
      '.qod-item { display: table }' +
      '.qod-item > *{ display: table-cell; vertical-align:middle }' +
      '.qod-item > *:not(.post-tag) { font-weight: normal; font-size: 12px; white-space: normal; padding-left: 5px; }' +
      '.qod-item:not(:first-child) { margin-top: 5px; }' +
      '.LEADERBOARD {border-collapse: collapse} .LEADERBOARD td { padding: 6px 8px } .LEADERBOARD tr:nth-child(even) { background-color: #F1F1F1 } .LEADERBOARD thead { border-bottom: 1px solid #DDD }' +
      'html,body{font-family:' + TEXT_FONT + '}' +
      'a.badge { color: white !important }' +
      '#content{margin-top: 7px;}' +
      '#footer #footer-sites a, #footer th {color: #BFBFBF;}' +
      '.container{box-shadow: none !important;}' +
      '.nav.askquestion li { display: block !important; }' +
      'body,#content{background:$$STATS_COLOR !important;}' +
      '#hmenus > div.nav:not(.mainnavs) a{text-align:center; color: $$BG_COL;font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;background: $$BG_START;padding: 8px 12px;-webkit-transition: color 0.15s ease, background 0.15s ease;-moz-transition: color 0.15s ease, background 0.15s ease;-ms-transition: color 0.15s ease, background 0.15s ease;-o-transition: color 0.15s ease, background 0.15s ease;}' +
      '#hmenus > div.nav:not(.mainnavs) a:hover{color: $$BG_COL_HOVER;background: $$BG_REV;}' +
      '#sidebar > .module{margin-left: 12px;}' +
      'input[type=submit], input[type=button], button, .button, a.button, a.button:visited, .btn { box-shadow: none; border: 1px solid $$BUTTON_COLOR; background-color: $$BUTTON_COLOR }' +
      '.module.community-bulletin{border: none}' +
      'input[type=submit]:hover, input[type=button]:hover, button:hover, .button:hover, a.button:hover, a.button:visited:hover, .btn:hover,' +
      'input[type=submit]:focus, input[type=button]:focus, button:focus, .button:focus, a.button:focus, a.button:visited:focus, .btn:focus{ box-shadow: none; border: 1px solid $$BUTTON_HOVER; background-color: $$BUTTON_HOVER }' +
      '.mod-flair,.started .mod-flair{ color: ' + MOD_FLAIR + ' !important }.mod-flair:hover,.started .mod-flair:hover{color:' + MOD_FLAIR_HOVER + '}' +
      '#hmenus > div.nav.mainnavs{position: relative; top: 50%; -ms-transform: translateY(-50%);-webkit-transform: translateY(-50%);-moz-transform: translateY(-50%);-o-transform: translateY(-50%); transform: translateY(-50%);}' +
      'div.nav.askquestion li{display:initial;}' +
      '#hmenus{top: 50%;-ms-transform: translateY(-50%);-webkit-transform: translateY(-50%);-moz-transform: translateY(-50%);-o-transform: translateY(-50%);transform: translateY(-50%);}' +
      '#hmenus > div.nav.askquestion li:not(:first-child) > a { margin-top: 5px; }' +
      '#hmenus > div.nav:not(.mainnavs) a{border-radius: $$POST_QUESTION_RADIUS;background:$$POST_QUESTION_COLOR}' +
      '#header{background:$$HEADER_BG_COLOR;}#header *, #hlogo a{color:$$HEADER_TEXT_COLOR;}' +
      'a.post-tag{border-radius: 0;text-align:center;font-family:' + MONOSPACE_FONT + ';font-size:12px;white-space: nowrap;background-color:$$TAG_COLOR;border:none; -webkit-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -moz-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -ms-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -o-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; border-bottom: 2px solid $$TAG_SHADOW_COLOR}' +
      'a.post-tag:hover{border-bottom-color: $$TAG_HOVER_SHADOW_COLOR;background: $$TAG_HOVER; color: white}' +
      'div.module.newuser,div.module.community-bulletin,div.categories{background-color:$$BACKGROUND_COLOR;}' +
      '#newlogo{top:-15px;position:relative;}#newlogo td{padding-right:15px;}#newlogo td:nth-child(2){vertical-align:middle;}#hlogo a{width:600px;}' +
      '.top-footer-links a {text-shadow: 1px 1px white;}' +
      '#footer a { text-shadow: none; color: #78ee74 !important }' +
      '#footer a:visited { color: #78ff74 !important }' +
      '#newlogo, #hlogo a{font-family:' + HEADER_FONT + ';}' +
      '#question-of-the-day-content {padding: 5px;border: 3px solid #d4f493;}' +
      '#question-of-the-day h4 {font-weight: 700;}' +
      '#sidebar > .module {margin-left: 0;}' +

      // fix some links
      '#tabs a:hover, .tabs a:hover, .newnav .tabs-list-container .tabs-list .intellitab a:hover {' +
      'color:#5DA261;' +
      'border-bottom:2px solid #5DA261' +
      '}' +
      'a {' +
      'color:$$LINK_COLOR}' +
      'a:visited {' +
      'color:$$VISITED_LINK_COLOR}' +
      'a:hover {' +
      'color:$$HOVER_LINK_COLOR}' +
      '</style>').replace(/\$\$(\w+)/g, function (_, x) {
      console.log('got to', x);
      return eval(site + '.' + x);
    });
}

function replaceNames() {
  //from https://j11y.io/javascript/replacing-text-in-the-dom-its-not-that-simple/
  $('p').each(function (){
      traverseChildNodes(this);
  });
   
  function traverseChildNodes(node) {
    var next;
    if (node.nodeType === 1) {
      if ((node = node.firstChild)) {
          do {
              next = node.nextSibling;
              traverseChildNodes(node);
          } while((node = next));
      }
    } else if (node.nodeType === 3) {
      if (rReps.test(node.data)) {
        node.data = node.data.replace(rReps, function (match) {
          return repMap[match];
        });
      }
    }
  }
}

function qS(x) {
  return document.querySelector(x);
}

function unicodes(x) {
  return (x.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\n|./g) || []).map(function (c) {
    return c[1] ? (c.charCodeAt(0) & 1023) * 1024 + (c.charCodeAt(1) & 1023) + 65536 : c.charCodeAt(0);
  });
}

function chars(x) {
  return unicodes(x).length;
}

function formatChars(x) {
  var y = chars(x);
  return y + ' char' + (y == 1 ? '' : 's');
}

function formatBytes(x, y) {
  return x + ' ' + y + ' byte' + (x == 1 ? '' : 's');
}

function bytes(code, lang) { // Takes in a length of text and piece of header text, and returns '(# of bytes) (encoding) bytes'
  var ISO_8859_1_langs = /^(Japt|TeaScript|Retina|Pyth|Reng)\b/i;
  var ISO_8859_7_langs = /^(Jolf)\b/;
  var UTF_16_langs = /^(Ziim|Funciton)\b/i;
  var custom_langs = /^(GS2|Seriously|Actually|Unicorn|Jelly|05AB1E|(Dyalog )?APL)\b/i;
  var ISO_8859_1 = /^[\x00-\xFF]*$/;
  var ISO_8859_7 = /^[\u0000-\u00A0\u2018\u2019\u00A3\u20AC\u20AF\u00A6-\u00A9\u037A\u00AB-\u00AD\u2015\u00B0-\u00B3\u0384-\u0386\u00B7\u0388-\u038A\u00BB\u038C\u00BD\u038E-\u03CE]*$/; // Taken from https://stackoverflow.com/a/34800836/4449486
  lang = lang || '';
  if (PARSE_HEXDUMPS && /^[[\da-f]{4,8}:? [\da-f]+ |^[\da-f]+ [\da-f\s]+$/.test(code)) {
    var a = '';
    code.replace(/(?:[\da-f]{2,}:|[\da-f]{6,}) ((?:[\da-f ][\da-f ] ?){10,})[^\n]*\n?/gi, function (_, z) {
      a += z.replace(/\s/g, '');
    });
    if (a) return formatBytes(a.length / 2, 'hex');
    if (/^[\da-f\s-]+$/i.test(code.replace(/\n/g, ''))) return formatBytes(code.replace(/[\s-]/g, '').length / 2, 'hex');
  }
  if ((/iso.?8859.1/i.test(lang) || ISO_8859_1_langs.test(lang)) && ISO_8859_1.test(code)) return formatBytes(chars(code), 'ISO-8859-1');
  if ((/iso.?8859.7/i.test(lang) || ISO_8859_7_langs.test(lang)) && ISO_8859_7.test(code)) return formatBytes(chars(code), 'ISO-8859-7');
  if (/utf.?16/i.test(lang) || UTF_16_langs.test(lang)) return formatBytes(code.length * 2, 'UTF-16');
  if (custom_langs.test(lang)) return formatBytes(chars(code), lang.match(custom_langs)[0]);
  return formatBytes(unicodes(code).map(function (c) {
    return c >> 16 ? 4 : c >> 11 ? 3 : c >> 7 ? 2 : 1;
  }).reduce(function (a, b) {
    return a + b;
  }, 0), 'UTF-8');
}

function loadAnswers(onFinish) {
  var answers = [],
    i = 5;

  function loadPage() {
    $.get(
      'https://api.stackexchange.com/2.2/questions/' +
      String(window.location).match(/\d+/)[0] + '/answers?key=43GcpjKdprvwYoLebJVMOg((&page=' +
      (page++).toString() + '&pagesize=100&order=asc&sort=creation&site=codegolf&filter=!.Fjs-H6J36vlFbqzY4mEMnTsXxwcX', readPage);
  }

  function readPage(data) {
    if (data.hasOwnProperty('error_id'))
      onFinish(data.error_id.toString());
    else {
      answers = answers.concat(data.items);
      if (data.has_more)
        loadPage();
      else
        onFinish(answers, console.log('answers', answers));
    }
  }
  var page = 1;
  loadPage(page, readPage);
}

////////////////////////////////////////////////////////////////////
///////////////                                   //////////////////
///////////////     QUESTON OF THE DAY WIDGET     //////////////////
///////////////                                   //////////////////
////////////////////////////////////////////////////////////////////

/* Add the question of the day widget */
function addQuestionOfTheDay() {
  console.log('adding question of the day');
  var questionOfTheDayHtml = '<div class="module" id="question-of-the-day"><h4 id="h-inferred-tags">Challenges of the Day</h4><div id="question-of-the-day-content"></div></div>';

  if (isTimeToGetNewQs()) {
    resetData();
  }

  // below the blog posts
  var favTags = $('div.module:nth-child(2)');
  if (favTags.length === 0) {
    favTags = $('div.question-stats');
  }

  if (favTags) {
    favTags.after(questionOfTheDayHtml);
    (main.QOD_ALWAYS_SHOWN_TAGS.concat(getOtherTags())).forEach(function (tag) {
      addTag(tag);
    });
  }
  console.log('done adding question of the day');
}

/* Add a tag to the question of the day widget */
function addTag(tag) {
  getQuestion(tag, function (a) {
    $('#question-of-the-day-content').append(
      '<div class="qod-item"><span>' +
      '<a href="/questions/tagged/' + tag + '" class="post-tag user-tag" title="show questions tagged ' + tag + '" rel="tag">' + tag +
      '</a></span><a href="' + a.url + '">' + a.title + '</a></div>');
  });
}

/* get the names of the bottom rotating tags */
function getOtherTags() {
  var dataName = 'other-tags-today';
  var numberOfTags = main.QOD_NUMBER_OF_QS_SHOWN - main.QOD_ALWAYS_SHOWN_TAGS.length;

  var tags = GM_getValue(dataName);
  if (tags) {
    tags = JSON.parse(tags);
  } else {
    tags = new Array(numberOfTags);
    for (var i = 0; i < tags.length; i++) {
      tags[i] = QOD_ALTERNATING_TAGS[Math.floor(Math.random() * QOD_ALTERNATING_TAGS.length)];
      /* if (main.QOD_ALWAYS_SHOWN_TAGS.concat(tags).indexOf(tags[i]) !== -1) { // we failed and need a new tag that wasn't done yet
        i--; } */
    }
    GM_setValue(dataName, JSON.stringify(tags));
  }

  return tags;
}

// check to see if we need to refresh the question list
function isTimeToGetNewQs() {
  var key = 'lastDateRefreshedQOD';
  var lastUpdate = GM_getValue(key) || 0;

  if (lastUpdate !== null && lastUpdate !== undefined) {
    return lastUpdate !== new Date().getDate();
  } else {
    GM_setValue(key, new Date().getDate());
    return false;
  }
}

function resetData() {
  var toRemove = ['other-tags-today'];
  for (var i = 0; i < localStorage.length; i++) {

    var k = localStorage.key(i);
    if (k.indexOf('tag') !== -1 && k.indexOf('QOD') === -1)
      toRemove = toRemove.concat(k);
  }
  console.log('data to remove', toRemove);

  for (var j = 0; j < toRemove.length; j++) {
    localStorage.removeItem(toRemove[j]);
  }

  GM_setValue('lastDateRefreshedQOD', JSON.stringify(new Date().getDate()));
}

/* Get all questions that are taged, are >1yr old, have a score >7, and are not alrady in the QOD widget */
function getValidQuestions(tag, onDone) {
  var url = 'https://api.stackexchange.com/2.2/search/advanced?order=desc&key=DwnkTjZvdT0qLs*o8rNDWw((&min=7&todate=1420070400&sort=votes&closed=False&tagged=' + tag + '&site=codegolf';
  httpGetAsync(url, function (ret) {
    var items = JSON.parse(ret).items;
    var currentUrls = getCurrentUrls();
    items = items.filter(function (x) {
      return currentUrls.indexOf(x.link) === -1;
    });
    onDone(items);
  });
}

function getCurrentUrls() {
  var storageSuffix = '-tag-question';
  var urls = [];
  var vals = GM_listValues();

  for (var i = 0; i < vals.length; i++) {
    var k = vals[i];
    if (k.indexOf(storageSuffix) !== -1) {
      urls = urls.concat(JSON.parse(GM_getValue(k) || '{}').url);
    }
  }
  return urls;
}

/* Check storage for the question, or grab a new one. callback argument is {url: ..., title: ...} */
function getQuestion(tag, callback) {
  var storageSuffix = '-tag-question';
  var item = GM_getValue(tag + storageSuffix);

  if (item) {
    item = JSON.parse(item);
    callback(item);
  } else {
    getValidQuestions(tag, function (ret) {
      var q = ret[Math.floor(Math.random() * ret.length)];
      var urlTitleMap = {
        'url': q.link,
        'title': q.title
      };

      GM_setValue(tag + storageSuffix, JSON.stringify(urlTitleMap));
      callback(urlTitleMap);
    });
  }
}

/* General purpose function, get a http request async */
function httpGetAsync(theUrl, callback) {
  // https://stackoverflow.com/a/4033310/4683264
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open('GET', theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}
