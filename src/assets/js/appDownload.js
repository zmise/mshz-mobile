require('./record'); //判断无痕模式
//关闭下载app按钮
$('.app-download').on('tap', '.close', function (e) {
  e.stopPropagation();
  e.preventDefault();
  $('.app-download').css('display', 'none');
  window.localStorage.setItem('closeApp', true);
});
if (window.localStorage.getItem('closeApp')) {
  $('.app-download').css('display', 'none');
}
