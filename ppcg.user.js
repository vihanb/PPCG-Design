// ==UserScript==
// @name        PPCG Graduation Script
// @namespace   https://github.com/vihanb/PPCG-Design
// @version     2.1.0
// @description A script to self-graduate PPCG
// @match       *://codegolf.stackexchange.com/*
// @match       *://*.codegolf.stackexchange.com/*
// @match       *://chat.stackexchange.com/*
// @author      PPCG Community
// @grant       none
// @updateURL   https://rawgit.com/vihanb/PPCG-Design/master/ppcg.user.js
// ==/UserScript==
function qS(x) {
  return document.querySelector(x)
}

function unicodes(x) {
  return (x.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\n|./g) || []).map(function(c) {
    return c[1] ? (c.charCodeAt(0) & 1023) * 1024 + (c.charCodeAt(1) & 1023) + 65536 : c.charCodeAt(0)
  })
}

function chars(x) {
  return unicodes(x).length
}

function fchars(x) {
  var y = chars(x);
  return y + " char" + (y == 1 ? "" : "s")
}

function bf(x, y) {
  return x + " " + y + " byte" + (x == 1 ? "" : "s")
}

function bytes(x, y) { // Takes in a length of text and piece of header text, and returns "(# of bytes) (encoding) bytes"
  var ISO_8859_1 = /^(Japt|TeaScript|Retina|Pyth\b)/i;
  var ISO_8859_7 = /^(Jolf)/;
  var UTF_16 = /^(Ziim|Funciton)/i;
  var custom = /^(GS2|Seriously|Unicorn|Jelly|(Dyalog )?APL)/i;
  y = y || "";
  if (PARSE_HEXDUMPS) {
    var a = "";
    x.replace(/[\da-f]{6,8}:? ((?:[\da-f][\da-f] ?){10,})[^\n]*\n?/gi, function(_, z) {
      a += z.replace(/\s/g, '')
    });
    if (a) return bf(a.length / 2, "hex");
    if (/^[\da-f\s-]+$/i.test(x.replace(/\n/g, ''))) return bf(x.replace(/[\s-]/g, '').length / 2, "hex");
  }
  if (/iso.?8859.1/i.test(y) || ISO_8859_1.test(y)) return bf(chars(x), "ISO-8859-1");
  if (/iso.?8859.7/i.test(y) || ISO_8859_7.test(y)) return bf(chars(x), "ISO-8859-7");
  if (/utf.?16/i.test(y) || UTF_16.test(y)) return bf(x.length * 2, "UTF-16");
  if (custom.test(y)) return bf(chars(x), y.match(custom)[0]);
  // Else, fallback to UTF-8
  return bf(unicodes(x).map(function(c) {
    return c >> 16 ? 4 : c >> 11 ? 3 : c >> 7 ? 2 : 1
  }).reduce(function(a, b) {
    return a + b
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
var HEADER_FONT = '"Lato", "Open Sans", "Arial", sans-serif'; // Header text
var TEXT_FONT = '"Open Sans", "Lato", "Helvetica Neue", "Arial", sans-serif'; // Everything else besides code
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
  BACKGROUND_IMAGE: "//i.stack.imgur.com/vAWfF.png ",
  BACKGROUND_SIZE: "650px 150px",
  BG_COL: "#175D2E",
  BG_COL_HOVER: "white",
  BG_START: "white",
  BG_REV: "#329300",

  BACKGROUND_LIGHT: (localStorage.getItem("main.BACKGROUND_LIGHT") === "true"), // Lighter shade of the background, CHANGE THROUGH OPTIONS
  MODE_DARK: (localStorage.getItem("main.MODE_DARK") === "true"),
  NO_LEADERBOARD: (localStorage.getItem("main.NO_LEADERBOARD") === "true"),

  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: "#EDFAEE",
  HEADER_BG_COLOR: "transparent",
  HEADER_BG_IMAGE: "",
  HEADER_TEXT_COLOR: "#FFF",
  CURR_TAB_COLOR: "#62BA15",
  BULLETIN_BG_COLOR: "#fff8dc",
  STATS_COLOR: "#FAFAFA",

  TAG_COLOR: "#D4F493",
  TAG_HOVER: "#329300",

  TAG_SHADOW_COLOR: "#abc577",
  TAG_HOVER_SHADOW_COLOR: "#256c00",

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
  BACKGROUND_SIZE: "650px 150px",
  BG_COL: "#474747",
  BG_COL_HOVER: "#474747",
  BG_START: "rgba(255, 255, 255, 0.8)",
  BG_REV: "white",

  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: "#F4F4F4",
  HEADER_BG_COLOR: "transparent",
  HEADER_TEXT_COLOR: "#FFF",
  CURR_TAB_COLOR: "rgb(72,125,75)",
  BULLETIN_BG_COLOR: "#fff8dc",
  STATS_COLOR: "#FCFCFC", // Content BG
  TAG_COLOR: "",
  TAG_BORDER_COLOR: "",
  BUTTON_COLOR: "#303030",

  // Specify nothing to make these default color
  BOUNTY_COLOR: "rgb(72,125,75)",
  BOUNTY_BG_COLOR: "rgb(172,225,175)",
  BOUNTY_INDICATOR: "#6DAB71"
};

var darktheme = {
  BACKGROUND_COLOR: "black"
};

var optionbox = { // Customizes option box
  BACKGROUND_TINT: "linear-gradient(rgba(69, 174, 103, 0.57), rgba(73, 166, 83, 0.47))",
  BACKGROUND_COLOR: "#FAFAFA"
};

var BGHEIGHT = 0; // this + 130

if (localStorage.getItem('main.MODE_DARK') == "true") main = $.extend(main, darktheme);

/** ~~~~~~~~~~~~~~~~ END CSS PROPERTIES ~~~~~~~~~~~~~~~~ **/
document.head.innerHTML += '<style>.favicon-codegolf{background-position: initial !important; background-image: url("' + main.FAVICON + '"); background-size: 100% 100% !important;}' +
  '.favicon-codegolfmeta{background-position: initial !important; background-image: url("' + meta.FAVICON + '"); background-size: 100% 100% !important;}</style>';
if ((window.location + "").search("//chat.stackexchange.com") >= 0) {
  $("body").css("background", "white");
  $("#sound").css({
    "background": "url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/200px-Speaker_Icon.svg.png)",
    "background-size": "16px 16px"
  });
  $("#roomname").css("font-family", "'Lato Black'");
  $("#searchbox").css("padding-left", "4px !important");

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
    '@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700,700italic&subset=latin,greek);'+
    'body { font-family: "Open Sans" }' +

    '.button { cursor: pointer; background: #96db62; border: none; border-bottom: 1px solid rgb(106, 194, 65) }' +
    '.button:hover { background: #51cc47; border-bottom-color: #449656; }' +

    '.favorite-room-vote { background: url(http://i.stack.imgur.com/DhUx0.png); background-size: 16px 16px }' +
    '.favorite-room-vote.favorite-room { background: url(http://i.stack.imgur.com/lbBdl.png); background-size: 16px 16px }' +

    '.message:hover { border: 1px solid #e3e3e3 !important }' +

    '.message:hover .action-link, .message:hover .action-link .img.menu { background-color: #F3F3F3 !important }' +
    '.message:hover .action-link .img.menu { background-image: url(http://i.stack.imgur.com/3gBKh.png) !important; background-size: 16px 16px; background-position: 0px -1px !important; }' +
    
    '.monologue { margin-bottom: 0; padding-top: 0; }' +
    '.messages { background-color: #fff; padding: 8px 8px 8px 0px; border-radius: 0; border-top: none }' +
    
    '.catchup-marker { border: none !important; margin-top: 10px }' +
    '.catchup-marker .messages { border-top: 1px solid #F2F2F2; }' +
    
    '.popup { border-radius: 2px; border: none; box-shadow: 0 0 8px #9C9C9C }' +
    '.popup .small-site-logo { right: initial; top: 38px }'
    
    'span.mention { padding: 0px 3px; background: rgba(193, 255, 185, 0.73) }' +
    '</style>';
}
if ((window.location + "").search("//(?:meta.)?codegolf.stackexchange.com") >= 0) {
  var site = /^https?:\/\/meta/.test(window.location) ? "meta" : "main";
  var obj = site == "meta" ? meta : main;

  $("#search input").attr("placeholder", obj.SEARCH_TEXT);

  // Options Menu
  $(".topbar-wrapper > .network-items").append('<a id="USER_Opt" class="topbar-icon yes-hover" style="z-index:1;width: 36px; background-image: url(' + main.SPRITE_SHEET + '); background-position: 0px 0px;"></a>');
  $("body").prepend('<div id="USER_OptMenu" style="display: none; width: inherit; height: inherit;"><div id="USER_Backblur" style="position:absolute;z-index:2;width:100%;height:100%;background:rgba(0,0,0,0.5)"></div>' +
                    '<div style="position:absolute;z-index:3;width:40%;height:40%;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);background:' + optionbox.BACKGROUND_COLOR + ';padding:1em;">' +
                    '<h1>Userscript Options</h1><div>' +
                    '<div style="width:50%;height:100%;float:left;">' +
                    '<input class="OPT_Bool" data-var="main.BACKGROUND_LIGHT" type="checkbox" id="light_bg_on"><label for="light_bg_on">Lighter Background?</label><br>' +
                    '<input class="OPT_Bool" data-var="main.MODE_DARK" type="checkbox" id="dark_theme_on"><label for="dark_theme_on">Dark Theme? (WIP)</label><br>' +
                    '<input class="OPT_Bool" data-var="main.NO_LEADERBOARD" type="checkbox" id="noleader"><label for="noleader">Disable Auto Leaderboard?</label>' +
                    '</div><div style="width:50%;height:100%;float:right;">' +
                    '' +
                    '</div></div>For changes to take effect: <button onclick="location.reload()">Refresh</button></div></div>');
  $("#USER_Opt").click(function() {
    $("#USER_OptMenu").fadeIn(50);
  });
  $("#USER_Backblur").click(function() {
    $("#USER_OptMenu").fadeOut(50);
  });
  $(".OPT_Bool").each(function() {
    $(this).prop("checked", eval(localStorage.getItem($(this).data('var'))) || eval($(this).data('var')));
  });
  $(".OPT_Bool").change(function() {
    localStorage.setItem($(this).data('var'), $(this).is(':checked'));
    $(this).prop('checked', eval(localStorage.getItem($(this).data('var'))));
    console.log(localStorage.getItem('main.BACKGROUND_LIGHT'));
  });
}



var otherTags = ["string", "popularity-contest", "ascii-art", "number",
                 "kolmogorov-complexity", "graphical-output", "king-of-the-hill", "fastest-code",
                 "restricted-source", "arithmetic", "sequence", "game",
                 "tips", "geometry", "number-theory", "random", "primes",
                 "array-manipulation", "date", "image-processing", "graphs",
                 "sorting", "interpreter", "optimization", "parsing",
                 "path-finding", "puzzle-solver", "underhanded", "source-layout",
                 "base-conversion"];

function getCookie(name) {
  // http://stackoverflow.com/a/15724300/4683264
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}


function getValidQuestions(tag, onDone) {
  var url = 'https://api.stackexchange.com/2.2/search/advanced?order=desc&key=DwnkTjZvdT0qLs*o8rNDWw((&min=7&todate=1420070400&sort=votes&closed=False&tagged='+tag+'&site=codegolf';
  httpGetAsync(url, function (ret) {
    onDone(JSON.parse(ret)['items']);
  });
}


/* check the cookies for the question, or grab a new one. return format is [url, title] */
function getQuestion(tag, callback) {
  var cookieSuffix = '-tag-question';
  // cookieSep is a space
  var cookieVal = getCookie(tag + cookieSuffix);
  if (cookieVal) {
    var parts = cookieVal.split(/ (.+)?/);
    var url = parts[0];
    delete parts[0];
    var title = parts.join(' ');
    callback([url, title]);
    return 0;
  }

  getValidQuestions(tag, function (ret) {
    var quest = ret[Math.floor(Math.random()*ret.length)];
    var url = quest['link'];
    var title = quest['title'];

    document.cookie = (tag + cookieSuffix)+'='+url+' '+title.replace(/'/g,'&apos;')+';max-age=86400';
    callback([url, title]);
  });
}


function addTag(tag) {
  getQuestion(tag, function (a) {
    qS('#question-of-the-day').innerHTML += 
      '<div class="qod-qitem"><span>'+
      '<a href="/questions/tagged/'+tag+'" class="post-tag user-tag" title="show questions tagged \''+tag+'\'" rel="tag">'+tag+
      '</a></span><a href="'+a[0]+'">'+a[1]+'</a></div>';
  });
}

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

function addOtherTags() {
  var cookieName = 'other-tags-today';
  var tags = getCookie(cookieName);
  if (tags) {tags = tags.split(' ');}
  else {
    tags = [otherTags[Math.floor(Math.random()*otherTags.length)],
            otherTags[Math.floor(Math.random()*otherTags.length)]];
    document.cookie = cookieName + "=" + tags[0] + " " + tags[1] + ";max-age=86400;";;
  }

  tags.forEach(function (a) {
    addTag(a);
  });
}

function addQuestionOfTheDay() {
  var questionOfTheDayHtml = '<div class="module" id="question-of-the-day"><h4 id="h-inferred-tags">Questions of the Day</h4></div>';

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

if (/^https?:\/\/(?:meta.)?codegolf.stackexchange.com/.test(window.location)) {
  if (site == "main") {
    var x = qS(".beta-title").parentElement;
    qS(".beta-title").parentElement.removeChild(qS(".beta-title"));
    x.innerHTML = "<table id=\"newlogo\"><tr><td><img style=\"margin-top: "+BGHEIGHT+"px;\" src=\"" + main.FAVICON + "\" height=60></td><td>Programming Puzzles &amp; Code Golf</td></tr></table>";
    // Leaderboard
    if (!main.NO_LEADERBOARD && $('a.post-tag[href="/questions/tagged/code-golf"]')[0] && $(".answer")[1]) { // Tagged code-golf and has more than 1 answers
      var answers = [];
      loadAnswers(function(json) {
        answers = json.map(function(i, l, a) {
          var copyvalue = i.body.slice().replace(/<(strike|s|del)>.*?<\/\1>/g, "");
          i.body = i.body.replace(/^(?!<p><strong>|<h\d>)(.(?!<p><strong>|<h\d>))*/, "").replace(/<(strike|s|del)>.*<\/\1>/g, "").replace(/<a [^>]+>(.*)<\/a>/g, "$1").replace(/\(\s*(\d+)/g, ", $1").replace(/\s*-\s+|:\s*/, ", ");
          var j = +((i.body.match(/(?:<h\d>|<p><strong>).+?(-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/) || [])[1] || (i.body.match(/^\s*(?:<h\d>|<p><strong>).*?(\d+)\D*?<\/(?:h\d|strong)>/) || [])[1]);
          i.body = i.body.replace(RegExp(",?\\s*" + j + ".*"), "");
          // Taken (and modified) from http://codegolf.stackexchange.com/a/69936/40695
          var e = ((copyvalue.match(/<(h\d|strong)>(.+?)<\/\1>/) || [])[2] || "Unknown Language").replace(/<.*?>/g, "").replace(/^([A-Za-z]+)\s+\d+$/, "$1").replace(/([\–\|\/\-:\—,]\s*\d+\s*(b[l]?y[te]{2}s?|char[a-z]*|codels?)\s*)+/g, "").replace(/(,| [-&(–—5]| [0-7]\d)(?! W|...\)).*/g, "").replace(/2 |:/g, "").replace(/(Ver(sion)?.?\s*)\d{2,}w\d{2,}a/g, "");
          return [j, i, copyvalue, e];
        });
        var lv = 0;
        answers = answers.filter(function(a) {
          return ("" + a[0]) != "NaN";
        }).sort(function(a, b) {
          return a[0] - b[0];
        }).map(function(l, i, a) {
          if ((a[i - 1] || [NaN])[0] !== l[0]) lv = (i || 0) + 1;
          return '<tr><td>' + lv + '</td><td><a href="'+l[1].owner.link+'">'+l[1].owner.display_name+'</a></td><td>' + (l[3] /*(l[2].match(/(?:<h\d>|<p><strong>)(.+?)[, -]\s*(?:(?:\d*\.\d+|\d+)(?:\s*%)?(?:\s*[+*\/\-]\s*(?:\d*\.\d+|\d+)(?:\s*%)?)+\s*=\s*)?(?:-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/)||[])[1]||(l[2].match(/\s*(?:<h\d>|<p><strong>)(\s*<a [^ >]+.+?<\/a>|(?:[#A-Za-z_\s\.\u00FF-\uFFFF!?]|(?:(?=\d+[^\d\n]+\d+\D*(?:<\/|$|\n))\d)|(?:(?=-\s?[A-Za-z_\u00FF-\uFFFF!?]).)|(?:(?=.+(,)),))+)/)||[0,"Lang N/A"])[1]*/ ).trim() + "</td><td>" + l[0] + ' bytes</td><td><a href="' + l[1].link + '">Link</a></td></tr>';
        });
        $(".question .post-text").append('<span><a id="USER_BOARD_TEXT">Show Answer Leadboard ▶</a></span>' +
                                         '<div id="USER_BOARD" style="display:none"><table class="LEADERBOARD"><thead><tr><td>Rank</td><td>Author</td><td>Language</td><td>Score</td><td>Link</td></tr></thead><tbody>' + answers.join("\n") + '</tbody></table> </div>');
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
    qS("#hlogo > a").innerHTML = "<table id=\"newlogo\"><tr><td><img src=\"" + meta.DISP_ICON + "\" height=60></td><td>Programming Puzzles &amp; Code Golf <span class=\"meta-title\" style=\"font-size: 14px; color: #CF7720\">meta</span></td></tr></table>";
  }
  // tio.net (WIP) support
  if (false && window.location.pathname.indexOf("/questions/") === 0) { // question
    $(".answer").each(function() {
      var tiolinks = $(this).find('a[href*="tryitonline.net"]');
      if (tiolinks[0]) {
        // They are tryitonline links
        tiolinks.each(function() {
          var parts = {};
          var _parts = $(this).attr('href').split("#")[1].split("&").map(function(i) {
            return [i.split("=")[0],i.split("=")[1]]
          }).forEach(function(l){
            parts[l[0]] = l[1];
          });

          var code = parts["code"] || "";
          var input = parts["input"] || "";
          var url = $(this).attr('href').match(/https?:\/\/[^\/]+/)[0];
          if (url && code) { // Was able to get data
            var r = new XMLHttpRequest();
            r.open("POST", "http://crossorigin.me/" + url + "/cgi-bin/backend");
            r.onreadystatechange = function() {
              console.log(r, "code=" + code + "&input=" + input);
              if (r.readyState === 4 && r.status === 200) { // all good
                console.log(r.responseText);
              }
            };
            r.send("code=" + code + "&input=" + input);
          }
        });
      }
    });
  }

  // style
  $("#mainbar").css('padding', '15px');
  document.head.innerHTML +=
    ("<style>@import url(" + FONT_URL + ");" +
     ".envelope-on,.envelope-off,.vote-up-off,.vote-up-on,.vote-down-off,.vote-down-on,.star-on,.star-off,.comment-up-off,.comment-up-on,.comment-flag,.edited-yes,.feed-icon,.vote-accepted-off,.vote-accepted-on,.vote-accepted-bounty,.badge-earned-check,.delete-tag,.grippie,.expander-arrow-hide,.expander-arrow-show,.expander-arrow-small-hide,.expander-arrow-small-show,.anonymous-gravatar,.badge1,.badge2,.badge3,.gp-share,.fb-share,.twitter-share,#notify-containerspan.notify-close,.migrated.to,.migrated.from{background-image:url(\"$$SPRITE_SHEET\");background-size: initial;}" +
     ".youarehere{color:$$CURR_TAB_COLOR !important;border-bottom:2px solid $$CURR_TAB_COLOR !important;}" +
     (obj.BOUNTY_COLOR ? ".bounty-indicator-tab{background:$$BOUNTY_BG_COLOR;color:$$BOUNTY_COLOR !important;}" : "") +
     "#sidebar .module.community-bulletin{background:$$BULLETIN_BG_COLOR;}" +
     "div.module.newuser,#promo-box{border-color:#e0dcbf;border-style:solid;border-width:1px;}" +
     ".yes-hover{cursor:pointer !important;}" +
     '.qod-qitem { display: table }' +
     '.qod-qitem > *{ display: table-cell; vertical-align:middle }' +
     '.qod-qitem > *:not(.post-tag) { font-weight: normal; font-size: 12px; white-space: normal; padding-left: 5px; }' +
     '.qod-qitem:not(:first-child) { margin-top: 5px; }'+
     ".LEADERBOARD {border-collapse: collapse} .LEADERBOARD td { padding: 6px 8px } .LEADERBOARD tr:nth-child(even) { background-color: #F1F1F1 } .LEADERBOARD thead { border-bottom: 1px solid #DDD }" +
     "html,body{font-family:" + TEXT_FONT + "}" +
     "#hlogo{margin: 25px 0 0 0;}" +
     "#content{margin-top: 7px;}"+
     ".container{box-shadow: none !important;}"+
     '#content{background:$$STATS_COLOR !important;}'+
     "#hmenus > div.nav:not(.mainnavs) a{text-align:center; color: $$BG_COL;font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;background: $$BG_START;padding: 8px 12px;-webkit-transition: color 0.15s ease, background 0.15s ease;-moz-transition: color 0.15s ease, background 0.15s ease;-ms-transition: color 0.15s ease, background 0.15s ease;-o-transition: color 0.15s ease, background 0.15s ease;}"+
     "#hmenus > div.nav:not(.mainnavs) a:hover{color: $$BG_COL_HOVER;background: $$BG_REV;}" +
     "#sidebar > .module{margin-left: 12px;}" +
     "input[type=submit], input[type=button], button, .button, a.button, a.button:visited, .btn { box-shadow: none; border: 1px solid $$BUTTON_COLOR; background-color: $$BUTTON_COLOR }" +
     ".module.community-bulletin{border: none}" +
     "input[type=submit]:hover, input[type=button]:hover, button:hover, .button:hover, a.button:hover, a.button:visited:hover, .btn:hover { border: 1px solid $$BUTTON_HOVER; background-color: $$BUTTON_HOVER }" +
     ".mod-flair,.started .mod-flair{ color: " + MOD_FLAIR + " !important }.mod-flair:hover,.started .mod-flair:hover{color:" + MOD_FLAIR_HOVER + "}" +
     "#hmenus > div.nav.mainnavs{position: relative; top: 50%; -ms-transform: translateY(-50%);-webkit-transform: translateY(-50%);-moz-transform: translateY(-50%);-o-transform: translateY(-50%); transform: translateY(-50%);}" +
     "div.nav.askquestion li{display:initial;}"+
     "#hmenus{top: 50%;-ms-transform: translateY(-50%);-webkit-transform: translateY(-50%);-moz-transform: translateY(-50%);-o-transform: translateY(-50%);transform: translateY(-50%);}" +
     "#hmenus > div.nav.askquestion li:not(:first-child) > a { margin-top: 5px; }"+
     "#header{background:$$HEADER_BG_COLOR;}#header *, #hlogo a{color:$$HEADER_TEXT_COLOR;}" +
     "a.post-tag{border-radius: 0;text-align:center;font-family:"+MONOSPACE_FONT+";font-size:12px;white-space: nowrap;background-color:$$TAG_COLOR;border:none; -webkit-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -moz-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -ms-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; -o-transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; border-bottom: 2px solid $$TAG_SHADOW_COLOR}" +
     "a.post-tag:hover{border-bottom-color: $$TAG_HOVER_SHADOW_COLOR;background: $$TAG_HOVER; color: white}" +
     "div.module.newuser,div.module.community-bulletin,div.categories{background-color:$$BACKGROUND_COLOR;}" +
     "#newlogo{top:-15px;position:relative;}#newlogo td{padding-right:15px;}#hlogo a{width:600px;}" +
     "#newlogo, #hlogo a{font-family:" + HEADER_FONT + ";}"+
     "</style>").replace(/\$\$(\w+)/g, function(_, x) {
    return eval(site + "." + x);
  });
  try {
    qS("link[rel$=\"icon\"]").href = obj.FAVICON;
  } catch (e) {}
  if (PARSE_CODEBLOCKS) {
    $(".answer").each(function() {
      var h = "";
      // Find the first header or strong element (some old posts use **this** for header) and set h to its text
      $(this).find("h1").each(function() {
        if (!h) h = $(this).text();
      });
      $(this).find("h2").each(function() {
        if (!h) h = $(this).text();
      });
      $(this).find("h3").each(function() {
        if (!h) h = $(this).text();
      });
      $(this).find("strong").each(function() {
        if (!h) h = $(this).text();
      });
      $(this).find("pre code").each(function() {
        var t = $(this).text().trim().replace(/\r\n/g, "\n");
        $(this).parent().before('<div style="padding-bottom:4px;font-size:11px;font-family:' + TEXT_FONT + '">' + bytes(t, h) + ", " + fchars(t) + "</div>");
      });
    });
  }
  $("body .container").prepend('<div style="position: absolute;width: inherit; z-index: 0; height: 130px; background: url(' + obj.BACKGROUND_IMAGE + '); background-size: '+obj.BACKGROUND_SIZE+'; background-attachment: fixed;"></div>');
  if (site == "main") {
    addQuestionOfTheDay();
    $(".bounty-indicator, .bounty-award").css("background-color", main.BOUNTY_INDICATOR);
    document.head.innerHTML += "<style>.question-hyperlink, .answer-hyperlink{color:#5DA261}.question-hyperlink:visited, .answer-hyperlink:visited,.started-link:visited{color:#254127}" +
      "#tabs a:hover, .tabs a:hover, .newnav .tabs-list-container .tabs-list .intellitab a:hover{color:#5DA261;border-bottom:2px solid #5DA261}" +
      "a:hover,.question-hyperlink:hover,.answer-hyperlink:hover,.started-link:hover{color:#487D4B}" +
      "a{color:#5DA261}" +
      "</style>"; //workaround for several links
    $(".started a:not(.started-link)").css('color', '#487D4B');
  }
  window.addEventListener("load", function() {
    setTimeout(function() {
      document.getElementById("footer").style.backgroundColor = obj.BACKGROUND_COLOR
    }, 300);
  });
  if ((window.location + "").indexOf("codegolf.stackexchange.com") > -1) {
    /*=== SHOWS VOTE COUNTS ===*/
    void
    function(t) {
      var e = t.head || t.getElementsByTagName("head")[0] || t.documentElement,
          o = t.createElement("style"),
          n = "/*Added through UserScript*/.vote-count-post{cursor:pointer;}.vote-count-post[title]{cursor:default;}.vote-count-separator{height:0;*margin-left:0;}";
      e.appendChild(o), o.styleSheet ? o.styleSheet.cssText = n : o.appendChild(t.createTextNode(n));
      var s = t.createElement("script");
      s["textContent" in s ? "textContent" : "text"] = "(" + function() {
        var t = location.protocol + "//api.stackexchange.com/2.0/posts/",
            e = "?filter=!)q3b*aB43Xc&key=DwnkTjZvdT0qLs*o8rNDWw((&site=" + location.host,
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
  }
  $("div.nav.askquestion ul").append('<li><a href="http://meta.codegolf.stackexchange.com/questions/2140/sandbox-for-proposed-challenges#show-editor-button" id="nav-asksandbox" title="Propose a question in the sandbox.">Propose Question</a></li>');
}