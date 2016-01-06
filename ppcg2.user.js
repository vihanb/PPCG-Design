// ==UserScript==
// @name        CustomizablePPCGUserscript
// @namespace   ETHproductions
// @version     1
// @author      ETHproductions
// @grant       none
// ==/UserScript==

function qS(x){return document.querySelector(x)}
function chars(x){return x.replace(/[\uD800-\uDBFF]/g,'').length}
function fchars(x){var y=chars(x);return y+" char"+(y==1?"":"s")}
function bf(x,y){return x+" "+y+" byte"+(x==1?"":"s")}
function bytes(x,y){ // Takes in a length of text and piece of header text, and returns "(# of bytes) (encoding) bytes"
  var ISO_8859_1 = /Japt|TeaScript/i;
  var UTF_16 = /Ziim/i;
  var custom = /GS2|Seriously|Jelly|APL/i;
  y=y||"";
  if(PARSE_HEXDUMPS){
    var a="";
    x.replace(/[\da-f]{6,8}:? ((?:[\da-f] ?){20,})[^\n]*\n?/gi,function(_,z){a+=z.replace(/\s/g,'')});
    if(a)return bf(a.length/2,"hex");
    if(/^[\da-f\s-]+$/i.test(x.replace(/\n/g,'')))return bf(x.replace(/[\s-]/g,'').length/2,"hex");
  }
  if(/iso.?8859.1/i.test(y)||ISO_8859_1.test(y))return bf(chars(x),"ISO-8859-1");
  if(/utf.?16/i.test(y)||UTF_16.test(y))return bf(x.replace(/[\u0000-\uFFFF]/g,"$& ").length,"UTF-16");
  if(custom.test(y))return bf(chars(x),y.match(custom)[0]);
  // Else, fallback to UTF-8
  return bf(3*x.length-x.replace(/[\u0080-\uFFFF]/g,'').length-x.replace(/[\u0800-\uFFFF]/g,'').length,"UTF-8");
}

var PARSE_CODEBLOCKS = true; // set to false to not parse code block lengths
var PARSE_HEXDUMPS = true; // set to false to not parse hexdump lengths

// Fonts
var HEADER_FONT = "Exo 2";  // Header text
var TEXT_FONT = "Open Sans"; // Everything else besides code
var FONT_URL = "//fonts.googleapis.com/css?family=Exo+2|Open+Sans"; // import any webfonts here
  
/** ~~~~~~~~~~~~~~~~ MAIN SITE CUSTOMIZABLE PROPERTIES ~~~~~~~~~~~~~~~~ **/
  
var main = {
  FAVICON: "//i.imgur.com/FMih93I.pngg",
  SPRITE_SHEET: "//rawgit.com/vihanb/PPCG-Design/master/sprites.svg",
  
  // Set to empty string for no background image
  BACKGROUND_IMAGE: "http://i.stack.imgur.com/t8GhU.png",
    
  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: "#EDFAEE",
  HEADER_BG_COLOR: "transparent",
  HEADER_BG_IMAGE: "",
  HEADER_TEXT_COLOR: "#4C4C4C",
  CONTAINER_BG_COLOR: "rgb(250, 250, 250)",
  CURR_TAB_COLOR: "rgb(72,125,75)",
  BULLETIN_BG_COLOR: "#fff8dc",
  STATS_COLOR: "rgba(250,244,180,0.45)",
  
  // Specify nothing to make these default color
  BOUNTY_COLOR: "rgb(72,125,75)",
  BOUNTY_BG_COLOR: "rgb(172,225,175)",
};
  
/** ~~~~~~~~~~~~~~~~ META SITE CUSTOMIZABLE PROPERTIES ~~~~~~~~~~~~~~~~ **/
  
