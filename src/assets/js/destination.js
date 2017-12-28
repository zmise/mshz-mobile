$(function () {
  // /* 阻止滚动条事件  */
  // $('.destination-body').on('touchmove', function (e) {
  //   e.preventDefault();
  // });
  /* 进入日地的的弹出页面 */
  $('#destination-entry').on('tap', function (e) {
    $('.des-body').show();
    /* 阻止首页滚动条事件  */
    $('body,html').css({ 'overflow': 'hidden' });
  });

  /* 取消日地的的弹出页面  */
  $('#destination-cancel').on('tap', function (e) {
    e.stopPropagation();
    $(this).closest('.des-body').hide();
    /* 恢复首页滚动条事件  */
    $('body,html').css({ 'overflow': 'visible' });
  });

});
