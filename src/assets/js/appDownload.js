//关闭下载app按钮
$('.app-download .close').on('tap', function (e) {
  e.stopPropagation();
  $('.app-download').css('display', 'none');
});
