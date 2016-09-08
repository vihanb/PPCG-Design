// ==UserScript==
// @name        PPCG Graduation Script
// @namespace   https://github.com/vihanb/PPCG-Design
// @version     3.8.1
// @description A script to self-graduate PPCG
// @match       *://*.codegolf.stackexchange.com/*
// @match       *://chat.stackexchange.com/*
// @author      PPCG Community
// @grant       none
// @updateURL   https://rawgit.com/vihanb/PPCG-Design/master/ppcg.user.js
// ==/UserScript==

var site = window.location.hostname.slice(0, 4); // main, meta, or chat
if(site === 'code') { // from codegolf.stackexchange.com
  site = 'main';
}

// ["Propose", "Porpoise"], // >:D
var reps = [
  ["Helka Homba", "Calvin's Hobbies"],
  ["HelkaHomba", "CalvinsHobbies"],
  ["Helka", "Calvin"],
  ["fItaJ.png", "qkXJy.png"],
  ["Aqua Tart", "quartata"],
  ["Don Musolini", "Luis Mendo"],
  ["DonMusolini", "LuisMendo"],
  ["AandN", "Adnan"],
  ["A and N", "Adnan"],
  ["lirtosiast", "Thomas Kwa"],
  ["I Go Best", "Geobits"],
  ["IGoBest", "Geobits"],

  //["Code Review", "the evil code reviewers"] ihaichu - EasterlyIrk on behalf of CR.
];

if(($.cookie("RUN_IN_CHAT") !== "true") && site === "chat") return;

function execreps() {
  reps.forEach(function (r) {
    try {
   //   document.body.innerHTML = document.body.innerHTML.replace(RegExp(r[0], "gi"), r[1]);
    } catch(e) {}
  });
}

function qS(x) {
  return document.querySelector(x);
}

function unicodes(x) {
  return (x.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\n|./g) || []).map(function(c) {
    return c[1] ? (c.charCodeAt(0) & 1023) * 1024 + (c.charCodeAt(1) & 1023) + 65536 : c.charCodeAt(0);
  });
}

function chars(x) {
  return unicodes(x).length;
}

function fchars(x) {
  var y = chars(x);
  return y + " char" + (y == 1 ? "" : "s");
}

function bf(x, y) {
  return x + " " + y + " byte" + (x == 1 ? "" : "s");
}

function bytes(x, y) { // Takes in a length of text and piece of header text, and returns "(# of bytes) (encoding) bytes"
  var ISO_8859_1_langs = /^(Japt|TeaScript|Retina|Pyth|Reng)\b/i;
  var ISO_8859_7_langs = /^(Jolf)\b/;
  var UTF_16_langs = /^(Ziim|Funciton)\b/i;
  var custom_langs = /^(GS2|Seriously|Unicorn|Jelly|(Dyalog )?APL)\b/i;
  var ISO_8859_1 = /^[\x00-\xFF]*$/;
  var ISO_8859_7 = /^[\u0000-\u00A0\u2018\u2019\u00A3\u20AC\u20AF\u00A6-\u00A9\u037A\u00AB-\u00AD\u2015\u00B0-\u00B3\u0384-\u0386\u00B7\u0388-\u038A\u00BB\u038C\u00BD\u038E-\u03CE]*$/; // Taken from http://stackoverflow.com/a/34800836/4449486
  y = y || "";
  if (PARSE_HEXDUMPS) {
    var a = "";
    x.replace(/[\da-f]{6,8}:? ((?:[\da-f][\da-f] ?){10,})[^\n]*\n?/gi, function(_, z) {
      a += z.replace(/\s/g, '');
    });
    if (a) return bf(a.length / 2, "hex");
    if (/^[\da-f\s-]+$/i.test(x.replace(/\n/g, ''))) return bf(x.replace(/[\s-]/g, '').length / 2, "hex");
  }
  if ((/iso.?8859.1/i.test(y) || ISO_8859_1_langs.test(y)) && ISO_8859_1.test(x)) return bf(chars(x), "ISO-8859-1");
  if ((/iso.?8859.7/i.test(y) || ISO_8859_7_langs.test(y)) && ISO_8859_7.test(x)) return bf(chars(x), "ISO-8859-7");
  if (/utf.?16/i.test(y) || UTF_16_langs.test(y)) return bf(x.length * 2, "UTF-16");
  if (custom_langs.test(y)) return bf(chars(x), y.match(custom_langs)[0]);
  return bf(unicodes(x).map(function(c) {
    return c >> 16 ? 4 : c >> 11 ? 3 : c >> 7 ? 2 : 1;
  }).reduce(function(a, b) {
    return a + b;
  }, 0), "UTF-8");
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
        onFinish(answers, console.log("answers", answers));
    }
  }
  var page = 1;
  loadPage(page, readPage);
}

var PARSE_CODEBLOCKS = true; // set to false to not parse code block lengths
var PARSE_HEXDUMPS = true; // set to false to not parse hexdump lengths

// Fonts
var HEADER_FONT = 'Lato, "Open Sans", Arial, sans-serif'; // Header text
var TEXT_FONT = '"Open Sans", Lato, "Helvetica Neue", Arial, sans-serif'; // Everything else besides code
var MONOSPACE_FONT = "Inconsolata, monospace"; // Monospace font & Tag font
var FONT_URL = "//fonts.googleapis.com/css?family=Lato:700|Open+Sans|Inconsolata"; // import any webfonts here

// Colors
var MOD_FLAIR = "#F0C800"; // Mod diamond
var MOD_FLAIR_HOVER = "#FFE32E";
/** ~~~~~~~~~~~~~~~~ MAIN SITE CUSTOMIZABLE PROPERTIES ~~~~~~~~~~~~~~~~ **/


