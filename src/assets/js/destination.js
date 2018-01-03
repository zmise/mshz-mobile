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

  /* 返回首页  */
  $('#destination-cancel').on('tap', function (e) {
    e.stopPropagation();
    $(this).closest('.des-body').hide();
    /* 恢复首页滚动条事件  */
    $('body,html').css({ 'overflow': 'visible' });
  });

  /* 选定位置返回首页的事件  */
  $('.des-body .des-location .icon-fanhui').on('tap', function (e) {
    e.preventDefault();
    // console.log($(this).prev().text());
    $('#destination-entry').val($(this).prev().text());
    $(this).closest('.des-body').hide();
    $('body,html').css({ 'overflow': 'visible' });
  });
  $('.des-hot-city .items').on('tap', function (e) {
    e.preventDefault();
    $('#destination-entry').val($(this).text());
    $(this).closest('.des-body').hide();
    $('body,html').css({ 'overflow': 'visible' });

  });
  $('.des-list .txt').on('tap', function (e) {
    e.preventDefault();
    $('#destination-entry').val($(this).text());
    $(this).closest('.des-body').hide();
    $('body,html').css({ 'overflow': 'visible' });

  });
});
