$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}

quotesList = [
  {
    "quote": "Самая большая трата, какую только можно сделать, — это трата времени.",
    "author": "Теофраст"
  },
  {
    "quote": "Одна из самых невосполнимых потерь — потеря времени.",
    "author": "Жорж Бюффон"
  },
  {
    "quote": "Режим времени - первый шаг. Составление плана - второй. Борьба за выполнение плана - третий и решающий на пути действенной рационализации расходования своего и чужого времени.",
    "author": "А.К. Гастев"
  },
  {
    "quote": "Время — это подлинная валюта XXI века.",
    "author": "Брайан Трейси"
  },
  {
    "quote": "Они спрашивают: «Как ты можешь управиться со всеми делами за пятнадцать минут?» Я отвечаю: «Это просто. Надо не терять ни единой секунды».",
    "author": "Ричард Брэнсон"
  },
  {
    "quote": "Ничто так сильно не разрушает человека, как продолжительное бездействие.",
    "author": "Аристотель"
  },
  {
    "quote": "Пока Вы не сможете управлять своим временем, вы не сможете управлять ничем другим.",
    "author": "Питер Друкер"
  },
  {
    "quote": "Ваше время ограничено, поэтому не тратьте его, живя чужой жизнью.",
    "author": "Стив Джобс"
  }
]

unproductiveSelectors = ["#feed_recommends", "#feed_wall", "#feed_summary_wrap", "#feed_bar", "#feed_new_posts", "#feed_empty", "#feedtab_news", "#feedtab_updates", "#feedtab_comments", "#feedtab_owner", "#feedtab_source"];
selectorsForShowing = {};

mainIdName = "vkfk-content";
dialogTextIdName = "vkfk-dialog";
dialogIdName = "vkfk-dialog-text";
quoteIdName = "vkfk-quote";
okButtonIdName = "vkfk-dialog-ok";
noButtonIdName = "vkfk-dialog-no";
buttonsIdName = "vkfk-dialog-buttons";


scrollToRestore = undefined;
viewFeedTime = 60000;

mode = "feed"; // Possible modes: feed, vkfk

timerStartedAt = 0;
quote = quotesList[Math.floor(Math.random() * quotesList.length)];
quoteText = quote["quote"];
quoteAuthor = quote["author"];

vkfkContent = $("<div id='"+ mainIdName +"'/>");
vkfkContent.append("<div id='" + dialogIdName + "' style='display: none;'> <div id='" + dialogTextIdName + "'> Вы только что бездарно потратили минуту своего времени. Хотите еще? </div> <div id='" + buttonsIdName + "'><a id='" + okButtonIdName + "' href='#'>Да</a> <a id='" + noButtonIdName + "' class='flat_button' href='#'>Нет</a></div></div>");
vkfkContent.append("<blockquote id='" + quoteIdName + "' style='display: none;'><div class='text'>" + quoteText + "</div><div class='author'>" + quoteAuthor + "</div></blockquote>");

function awaitTimer() {
  if(!timerStartedAt) {
    timerStartedAt = Date.now();
    setTimeout(function() {
      if(onNewsPage())
        showDialog();
      else
        timerStartedAt = 0;
    }, viewFeedTime)
  }
}

function hideFeed() {
  $.each(unproductiveSelectors, function(i, selector) {
    selectorsForShowing[selector] = !($(selector).css('display') == 'none');
  });
  $(unproductiveSelectors.join(', ')).hide();
}

function showFeed() {
  mode = "feed";
  $.each(selectorsForShowing, function(selector, shouldShown) {
    if(shouldShown)
      $(selector).show();
  });
  $('#' + quoteIdName).hide();
  $('#' + dialogIdName).hide();
}

function showQuote() {
  hideFeed();
  $('#' + dialogIdName).hide();
  $('#' + quoteIdName).show();
}

function onNewsPage() {
  return RegExp(/(\/feed|\/al_feed.php)/).test(document.location.href) && !RegExp(/(feed\?section=notifications|feed\?section=replies)/).test(document.location.href);
}

function showDialog() {
  mode = "vkfk";
  $.each(unproductiveSelectors, function(i, selector) {
    selectorsForShowing[selector] = !($(selector).css('display') == 'none');
  });
  scrollToRestore = $(window).scrollTop();
  vkfkContent.appendTo('.wall_wrap');
  hideFeed();
  $('body').scrollTo(0);
  $('#' + quoteIdName).hide();
  $('#' + dialogIdName).show();
  initOkNoButtons()
}

function initOkNoButtons() {
  $('#' + okButtonIdName).unbind();
  $('#' + okButtonIdName).click(function(e) {
    e.preventDefault();
    showFeed();
    $(window).scrollTop(scrollToRestore);
    timerStartedAt = 0;
  });

  $('#' + noButtonIdName).unbind();
  $('#' + noButtonIdName).click(function(e) {
    e.preventDefault();
    showQuote();
  });
}

function newPostsButtonShown() {
  return $('#feed_new_posts').css('display') != 'none';
}

setInterval(function() {
  if(onNewsPage() && (Date.now() - timerStartedAt + viewFeedTime > 0))
    awaitTimer();
  else
    timerStartedAt = 0
  if(mode == "vkfk" && newPostsButtonShown()) {
    $('#feed_new_posts').hide();
    selectorsForShowing['#feed_new_posts'] = true;
  }
}, 1000);
