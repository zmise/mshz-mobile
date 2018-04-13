$(function () {
  // /* 阻止滚动条事件  */
  // $('.destination-body').on('touchmove', function (e) {
  //   e.preventDefault();
  // });
  /* 进入日地的的弹出页面 */
  var arr = [];
  $('#handleDestination').on('tap', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.des-body').show();
    /* 阻止首页滚动条事件  */
    for (var i = 0; i < $('.des-body .des-list .title').length; i++) {
      arr[i] = $('.des-body .des-list .title').eq(i).offset().top;
    }
  });

  /* 返回首页  */
  $('#destination-cancel').on('tap', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest('.des-body').hide();
    /* 恢复首页滚动条事件  */
    $('body,html').css({ 'overflow': 'visible' });
  });



  /* 按字母查询事件 */

  $('.des-body .des-fixed .items').on('tap', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var target = $(this).text();
    var arr1 = $('.des-body .des-list .title').text();
    var a = 0;
    console.log(arr);
    console.log($('.des-body'));

    for (var i = 0; i < arr1.length; i++) {
      if (target === arr1[i]) {
        a = arr[i] - 43;
        b = $('.des-body .des-list .title').eq(i).offset().top - $('.des-body').scrollHeight - 43;
        break;
      }
    }
    if (a > 0) {
      $('.des-body').animate({ scrollTop: a }, 1000);
    }
  });
});
