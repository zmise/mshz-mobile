require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/appDownload.js');//全局下载APP


$(function () {

  //点击进入个人中心
  $('.article-body').on('tap', '#myInegral-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './myIntegral.html';
  });
  //点击进入订单列表
  $('.article-body').on('tap', '#orderList-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './order-list.html';

  });

  //点击进入成为房东页面
  $('.article-body').on('tap', '#landlord-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './tobelandlord.html';
  });
  //点击进入成为房东页面
  $('.article-body').on('tap', '#landlord-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './tobelandlord.html';
  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
