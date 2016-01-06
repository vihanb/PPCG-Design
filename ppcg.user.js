// ==UserScript==
// @name         PPCG Design
// @namespace    Doᴡɴɢᴏᴀᴛ
// @version      1
// @author       Doᴡɴɢᴏᴀᴛ
// @grant        none
// ==/UserScript==

function qS(x){
  return document.querySelector(x);
}
window.addEventListener("load",function(){
  // THEME OPTIONS
  var CR_THEME        = false; // Code Review inspired theme
  
  // CONSTANTS
  var FAVICON = "//i.stack.imgur.com/jOhpI.png"; // Favicon
  var BACKGROUND = "//i.stack.imgur.com/t8GhU.png"; // Background Texture
  var SPRITES = "https://cdn.rawgit.com/vihanb/PPCG-Design/master/sprites.svg"; // Sprites
  
  if((window.location+"").search("//codegolf.stackexchange.com")>=0){
    qS("link[rel$=\"icon\"]").href = FAVICON;
    var x = qS(".beta-title").parentElement;
    qS(".beta-title").parentElement.removeChild(qS(".beta-title"));
    $(".topbar-wrapper > .network-items").append('<a id="USER_Opt" class="topbar-icon yes-hover" style="width: 36px; background-image: url('+SPRITES+'); background-position: 0px 0px;"></a>');
    $("#content").css('background', 'none');
    $(".post-tag").css('background', 'rgb(177, 235, 124)');
    $(".post-tag").css('color', '#14761a');
    $(".post-tag").css('border', 'none');
    $("#mainbar, .user-page #content").css('background', '#FAFAFA');
    $("#mainbar").css('padding', '15px');
    $(".envelope-on, .envelope-off, .vote-up-off, .vote-up-on, .vote-down-off, .vote-down-on, .star-on, .star-off, .comment-up-off, .comment-up-on, .comment-flag, .edited-yes, .feed-icon, .vote-accepted-off, .vote-accepted-on, .vote-accepted-bounty, .badge-earned-check, .delete-tag, .grippie, .expander-arrow-hide, .expander-arrow-show, .expander-arrow-small-hide, .expander-arrow-small-show, .anonymous-gravatar, .badge1, .badge2, .badge3, .gp-share, .fb-share, .twitter-share, #notify-container span.notify-close, .migrated.to, .migrated.from")
        .css("background-image", "url("+SPRITES+")");
    $(".answer pre code").each(function() {
        var t=$(this).text().trim().replace(/\r\n/g, "\n");
        $(this).parent().before('<div style="font:11px \'Open Sans\'">'+(2*t.length-t.replace(/[\u0100-\uFFFF]/g,'').length)+" bytes</div>");
    });
    x.innerHTML = "<table id=\"newlogo\"><tr><td><img src=\""+FAVICON+"\" height=50></td><td>Programming Puzzles &amp; Code Golf</td></tr></table>";
    document.head.innerHTML += "<style>@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700,700italic,400italic);@import url(https://fonts.googleapis.com/css?family=Exo+2:700);"+
    ".module:not(.community-bulletin,#questions-count){background-color:rgb(250, 250, 250) !important;padding:10px !important;}"+
    ".youarehere{color:rgb(72,125,75) !important;border-bottom:2px solid rgb(72,125,75) !important;}"+
    "[class*=favicon-codegolf]{background:url("+FAVICON+");background-position:inital;background-size:100% 100%;}"+
    ".bounty-indicator-tab{background:rgb(193, 225, 183);color:rgb(72,125,75) !important;}"+
    "html,body{font-family:\"Open Sans\"}#header *{color:#4C4C4C;}"+
    "#content{background:#FAFAFA}"+
    "#newlogo{font-family:\"Exo 2\";top:-15px;position:relative;}"+
    "#newlogo td{padding-right:15px;}"+
    "#hlogo a{width:600px;}</style>";
    qS(".container").style.boxShadow = "none";
    $("body .container").prepend('<div style="position: absolute;width: inherit; height: 120px; background: linear-gradient(rgba(153, 255, 165, 0.26), rgba(140, 255, 149, 0.26)), url(http://i.stack.imgur.com/i6Idq.png)"></div>');
    if (CR_THEME) {
      $("body .container > div").css("background", "none");
      $("body > .container").css("box-shadow", "none");
      $("body").css("background", "linear-gradient(rgba(153, 255, 165, 0.26), rgba(140, 255, 149, 0.26)), url("+BACKGROUND+")");
    }
  }
  if((window.location+"").search("meta.codegolf.stackexchange.com")>=0){
    document.querySelector("link[rel$=\"icon\"]").href = FAVICON;
    $(".envelope-on, .envelope-off, .vote-up-off, .vote-up-on, .vote-down-off, .vote-down-on, .star-on, .star-off, .comment-up-off, .comment-up-on, .comment-flag, .edited-yes, .feed-icon, .vote-accepted-off, .vote-accepted-on, .vote-accepted-bounty, .badge-earned-check, .delete-tag, .grippie, .expander-arrow-hide, .expander-arrow-show, .expander-arrow-small-hide, .expander-arrow-small-show, .anonymous-gravatar, .badge1, .badge2, .badge3, .gp-share, .fb-share, .twitter-share, #notify-container span.notify-close, .migrated.to, .migrated.from")
        .css("background-image", "url("+SPRITES+")");
  }
  if((window.location+"").search("chat.stackexchange.com")>=0){
    $('img[title="Programming Puzzles & Code Golf"]').attr("src", FAVICON);
  }
});

