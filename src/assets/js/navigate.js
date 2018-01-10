$(function () {

  /* 阻止滚动条事件  */
  $('#overlay,.navigate-body').on('touchmove', function (e) {
    e.preventDefault();
  });

  /* 打开侧边导航栏  */
  $('#menu').on('tap', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#overlay').show();
    $('.navigate-body').translate({
      duration: 0.3,
      value: 0
    });
  });

  /* 关闭侧边导航栏  */
  $('#overlay').on('tap.navigate', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.navigate-body').translate({
      duration: 0.3,
      value: '100%',
      callback: function () {
        $('#overlay').hide();
      }
    });
  });

});