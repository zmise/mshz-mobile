require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');

require('../../assets/js/appDownload.js');//全局下载APP



$(function () {

  $('#btn').on('tap', function (e) {
    event.stopPropagation();
    event.preventDefault();
    window.location = 'tel:42032002800';
    $('#overlay').hide();
  });
  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
