$(function () {
  /* 阻止滚动条事件  */
  $('.destination-body').on('touchmove', function (e) {
    e.preventDefault();
  });

  /* 进入日地的的弹出页面 */
  $('#destination-entry').on('tap', function (e) {
    $('.destination-body').show();
  });

  /* 取消日地的的弹出页面  */
  $('#destination-cancel').on('tap', function (e) {
    e.stopPropagation();
    $(this).closest('.destination-body').hide();
  });

});
