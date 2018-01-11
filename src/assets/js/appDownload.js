//关闭下载app按钮
$('.app-download').on('tap', '.close', function (e) {
  e.stopPropagation();
  e.preventDefault();
  $('.app-download').css('display', 'none');
});