var main = {
  FAVICON: "//i.stack.imgur.com/oHkfe.png",
  SPRITE_SHEET: "//cdn.rawgit.com/vihanb/PPCG-Design/master/assets/sprites.svg",
  SEARCH_TEXT: "Search codegolf.SE",

  // Set to empty string for no background image
  BACKGROUND_IMAGE: "//i.stack.imgur.com/4Y7TE.png",
  PAGE404: "http://i.stack.imgur.com/ToEtE.png",
  BG_COL: "#175D2E",
  BG_COL_HOVER: "white",
  BG_START: "white",
  BG_REV: "#329300",


  BACKGROUND_LIGHT: (localStorage.getItem("main.BACKGROUND_LIGHT") === "true"), // Lighter shade of the background, CHANGE THROUGH OPTIONS
  MODE_DARK: (localStorage.getItem("main.MODE_DARK") === "true"),
  NO_LEADERBOARD: (localStorage.getItem("main.NO_LEADERBOARD") === "true"),
  NO_AUTOTIO: (localStorage.getItem("main.NO_AUTOTIO") === "true"),
  PROPOSE: localStorage.getItem("main.PROPOSE") || 'Propose',
  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: "#FAFAFA",
  HEADER_BG_COLOR: "transparent",
  HEADER_BG_IMAGE: "",
  HEADER_TEXT_COLOR: "#FFF",
  CURR_TAB_COLOR: "#62BA15",
  BULLETIN_BG_COLOR: "#fff8dc",
  STATS_COLOR: "#FAFAFA",
  LINK_COLOR: "rgb(60, 100, 60)",
  VISITED_LINK_COLOR: "rgb(30,50,30)",
  HOVER_LINK_COLOR: "rgb(45,75,45)",
  POST_QUESTION_COLOR: "rgba(140,180,140,0.75)",
  POST_QUESTION_CORNER_RADIUS: "5px",
  TEXT_COLOR: "black",
  CODE_COLOR: "black",
  CODE_BACKGROUND: "#EEE",

  TAG_COLOR: "#D4F493",
  TAG_HOVER: "#329300",

  TAG_SHADOW_COLOR: "#BACD56",
  TAG_HOVER_SHADOW_COLOR: "#256C00",

  BUTTON_COLOR: "#6DAB71",
  BUTTON_HOVER: "#5DA261",

  // Specify nothing to make these default color
  BOUNTY_COLOR: "rgb(72,125,75)",
  BOUNTY_BG_COLOR: "rgb(172,225,175)",
  BOUNTY_INDICATOR: "#6DAB71"
};

/** ~~~~~~~~~~~~~~~~ META SITE CUSTOMIZABLE PROPERTIES ~~~~~~~~~~~~~~~~ **/
var meta = {
  FAVICON: "//i.imgur.com/xJx4Jdd.png",
  DISP_ICON: "//i.stack.imgur.com/dY4TQ.png",
  SPRITE_SHEET: "//cdn.rawgit.com/vihanb/PPCG-Design/master/assets/sprites.svg",

  SEARCH_TEXT: "Search meta.codegolf.SE",

  // Set to empty string for no background image
  BACKGROUND_IMAGE: "//i.stack.imgur.com/4535h.png",
  PAGE404: "",
  BG_COL: "#474747",
  BG_COL_HOVER: "#474747",
  BG_START: "rgba(255, 255, 255, 0.8)",
  BG_REV: "white",

  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: "#FAFAFA",
  HEADER_BG_COLOR: "transparent",
  HEADER_TEXT_COLOR: "#FFF",
  CURR_TAB_COLOR: "rgb(72,125,75)",
  BULLETIN_BG_COLOR: "#fff8dc",
  STATS_COLOR: "#FCFCFC", // Content BG
  TAG_COLOR: "",
  TAG_BORDER_COLOR: "",
  BUTTON_COLOR: "#303030",
  POST_QUESTION_COLOR: "rgba(255, 255, 255, 0.75)",
  POST_QUESTION_CORNER_RADIUS: "5px",
  TEXT_COLOR: "black",
  CODE_COLOR: "black",
  CODE_BACKGROUND: "#EEE",

  // Specify nothing to make these default color
  BOUNTY_COLOR: "rgb(72,125,75)",
  BOUNTY_BG_COLOR: "rgb(172,225,175)",
  BOUNTY_INDICATOR: "#6DAB71"
};

var darktheme = {
  BACKGROUND_COLOR: "red",
  BACKGROUND_IMAGE: "//i.stack.imgur.com/vAWfF.png",
  STATS_COLOR: "#364",
  BULLETIN_TITLE: "#000000",
  BULLETIN_BG_COLOR: "rgb(136,170,131)",
  META_LINK_COLOR:"rgb(34,36,38)",
  POST_QUESTION_COLOR: "rgba(134,180,140,0.75)",
  POST_QUESTION_RADIUS: "5px",
  LINK_COLOR: "rgb(160, 213, 162)",
  VISITED_LINK_COLOR: "rgb(110,150,110)",
  RIGHTBAR_BG: "#B0D4AB",
  RIGHTBAR_BORDER: "none",
  TEXT_COLOR: "#D6ECCB",
  CODE_COLOR: "#264730",
  CODE_BACKGROUND: "#BDB"
};

var metadark = {
  STATS_COLOR: "#555",
  BULLETIN_TITLE: "#000000",
  BULLETIN_BG_COLOR: "#AAA",
  META_LINK_COLOR:"rgb(34,36,38)",
  POST_QUESTION_COLOR: "rgba(150,150,150,0.75)",
  POST_QUESTION_RADIUS: "5px",
  LINK_COLOR: "#DDD",
  VISITED_LINK_COLOR: "#BBB",
  HOVER_LINK_COLOR: "#CCC",
  RIGHTBAR_BG: "#B0D4AB",
  RIGHTBAR_BORDER: "none",
  TEXT_COLOR: "#DDD",
  CODE_COLOR: "#222",
  CODE_BACKGROUND: "#CCC"
};

var lightbg = {
  BACKGROUND_COLOR: "red",
  BACKGROUND_IMAGE: "//i.stack.imgur.com/t8GhU.png"
};