var meta = {
  FAVICON: "//i.imgur.com/xJx4Jdd.png",
  SPRITE_SHEET: "//rawgit.com/vihanb/PPCG-Design/master/sprites.svg",
  
  // Set to empty string for no background image
  BACKGROUND_IMAGE: "http://i.stack.imgur.com/HLJI4.png",
    
  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: "#F4F4F4",
  HEADER_BG_COLOR: "transparent",
  HEADER_TEXT_COLOR: "#4C4C4C",
  CONTAINER_BG_COLOR: "#FAFAFA",
  CURR_TAB_COLOR: "rgb(72,125,75)",
  BULLETIN_BG_COLOR: "#fff8dc",
  
  // Specify nothing to make these default color
  BOUNTY_COLOR: "rgb(72,125,75)",
  BOUNTY_BG_COLOR: "rgb(172,225,175)",
}

/** ~~~~~~~~~~~~~~~~ END CSS PROPERTIES ~~~~~~~~~~~~~~~~ **/
document.head.innerHTML += '<style>.favicon-codegolf{background-position: initial !important; background-image: url("'+main.FAVICON+'"); background-size: 100% 100% !important;}'+
                              '.favicon-codegolfmeta{background-position: initial !important; background-image: url("'+meta.FAVICON+'"); background-size: 100% 100% !important;}</style>';