/*=== SHOWS VOTE COUNTS ===*/
void function(t){var e=t.head||t.getElementsByTagName("head")[0]||t.documentElement,o=t.createElement("style"),n="/*Added through UserScript*/.vote-count-post{cursor:pointer;}.vote-count-post[title]{cursor:default;}.vote-count-separator{height:0;*margin-left:0;}";e.appendChild(o),o.styleSheet?o.styleSheet.cssText=n:o.appendChild(t.createTextNode(n));var s=t.createElement("script");s["textContent"in s?"textContent":"text"]="("+function(){var t=location.protocol+"//api.stackexchange.com/2.0/posts/",e="?filter=!)q3b*aB43Xc&key=DwnkTjZvdT0qLs*o8rNDWw((&site="+location.host,o=1,n=StackExchange.helpers,s=$.fn.click;$.fn.click=function(){return this.hasClass("vote-count-post")&&!o?this:s.apply(this,arguments)};var r=function(s){var r,a=$(this),i=this.title;if(!(/up \/ /.test(i)||/View/.test(i)&&o)){o=0;var c=a.siblings('input[type="hidden"]').val();if(c||(r=a.closest("[data-questionid],[data-answerid]"),c=r.attr("data-answerid")||r.attr("data-questionid")),c||(r=a.closest(".suggested-edit"),c=$.trim(r.find(".post-id").text())),c||(r=a.closest(".question-summary"),c=/\d+/.exec(r.attr("id")),c=c&&c[0]),!c)return void console.error("Post ID not found! Please report this at http://stackapps.com/q/3082/9699");n.addSpinner(a),$.ajax({type:"GET",url:t+c+e+"&callback=?",dataType:"json",success:function(t){t=t.items[0];var e=t.up_vote_count,o=t.down_vote_count;e=e?"+"+e:0,o=o?"-"+o:0,$(".error-notification").fadeOut("fast",function(){$(this).remove()}),a.css("cursor","default").attr("title",e+" up / "+o+" down").html('<div style="color:green">'+e+'</div><div class="vote-count-separator"></div><div style="color:maroon">'+o+"</div>")},error:function(t){n.removeSpinner(),n.showErrorPopup(a.parent(),t.responseText&&t.responseText.length<100?t.responseText:"An error occurred during vote count fetch")}}),s.stopImmediatePropagation()}};$.fn.on?$(document).on("click",".vote-count-post",r):$(document).delegate(".vote-count-post","click",r)}+")();",e.appendChild(s),s.parentNode.removeChild(s)}(document);