var optionbox = { // Customizes option box
  BACKGROUND_TINT: "linear-gradient(rgba(69, 174, 103, 0.57), rgba(73, 166, 83, 0.47))",
  BACKGROUND_COLOR: "#FAFAFA"
};

var BGHEIGHT = 0; // this + 130

if (localStorage.getItem('main.MODE_DARK') == "true") {
  main = $.extend(main, darktheme);
  meta = $.extend(meta, metadark);
}
if (localStorage.getItem('main.BACKGROUND_LIGHT') == "true"){
  main = $.extend(main, lightbg);
  document.body.style.backgroundRepeat="repeat";
}
/** ~~~~~~~~~~~~~~~~ END CSS PROPERTIES ~~~~~~~~~~~~~~~~ **/
document.head.innerHTML += '<style>.favicon-codegolf{background-position: initial !important; background-image: url("' + main.FAVICON + '"); background-size: 100% 100% !important;}' +
  '.favicon-codegolfmeta{background-position: initial !important; background-image: url("' + meta.FAVICON + '"); background-size: 100% 100% !important;}</style>';
$(".small-site-logo").each(function(i, el){
  if($(el).attr("title") === "Programming Puzzles & Code Golf") {
    $(el).attr("src", main.FAVICON);
  }
});
$('[rel="shortcut icon"][href^="//cdn.sstatic.net/Sites/codegolf/img/favicon.ico"]').attr("href", "//i.stack.imgur.com/oHkfe.png")
if(localStorage.getItem('GOAT_MODE') == "true") {
  $('head').append($('<style/>', {html: '.vote-up-off {\
  background-image: url(http://cdn.rawgit.com/somebody1234/Misc-Files/master/upgoat-off.svg) !important;\
  background-size: 100% !important;\
  background-position: 0px 0px;\
}\
.vote-down-off {\
  background-image: url(http://cdn.rawgit.com/somebody1234/Misc-Files/master/downgoat-off.svg) !important;\
  background-size: 100% !important;\
  background-position: 0px 0px;\
}\
.vote-up-on {\
  background-image: url(http://cdn.rawgit.com/somebody1234/Misc-Files/master/upgoat.svg) !important;\
  background-size: 100% !important;\
  background-position: 0px 0px;\
}\
.vote-down-on {\
  background-image: url(http://cdn.rawgit.com/somebody1234/Misc-Files/master/downgoat.svg) !important;\
  background-size: 100% !important;\
  background-position: 0px 0px;\
}'}));
}
var match = $('link[href="//cdn.sstatic.net/codegolf/img/favicon.ico?v=cf"]').attr('href', main.FAVICON);
if(match.length) {
  $("#input-area").css("background", "url(" + "http://i.stack.imgur.com/oqoGQ.png" + ")");
  $("#input-area").css("background-size", "600px 400px");
  if (localStorage.getItem('main.MODE_DARK') == "true") $("#input-area").css("background", "url(" + darktheme.BACKGROUND_IMAGE + ")");
  if (localStorage.getItem('main.BACKGROUND_LIGHT') == "true") $("#input-area").css("background", "url(" + lightbg.BACKGROUND_IMAGE + ")");
  document.head.innerHTML +=
    ("<style>"+
     "a.post-tag{border-radius: 0;text-align:center;font-family:"+MONOSPACE_FONT+";font-size:12px;white-space: nowrap;background-color:$$TAG_COLOR;border:none; -webkit-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -moz-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -ms-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -o-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; border-bottom: 2px solid $$TAG_SHADOW_COLOR}" +
     "a.post-tag:hover{border-bottom-color: $$TAG_HOVER_SHADOW_COLOR;background: $$TAG_HOVER; color: white}"+
     "</style>").replace(/\$\$(\w+)/g, function(_,m){return main[m]});
}