if((window.location+"").search("//(?:meta.)?codegolf.stackexchange.com")>=0){
  var site = /^https?:\/\/meta/.test(window.location)?"meta":"main";
  var obj = site == "meta" ? meta : main;
  if(site == "main") {
    var x = qS(".beta-title").parentElement;
    qS(".beta-title").parentElement.removeChild(qS(".beta-title"));
    x.innerHTML = "<table id=\"newlogo\"><tr><td><img src=\""+main.FAVICON+"\" height=50></td><td>Programming Puzzles &amp; Code Golf</td></tr></table>";
    document.head.innerHTML += "<style>#sidebar #beta-stats,#sidebar #promo-box{background:"+main.STATS_COLOR+";}</style>";
  }
  document.head.innerHTML += ("<style>@import url("+FONT_URL+");"+
    ".envelope-on,.envelope-off,.vote-up-off,.vote-up-on,.vote-down-off,.vote-down-on,.star-on,.star-off,.comment-up-off,.comment-up-on,.comment-flag,.edited-yes,.feed-icon,.vote-accepted-off,.vote-accepted-on,.vote-accepted-bounty,.badge-earned-check,.delete-tag,.grippie,.expander-arrow-hide,.expander-arrow-show,.expander-arrow-small-hide,.expander-arrow-small-show,.anonymous-gravatar,.badge1,.badge2,.badge3,.gp-share,.fb-share,.twitter-share,#notify-containerspan.notify-close,.migrated.to,.migrated.from{background-image:url(\"$$SPRITE_SHEET\");background-size: initial;}"+
    ".youarehere{color:$$CURR_TAB_COLOR !important;border-bottom:2px solid $$CURR_TAB_COLOR !important;}"+
    (obj.BOUNTY_COLOR?".bounty-indicator-tab{background:$$BOUNTY_BG_COLOR;color:$$BOUNTY_COLOR !important;}":"")+
    "#sidebar .module.community-bulletin{background:$$BULLETIN_BG_COLOR;}"+
    "div.module.newuser,#promo-box{border-color:#e0dcbf;border-style:solid;border-width:1px;}"+
    "html,body{font-family:\""+TEXT_FONT+"\"}"+
    "#header{background:$$HEADER_BG_COLOR;}#header *{color:$$HEADER_TEXT_COLOR;}"+
    "#content,.container{background:$$CONTAINER_BG_COLOR}"+
    "a.post-tag,div.module.newuser,div.module.community-bulletin,div.categories,div.user-info.user-hover{background-color:$$BACKGROUND_COLOR;}"+
    "#newlogo{font-family:\""+HEADER_FONT+"\";top:-15px;position:relative;}#newlogo td{padding-right:15px;}#hlogo a{width:600px;}"+
    ".container{"+(obj.BACKGROUND_IMAGE?"background-image:url(\"$$BACKGROUND_IMAGE\");background-repeat:repeat-x;":"")+"background-color:$$BACKGROUND_COLOR;box-shadow:none !important;}</style>").replace(/\$\$(\w+)/g,function(_,x){return eval(site+"."+x)});
  try{qS("link[rel$=\"icon\"]").href = obj.FAVICON;}catch(e){}
  if(PARSE_CODEBLOCKS){
  $(".answer").each(function() {
    var h="";
    // Find the first header or strong element (some old posts use **this** for header) and set h to its text
    $(this).find("h1").each(function(){if(!h)h=$(this).text();});
    $(this).find("h2").each(function(){if(!h)h=$(this).text();});
    $(this).find("h3").each(function(){if(!h)h=$(this).text();});
    $(this).find("strong").each(function(){if(!h)h=$(this).text();});
    $(this).find("pre code").each(function() {
      var t=$(this).text().trim().replace(/\r\n/g, "\n");
      $(this).parent().before('<div style="padding-bottom:4px;font:11px \''+TEXT_FONT+'\'">'+bytes(t,h)+", "+fchars(t)+"</div>");
    });
  });
  }
  window.addEventListener("load",function(){
  setTimeout(function(){document.getElementById("footer").style.backgroundColor=obj.BACKGROUND_COLOR},300);
  });
}
if ((window.location+"").indexOf("codegolf.stackexchange.com") > -1) {
  /*=== SHOWS VOTE COUNTS ===*/
  void function(t){var e=t.head||t.getElementsByTagName("head")[0]||t.documentElement,o=t.createElement("style"),n="/*Added through UserScript*/.vote-count-post{cursor:pointer;}.vote-count-post[title]{cursor:default;}.vote-count-separator{height:0;*margin-left:0;}";e.appendChild(o),o.styleSheet?o.styleSheet.cssText=n:o.appendChild(t.createTextNode(n));var s=t.createElement("script");s["textContent"in s?"textContent":"text"]="("+function(){var t=location.protocol+"//api.stackexchange.com/2.0/posts/",e="?filter=!)q3b*aB43Xc&key=DwnkTjZvdT0qLs*o8rNDWw((&site="+location.host,o=1,n=StackExchange.helpers,s=$.fn.click;$.fn.click=function(){return this.hasClass("vote-count-post")&&!o?this:s.apply(this,arguments)};var r=function(s){var r,a=$(this),i=this.title;if(!(/up \/ /.test(i)||/View/.test(i)&&o)){o=0;var c=a.siblings('input[type="hidden"]').val();if(c||(r=a.closest("[data-questionid],[data-answerid]"),c=r.attr("data-answerid")||r.attr("data-questionid")),c||(r=a.closest(".suggested-edit"),c=$.trim(r.find(".post-id").text())),c||(r=a.closest(".question-summary"),c=/\d+/.exec(r.attr("id")),c=c&&c[0]),!c)return void console.error("Post ID not found! Please report this at http://stackapps.com/q/3082/9699");n.addSpinner(a),$.ajax({type:"GET",url:t+c+e+"&callback=?",dataType:"json",success:function(t){t=t.items[0];var e=t.up_vote_count,o=t.down_vote_count;e=e?"+"+e:0,o=o?"-"+o:0,$(".error-notification").fadeOut("fast",function(){$(this).remove()}),a.css("cursor","default").attr("title",e+" up / "+o+" down").html('<div style="color:green">'+e+'</div><div class="vote-count-separator"></div><div style="color:maroon">'+o+"</div>")},error:function(t){n.removeSpinner(),n.showErrorPopup(a.parent(),t.responseText&&t.responseText.length<100?t.responseText:"An error occurred during vote count fetch")}}),s.stopImmediatePropagation()}};$.fn.on?$(document).on("click",".vote-count-post",r):$(document).delegate(".vote-count-post","click",r)}+")();",e.appendChild(s),s.parentNode.removeChild(s)}(document);
}
