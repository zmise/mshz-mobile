require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/plugins/jquery.banner.js');




$(function () {
  $('.house-base-info .base-server .icon-items:gt(4)').addClass('hide');
  /* 焦点图片  */
  $('.banner-body').banner({
    'width': $(window).width(),
    'height': $(window).width() * 2 / 3,
    'paginationType': 'fraction'
  });

  /* switch header */
  function switchHeader() {
    var _hig = $('.banner-body').height();
    if ($(document).scrollTop() > _hig) {
      $('.header-body').show();
    } else {
      $('.header-body').hide();
    }
  };

  /* switch header   */
  var timeoutObject;
  $(document).on('scroll.header', function () {
    if (timeoutObject) {
      clearTimeout(timeoutObject);
    }
    timeoutObject = setTimeout(switchHeader, 30);
  });


  /* 点击展开全部  */
  $('.house-base-info .base-server').on('tap', '.more', function (e) {
    e.stopPropagation();
    $('.house-base-info .base-server .icon-items:gt(4)').toggleClass('hide');
  });

  /* 点击切换喜欢收藏  */
  $('.banner-body').on('tap', '.collect', function (e) {
    e.stopPropagation();
    $(this).toggleClass('clc-red');
  });
});
