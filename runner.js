quoteContent = "<blockquote>Работай уже!</blockquote><br><a href='#' id='ok_button'>Ооокей</a>";

setInterval(function() {
  selectorsForRemove = "#feed_recommends, #feed_wall, #feed_summary_wrap, #feed_bar, #feedtab_news, #feedtab_updates, #feedtab_comments, #feedtab_owner, #feedtab_source";
  $(selectorsForRemove).remove();

  $('.wall_wrap').html(quoteContent);
  $('#ok_button').click(function(e) {
    e.preventDefault();
    alert('Что окей? Закрывай уже вкладку!')
  })
}, 500);