if (site === "chat") {
  $("body").css("background", "white");
  $("#sound").css({
    "background": "url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/200px-Speaker_Icon.svg.png)",
    "background-size": "16px 16px"
  });
  $("#roomname").css("font-family", "'Lato'");
  $("#roomname").css("font-weight", "800");
  $("#searchbox").css("padding-left", "4px !important");
  $('#footer-logo a').text('Programming Puzzles & Code Golf').css('color','#2A2');

  /*  $("body").append('<img id="CHATBOX" style="z-index: 1000; display:none; position: fixed;">');
  $(document).on('mouseenter', 'li[id^="summary_"], li[id^="summary_"] *', function() {
    $("#CHATBOX").show();
    var src = $(this).find('a[href*=".png"],a[href*=".jpeg"],a[href*=".jpg"],a[href*=".gif"],a[href*=".svg"]').attr('href');
    var pos = $(this).get(0).getBoundingClientRect();
    var i = new Image(src);
    i.onload = function() {
      $("#CHATBOX").attr({
        'src': src,
      });
      $("#CHATBOX").css({
      'left': pos.left - i.width + 'px',
      'top': pos.top - i.height + 'px'
    });
    }
  });
  $(document).on('mouseleave', 'li[id^="summary_"]', function() {
    $("#CHATBOX").hide();
  });//*/// Doesn't work :(

  document.head.innerHTML += '<style>'+
    '@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic|Open+Sans:400,400italic,700,700italic&subset=latin,greek);'+
    'body { font-family: "Open Sans"; font-size: 12px; }' +

    '.button { cursor: pointer; background: #96db62; border: none; border-bottom: 1px solid rgb(106, 194, 65) }' +
    '.button:hover { background: #51cc47; border-bottom-color: #449656; }' +

    '.favorite-room-vote { background: url(http://i.stack.imgur.com/DhUx0.png); background-size: 16px 16px }' +
    '.favorite-room-vote.favorite-room { background: url(http://i.stack.imgur.com/lbBdl.png); background-size: 16px 16px }' +

    '.message:hover { border: 1px solid #e3e3e3 !important }' +

    '.message:hover .action-link, .message:hover .action-link .img.menu { background-color: #F3F3F3 !important }' +
    '.message:hover .action-link .img.menu { background-image: url(http://i.stack.imgur.com/3gBKh.png) !important; background-size: 16px 16px; background-position: 0px -1px !important; }' +

    '.vote-count-container.stars .img { background-image: url(http://i.stack.imgur.com/DhUx0.png) !important; background-size: 10px 10px; background-position: initial !important; }' +
    '.vote-count-container.stars.user-star .img { background-image: url(http://i.stack.imgur.com/lbBdl.png) !important; }' +

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

/* These are the tag choices */
var otherTags = ["string", "popularity-contest", "ascii-art", "number",
                 "kolmogorov-complexity", "graphical-output", "king-of-the-hill", "fastest-code",
                 "restricted-source", "arithmetic", "sequence", "game",
                 "tips", "geometry", "number-theory", "random", "primes",
                 "array-manipulation", "date", "image-processing", "graphs",
                 "sorting", "interpreter", "optimization", "parsing",
                 "path-finding", "puzzle-solver", "underhanded", "source-layout",
                 "base-conversion"];

/* Get a cookie (I wish it was a real cookie ;) */
function getCookie(name) {
  // http://stackoverflow.com/a/15724300/4683264
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

/* Get all questions that are taged, are >1yr old, and have a score >7 */
function getValidQuestions(tag, onDone) {
  var url = 'https://api.stackexchange.com/2.2/search/advanced?order=desc&key=DwnkTjZvdT0qLs*o8rNDWw((&min=7&todate=1420070400&sort=votes&closed=False&tagged='+tag+'&site=codegolf';
  httpGetAsync(url, function (ret) {
    onDone(JSON.parse(ret)['items']);
  });
}

//x=document.getElementsByClassName("community-bulletin")[0].getElementsByClassName('question-hyperlink')
//for (var i=0;i<x.length;i++){
//	x[i].style.color=META_LINK_COLOR
//}
/* Check the cookies for the question, or grab a new one. return format is [url, title] */
function getQuestion(tag, callback) {
  // prevent overlap
  var cookieSuffix = '-tag-question';
  // separator is a space
  var cookieVal = getCookie(tag + cookieSuffix);
  if (cookieVal) {
    // parts splits at a space, so the format is [url, word1, word2, word3, ...]
    var parts = cookieVal.split(/ (.+)?/);
    var url = parts[0];
    delete parts[0];// remove the url so we can join the title with a space
    var title = parts.join(' ');
    callback([url, title]);
    return 0;
  }

  getValidQuestions(tag, function (ret) {
    var quest = ret[Math.floor(Math.random()*ret.length)];
    var url = quest['link'];
    var title = quest['title'];
    console.log(title);

    document.cookie = (tag + cookieSuffix)+'='+url+' '+title.replace(/'/g,'&apos;')+';max-age=86400';
    callback([url, title]);
  });
}

/* Add a tag to the question of the day widget */
function addTag(tag) {
  getQuestion(tag, function (a) {
    qS('#question-of-the-day').innerHTML +=
      '<div class="qod-qitem"><span>'+
      '<a href="/questions/tagged/'+tag+'" class="post-tag user-tag" title="show questions tagged \''+tag+'\'" rel="tag">'+tag+
      '</a></span><a href="'+a[0]+'">'+a[1]+'</a></div>';
  });
}

/* General purpose function, get a http request async */
function httpGetAsync(theUrl, callback){
  // http://stackoverflow.com/a/4033310/4683264
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

/* Add the bottom 2 rotating tags to the question of the day widget */
function addOtherTags() {
  var cookieName = 'other-tags-today';
  var tags = getCookie(cookieName);
  if (tags) {tags = tags.split(' ');}
  else {
    tags = [otherTags[Math.floor(Math.random()*otherTags.length)],
            otherTags[Math.floor(Math.random()*otherTags.length)]];
    document.cookie = cookieName + "=" + tags[0] + " " + tags[1] + ";max-age=86400;";
  }

  tags.forEach(function (a) {
    addTag(a);
  });
}

/* Add the question of the day widget */
function addQuestionOfTheDay() {
  var questionOfTheDayHtml = '<div class="module" id="question-of-the-day"><h4 id="h-inferred-tags">Challenges of the Day</h4></div>';

  // below the blog posts
  var favTags = qS('div.module:nth-child(2)');
  if (favTags) {
    favTags.insertAdjacentHTML('afterend', questionOfTheDayHtml);

    addTag('code-golf');
    addTag('code-challenge');//king-of-the-hill
    addTag('math');//fastest-code

    addOtherTags();
  }
}

if (site === "main" || site === "meta") {
  execreps();
  var obj = site == "meta" ? meta : main;

  $("#search input").attr("placeholder", obj.SEARCH_TEXT);
  $("#search input").queue("expand", function(){});
  $("#nav-askquestion").text(site === "main" ? "Post Challenge" : "Ask Question");
  $(".bulletin-title:contains('Featured on Meta')").html('<a href="//meta.codegolf.stackexchange.com" class="bulletin-title" style="color: inherit !important"> Meta </a>');

  // Options Menu
  $(".topbar-wrapper > .network-items").append('<a id="USER_Opt" class="topbar-icon yes-hover" style="z-index:1;width: 36px; background-image: url(' + main.SPRITE_SHEET + '); background-position: 0px 0px;"></a>');
  $("body").prepend('<div id="USER_OptMenu" style="display: none; width: inherit; height: inherit;"><div id="USER_Backblur" style="position:fixed;z-index:2;width:100%;height:100%;background:rgba(0,0,0,0.5)"></div>' +
                    '<div style="position:fixed;z-index:3;width:40%;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);background:' + optionbox.BACKGROUND_COLOR + ';padding:1em;">' +
                    '<h1>Userscript Options</h1><div>' +
                    '<div style="width:50%;height:100%;float:left;">' +
                    '<input class="OPT_Bool" data-var="GOAT_MODE" type="checkbox" id="goat-mode"><label for="goat-moden">Goats instead of boats?</label><br>' +
                    '<input class="OPT_Bool" data-var="main.BACKGROUND_LIGHT" type="checkbox" id="light_bg_on"><label for="light_bg_on">Lighter Background?</label><br>' +
                    '<input class="OPT_Bool" data-var="main.MODE_DARK" type="checkbox" id="dark_theme_on"><label for="dark_theme_on">Dark Theme? (WIP)</label><br>' +
                    '<p>What text to use for the porpise challenge button?</p>' +
                    '<select id="proposechoice">' + 
                    '<option value="Porpoise">Porpoise Challenge</option>' + 
                    '<option value="Propose">Propose Challenge</option>' + 
                    '<option value="Propoise">Propoise Challenge</option>' + 
                    '</select><br/>' + 
                    '<input class="OPT_Bool" type="checkbox" id="chat_on" onclick="$.cookie(\'RUN_IN_CHAT\',this.checked,{domain:\'stackexchange.com\'})"><label for="chat_on">Make design modifications in chat?</label><br>' +
                    '<input class="OPT_Bool" data-var="main.NO_LEADERBOARD" type="checkbox" id="noleader"><label for="noleader">Disable Auto Leaderboard?</label><br>' +
                    '<input class="OPT_Bool" data-var="main.NO_AUTOTIO" type="checkbox" id="notio"><label for="notio">Disable Auto-TryItOnline™ execution?</label>' +
                    '</div><div style="width:50%;height:100%;float:right;">' +
                    '' +
                    '</div></div>For changes to take effect: <button onclick="location.reload()">Refresh</button></div></div>');
  $('#proposechoice').val(main.PROPOSE);
  $('#proposechoice').change(function () {
    var str = $(this).find('option:selected').val();
    localStorage.setItem("main.PROPOSE", str);
  });
  $("#USER_Opt, #USER_Backblur").click(function() {
    $("#USER_OptMenu").fadeToggle(50);
  });
  $(".OPT_Bool").prop("checked", function() {
    return localStorage.getItem($(this).data('var')) === 'true';
  });
  $(".OPT_Bool").change(function() {
    localStorage.setItem($(this).data('var'), $(this).is(':checked'));
    console.log(localStorage.getItem('main.BACKGROUND_LIGHT'));
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
    href: (site === "meta" ? "//" : "//meta.") + 'codegolf.stackexchange.com',
    title: 'Switch to ' + (site === 'meta' ? 'main' : 'meta')
  })
    .appendTo('.network-items');

  $("div.nav.askquestion ul").append('<li><a href="http://meta.codegolf.stackexchange.com/questions/2140/sandbox-for-proposed-challenges#show-editor-button" id="nav-asksandbox" title="Propose a question in the sandbox">'+ main.PROPOSE + ' Challenge</a></li>');
  document.head.innerHTML += '<script src="http://cdn.sstatic.net/Js/wmd.en.js"></script>';

  var answerafter= (/users\/edit/.test(document.location.href) || /questions\/ask/.test(document.location.href)) ? '' : '<div>Before you post, take some time to read through the <a href="http://meta.codegolf.stackexchange.com/questions/1061/loopholes-that-are-forbidden-by-default" target="_blank">forbidden loopholes</a> if you haven\'t done so already.</div>';
  if (site == "main") {
    qS("#hlogo > a").innerHTML = "<table id=\"newlogo\"><tr><td><img src=\"" + main.FAVICON + "\" height=60></td><td>Programming Puzzles &amp; Code Golf</td></tr></table>";
    // Leaderboard
    if (!main.NO_LEADERBOARD && $('.post-taglist .post-tag[href$="code-golf"]')[0] && !$('.post-taglist .post-tag[href$="tips"]')[0] && $(".answer")[1]) { // Tagged code-golf and has more than 1 answers
      var answers = [];
      loadAnswers(function(json) {
        answers = json.map(function(i, l, a) {
          var copyvalue = i.body.slice().replace(/<(strike|s|del)>.*?<\/\1>/g, "");
          var header = ((copyvalue.match(/<(h\d|strong)>(.+?)<\/\1>/) || [])[2] || "")
          i.body = i.body.replace(/^(?!<p><strong>|<h\d>)(.(?!<p><strong>|<h\d>))*/, "").replace(/<(strike|s|del)>.*<\/\1>/g, "").replace(/<a [^>]+>(.*)<\/a>/g, "$1").replace(/\(\s*(\d+)/g, ", $1").replace(/\s*-\s+|:\s*/, ", ");
          var j = +(
            /non.competing/i.test(header) ? NaN :
            (header.match(/.+?(-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/) || [])[1] ||
            (header.match(/[^,\d]+,\s+(\d+)\s*(?:\n|$)/) || [])[1] ||
            (i.body.match(/(?:<h\d>|<p><strong>).+?(-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/) || [])[1] ||
            (i.body.match(/^\s*(?:<h\d>|<p><strong>).*?(\d+)\D*?<\/(?:h\d|strong)>/) || [])[1]
          );
          i.body = i.body.replace(RegExp(",?\\s*" + j + ".*"), "");
          // Taken (and modified) from http://codegolf.stackexchange.com/a/69936/40695
          var e = ((copyvalue.match(/<(h\d|strong)>(.+?)<\/\1>/) || [])[2] || "Unknown Language").replace(/<.*?>/g, "").replace(/^([A-Za-z]+)\s+\d+$/, "$1").replace(/([\–\|\/\-:\—,]\s*\d+\s*(b[l]?y[te]{2}s?|Lab ?View|char[a-z]*|codels?)\s*)+/g, "").replace(/(,| [-&(–—5]| [0-7]\d)(?! W|...\)).*/g, "").replace(/2 |:/g, "").replace(/(Ver(sion)?.?\s*)\d{2,}w\d{2,}a/g, "");
          return [j, i, copyvalue, e];
        });
        var lv = 0;
        answers = answers.filter(function(a) {
          return !isNaN(a[0]);
        }).sort(function(a, b) {
          return a[0] - b[0];
        });
        var generatedanswertable = answers.map(function(l, i, a) {
          if ((a[i - 1] || [NaN])[0] !== l[0]) lv = (i || 0) + 1;
          return '<tr><td>' + lv + '</td><td><a href="'+l[1].owner.link+'">'+l[1].owner.display_name+'</a></td><td>' + (l[3] /*(l[2].match(/(?:<h\d>|<p><strong>)(.+?)[, -]\s*(?:(?:\d*\.\d+|\d+)(?:\s*%)?(?:\s*[+*\/\-]\s*(?:\d*\.\d+|\d+)(?:\s*%)?)+\s*=\s*)?(?:-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/)||[])[1]||(l[2].match(/\s*(?:<h\d>|<p><strong>)(\s*<a [^ >]+.+?<\/a>|(?:[#A-Za-z_\s\.\u00FF-\uFFFF!?]|(?:(?=\d+[^\d\n]+\d+\D*(?:<\/|$|\n))\d)|(?:(?=-\s?[A-Za-z_\u00FF-\uFFFF!?]).)|(?:(?=.+(,)),))+)/)||[0,"Lang N/A"])[1]*/ ).trim() + "</td><td>" + l[0] + ' bytes</td><td><a href="' + l[1].link + '">Link</a></td></tr>';
        });
        var tryitonlineattempt = $(answers[0][2]).find('a[href*=".tryitonline.net"]').attr('href');
        $("#answers").prepend('<div style="border: 1px solid #e0e0e0; border-left: none; border-right: none; margin: 15px 0px; padding: 15px;"> <b>The current winner</b> is <a href="'+answers[0][1].owner.link+'">'+answers[0][1].owner.display_name+'&apos;s</a> '+answers[0][3]+' <a href="'+answers[0][1].link+'">answer</a> at '+answers[0][0]+' bytes ' + (tryitonlineattempt ? ' &#8213 <a href="'+tryitonlineattempt+'">TryItOnline&trade;</a>!' : '') + '</div>');
        $(".question .post-text").append('<span><a id="USER_BOARD_TEXT">Show Answer Leadboard ▶</a></span>' +
                                         '<div id="USER_BOARD" style="display:none"><table class="LEADERBOARD"><thead><tr><td>Rank</td><td>Author</td><td>Language</td><td>Score</td><td>Link</td></tr></thead><tbody>' + generatedanswertable.join("\n") + '</tbody></table> </div>');
        $("#USER_BOARD_TEXT").click(function() {
          $("#USER_BOARD").slideToggle(50, function() {
            $("#USER_BOARD_TEXT").text(function() {
              return $("#USER_BOARD").is(":visible") ? "Hide Answer Leadboard ▼" : "Show Answer Leadboard ▶";
            });
          });
        });
      });
      //qS("#hlogo > a").innerHTML = "<table id=\"newlogo\"><tr><td><img src=\"" + main.FAVICON + "\" height=60></td><td>Programming Puzzles &amp; Code Golf</td></tr></table>";

    }
  } else {
    answerafter='';
    qS("#hlogo > a").innerHTML = "<table id=\"newlogo\"><tr><td><img src=\"" + meta.DISP_ICON + "\" height=60></td><td>Programming Puzzles &amp; Code Golf <span class=\"meta-title\" style=\"font-size: 14px; color: #CF7720\">meta</span></td></tr></table>";
    if (window.location.href.indexOf('/2140/') > 0){ // If on sandbox
      answerafter='<div>Try reading through <a href="http://meta.codegolf.stackexchange.com/q/8047">the things to avoid when writing challenges</a> before you post.</div>';
    }
  }
  $('#wmd-preview').after(answerafter);
  // tio.net (WIP) support
  if (window.location.pathname.indexOf("/questions/") > -1) { // question
    $(".answer").each(function() {
      var tiolinks = $(this).find('a[href*="tryitonline.net"]');
      if (tiolinks[0]) {
        // They are tryitonline links
        var counter = 0;
        function run ($this) {
          var parts = {};
          if ($this.attr('href').split("#")[1]) {
            var _parts = $this.attr('href').split("#")[1].split("&").map(function(i) {
              return [i.split("=")[0],i.split("=")[1]]
            }).forEach(function(l){
              parts[l[0]] = l[1];
            });

            try {
			  console.log(  (parts["code"] || "").replace(/\s+/g, "") );
			  console.log(  (parts["input"] || "").replace(/\s/g, "") );
              var code = escape(atob(  (parts["code"] || "").replace(/\s+/g, "") ));
              var input = escape(atob(  (parts["input"] || "").replace(/\s/g, "") ));
              var url = $this.attr('href').match(/https?:\/\/[^\/]+/)[0];
              if (url && code) { // Was able to get data
                var r = new XMLHttpRequest();
                var running = false;
                var uuid = '';
                var output = "";
                r.open("POST", url + "/cgi-bin/backend");
                running = true;
                r.onreadystatechange = function() {
                  if (running && r.responseText.length > 32) {
                    uuid = r.responseText.substr(0,32);
                  }
                  if (r.responseText.length < 100033) {
                    output = r.responseText.substr(33);
                  }
                  if (r.readyState === 4) {
                    output = r.responseText.substr(33);
                    running = false;
                    $this.after('<span style="padding-left: 5px; font-size: 10px;">Try it online result: <pre id="tiouuid-'+uuid+'"></pre></span>');
                    $("#tiouuid-"+uuid).text(output);
                    if (counter + 1 < tiolinks.length) run(tiolinks.eq(counter++));
                  }
                };
                r.responseType = "text/plain;charset=UTF-8";
                r.send("code=" + code + "&input=" + input);
              }
            } catch(e) { console.log("Bad TIO™ Permalink.", e); }
          };
          if (tiolinks.eq(counter)[0]) run(tiolinks.eq(counter++));
        }
		run(tiolinks.eq(counter++));
      }
    });
  }

  // style
  $("#mainbar").css('padding', '15px');
  document.head.innerHTML +=
    ("<style>@import url(" + FONT_URL + ");" +
     "code,pre{color:$$CODE_COLOR;background-color:$$CODE_BACKGROUND}" +
     ".envelope-on,.envelope-off,.vote-up-off,.vote-up-on,.vote-down-off,.vote-down-on,.star-on,.star-off,.comment-up-off,.comment-up-on,.comment-flag,.edited-yes,.feed-icon,.vote-accepted-off,.vote-accepted-on,.vote-accepted-bounty,.badge-earned-check,.delete-tag,.grippie,.expander-arrow-hide,.expander-arrow-show,.expander-arrow-small-hide,.expander-arrow-small-show,.anonymous-gravatar,.badge1,.badge2,.badge3,.gp-share,.fb-share,.twitter-share,#notify-containerspan.notify-close,.migrated.to,.migrated.from{background-image:url(\"$$SPRITE_SHEET\");background-size: initial;}" +
     ".youarehere{color:$$CURR_TAB_COLOR !important;border-bottom:2px solid $$CURR_TAB_COLOR !important;}" +
     "#sidebar #beta-stats, #sidebar #promo-box{background:$$RIGHTBAR_BG;border:$$RIGHTBAR_BORDER}" +
     (obj.BOUNTY_COLOR ? ".bounty-indicator-tab{background:$$BOUNTY_BG_COLOR;color:$$BOUNTY_COLOR !important;}" : "") +
     "#sidebar .module.community-bulletin{background:$$BULLETIN_BG_COLOR;}" +
     ".bulletin-title{color:$$BULLETIN_TITLE;}" +
     "div.module.newuser,#promo-box{border-color:#e0dcbf;border-style:solid;border-width:1px;}" +
     ".yes-hover{cursor:pointer !important;}" +
     '.qod-qitem { display: table }' +
     '.qod-qitem > *{ display: table-cell; vertical-align:middle }' +
     '.qod-qitem > *:not(.post-tag) { font-weight: normal; font-size: 12px; white-space: normal; padding-left: 5px; }' +
     '.qod-qitem:not(:first-child) { margin-top: 5px; }'+
     ".LEADERBOARD {border-collapse: collapse} .LEADERBOARD td { padding: 6px 8px } .LEADERBOARD tr:nth-child(even) { background-color: #F1F1F1 } .LEADERBOARD thead { border-bottom: 1px solid #DDD }" +
     "html,body{font-family:" + TEXT_FONT + "}" +
     'a.badge { color: white !important }' +
     "#content{margin-top: 7px;}"+
     '#footer #footer-sites a, #footer th {color: #BFBFBF;}'+
     ".container{box-shadow: none !important;}"+
     ".nav.askquestion li { display: block !important; }" +
     'body,#content{background:$$STATS_COLOR !important;}'+
     "#hmenus > div.nav:not(.mainnavs) a{text-align:center; color: $$BG_COL;font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;background: $$BG_START;padding: 8px 12px;-webkit-transition: color 0.15s ease, background 0.15s ease;-moz-transition: color 0.15s ease, background 0.15s ease;-ms-transition: color 0.15s ease, background 0.15s ease;-o-transition: color 0.15s ease, background 0.15s ease;}"+
     "#hmenus > div.nav:not(.mainnavs) a:hover{color: $$BG_COL_HOVER;background: $$BG_REV;}" +
     "#sidebar > .module{margin-left: 12px;}" +
     "input[type=submit], input[type=button], button, .button, a.button, a.button:visited, .btn { box-shadow: none; border: 1px solid $$BUTTON_COLOR; background-color: $$BUTTON_COLOR }" +
     ".module.community-bulletin{border: none}" +
     "input[type=submit]:hover, input[type=button]:hover, button:hover, .button:hover, a.button:hover, a.button:visited:hover, .btn:hover," +
     "input[type=submit]:focus, input[type=button]:focus, button:focus, .button:focus, a.button:focus, a.button:visited:focus, .btn:focus{ box-shadow: none; border: 1px solid $$BUTTON_HOVER; background-color: $$BUTTON_HOVER }" +
     ".mod-flair,.started .mod-flair{ color: " + MOD_FLAIR + " !important }.mod-flair:hover,.started .mod-flair:hover{color:" + MOD_FLAIR_HOVER + "}" +
     "#hmenus > div.nav.mainnavs{position: relative; top: 50%; -ms-transform: translateY(-50%);-webkit-transform: translateY(-50%);-moz-transform: translateY(-50%);-o-transform: translateY(-50%); transform: translateY(-50%);}" +
     "div.nav.askquestion li{display:initial;}"+
     "#hmenus{top: 50%;-ms-transform: translateY(-50%);-webkit-transform: translateY(-50%);-moz-transform: translateY(-50%);-o-transform: translateY(-50%);transform: translateY(-50%);}" +
     "#hmenus > div.nav.askquestion li:not(:first-child) > a { margin-top: 5px; }" +
     "#hmenus > div.nav:not(.mainnavs) a{border-radius: $$POST_QUESTION_RADIUS;background:$$POST_QUESTION_COLOR}" +
     "#header{background:$$HEADER_BG_COLOR;}#header *, #hlogo a{color:$$HEADER_TEXT_COLOR;}" +
     "a.post-tag{border-radius: 0;text-align:center;font-family:"+MONOSPACE_FONT+";font-size:12px;white-space: nowrap;background-color:$$TAG_COLOR;border:none; -webkit-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -moz-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -ms-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -o-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; border-bottom: 2px solid $$TAG_SHADOW_COLOR}" +
     "a.post-tag:hover{border-bottom-color: $$TAG_HOVER_SHADOW_COLOR;background: $$TAG_HOVER; color: white}" +
     "div.module.newuser,div.module.community-bulletin,div.categories{background-color:$$BACKGROUND_COLOR;}" +
     "#newlogo{top:-15px;position:relative;}#newlogo td{padding-right:15px;}#hlogo a{width:600px;}" +
     ".top-footer-links a {text-shadow: 1px 1px white;}" +
     '#footer a { text-shadow: none; color: #78ee74 !important }' +
     '#footer a:visited { color: #78ff74 !important }' +
     "#newlogo, #hlogo a{font-family:" + HEADER_FONT + ";}"+
     "</style>").replace(/\$\$(\w+)/g, function(_, x) {
    return eval(site + "." + x);
  });
  try {
    qS("link[rel$=\"icon\"]").href = obj.FAVICON;
  } catch (e) {}
  if (PARSE_CODEBLOCKS) {
    $(".answer").each(function() {
      // Find the first header or strong element (some old posts use **this** for header) and set h to its text
      var h = $(this).find("h1, h2, h3, strong").first().text();
      $(this).find("pre code").each(function() {
        var t = $(this).text().trim().replace("\r\n", "\n");
        $(this).parent().before('<div style="padding-bottom:4px;font-size:11px;font-family:' + TEXT_FONT + '">' + bytes(t, h) + ", " + fchars(t) + "</div>");
      });
    });
  }
  $("body .container").prepend('<div style="position: absolute;width: inherit; z-index: 0; height: 130px; background: url(' + obj.BACKGROUND_IMAGE + '); background-attachment: fixed; background-size: 50%;"></div>');
  //addQuestionOfTheDay(); // Disabling because of cookie bugs
  $(".bounty-indicator, .bounty-award").css("background-color", main.BOUNTY_INDICATOR);
  document.head.innerHTML += 
    ("<style>" +
     //".question-hyperlink, .answer-hyperlink, #hot-network-questions a{color:$$LINK_COLOR}.question-hyperlink:visited, .answer-hyperlink:visited,.started-link:visited, #hot-network-questions a:visited{color:$$VISITED_LINK_COLOR}" +
     "#tabs a:hover, .tabs a:hover, .newnav .tabs-list-container .tabs-list .intellitab a:hover{color:#5DA261;border-bottom:2px solid #5DA261}" +
     //"a:hover,.question-hyperlink:hover,.answer-hyperlink:hover,.started-link:hover{color:#487D4B}" +
     "a{color:$$LINK_COLOR}a:visited{color:$$VISITED_LINK_COLOR}a:hover{color:$$HOVER_LINK_COLOR}" +
     "</style>").replace(/\$\$(\w+)/g, function(_, x) {
    return eval(site + "." + x);
  }); //workaround for several links
  $(".started a:not(.started-link)").css('color', '#487D4B');
  window.addEventListener("load", function() {
    setTimeout(function() {
      document.getElementById("footer").setAttribute("style", 'background: transparent url("'+obj.BACKGROUND_IMAGE+'") repeat fixed; background-size: 50%;');
    }, 300);
  });
  // identify 404
  if (~document.title.indexOf("Page Not Found - Programming Puzzles & Code Golf")) {
    console.log("404, PAGE NOT FOUND");
    var TEXT = $("#mainbar-full > .leftcol > p")[0];
    if (TEXT) {
      TEXT.textContent = "We couldn't find the page you wanted. We did, however, found this program.";
    }
    $('#mainbar-full > .rightcol > img').attr('src', obj.PAGE404);
  }

  // votes
  if (site === "main" || site === "meta") {
    /*=== SHOWS VOTE COUNTS ===*/
    try {
      void
      function(t) {
        var e = t.head || t.getElementsByTagName("head")[0] || t.documentElement,
            o = t.createElement("style"),
            n = "/*Added through UserScript*/.vote-count-post{cursor:pointer;}.vote-count-post[title]{cursor:default;}.vote-count-separator{height:0;*margin-left:0;}";
        e.appendChild(o), o.styleSheet ? o.styleSheet.cssText = n : o.appendChild(t.createTextNode(n));
        var s = t.createElement("script");
        s["textContent" in s ? "textContent" : "text"] = "(" + function() {
          var t = location.protocol + "//api.stackexchange.com/2.0/posts/",
              e = "?filter=!)q3b*aB43Xc&key=DwnkTjZvdT0qLs*o8rNDWw((&site=" + location.hostname,
              o = 1,
              n = StackExchange.helpers,
              s = $.fn.click;
          $.fn.click = function() {
            return this.hasClass("vote-count-post") && !o ? this : s.apply(this, arguments)
          };
          var r = function(s) {
            var r, a = $(this),
                i = this.title;
            if (!(/up \/ /.test(i) || /View/.test(i) && o)) {
              o = 0;
              var c = a.siblings('input[type="hidden"]').val();
              if (c || (r = a.closest("[data-questionid],[data-answerid]"), c = r.attr("data-answerid") || r.attr("data-questionid")), c || (r = a.closest(".suggested-edit"), c = $.trim(r.find(".post-id").text())), c || (r = a.closest(".question-summary"), c = /\d+/.exec(r.attr("id")), c = c && c[0]), !c) return void console.error("Post ID not found! Please report this at http://stackapps.com/q/3082/9699");
              n.addSpinner(a), $.ajax({
                type: "GET",
                url: t + c + e + "&callback=?",
                dataType: "json",
                success: function(t) {
                  t = t.items[0];
                  var e = t.up_vote_count,
                      o = t.down_vote_count;
                  e = e ? "+" + e : 0, o = o ? "-" + o : 0, $(".error-notification").fadeOut("fast", function() {
                    $(this).remove()
                  }), a.css("cursor", "default").attr("title", e + " up / " + o + " down").html('<div style="color:green">' + e + '</div><div class="vote-count-separator"></div><div style="color:maroon">' + o + "</div>")
                },
                error: function(t) {
                  n.removeSpinner(), n.showErrorPopup(a.parent(), t.responseText && t.responseText.length < 100 ? t.responseText : "An error occurred during vote count fetch")
                }
              }), s.stopImmediatePropagation()
            }
          };
          $.fn.on ? $(document).on("click", ".vote-count-post", r) : $(document).delegate(".vote-count-post", "click", r)
        } + ")();", e.appendChild(s), s.parentNode.removeChild(s)
      }(document);
    } catch(e) {
      console.log("An error occured loading vote distribution viewer thing:", e);
    }
  }
}

