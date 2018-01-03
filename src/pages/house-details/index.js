require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/plugins/jquery.banner.js');




$(function () {

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

});
