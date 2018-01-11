$(function () {
  // /* 阻止滚动条事件  */
  // $('.destination-body').on('touchmove', function (e) {
  //   e.preventDefault();
  // });
  /* 进入日地的的弹出页面 */
  const pinyin = require('tiny-pinyin')

  var arr = [];

  $('#destination-entry').on('tap', function (e) {
    $('.des-body').show();
    /* 阻止首页滚动条事件  */
    $('body,html').css({ 'overflow': 'hidden' });
    for (var i = 0; i < $('.des-body .des-list .title').length; i++) {
      arr[i] = $('.des-body .des-list .title').eq(i).offset().top;
    }
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

    /* 中文转拼音 */
    var cityName = $(this).text();

    if (pinyin.isSupported()) {
      var cityName = pinyin.convertToPinyin(cityName)
    }
    $('#destination-entry').attr('data-cityname', cityName);



    $(this).closest('.des-body').hide();
    $('body,html').css({ 'overflow': 'visible' });

  });
  $('.des-list .txt').on('tap', function (e) {
    e.preventDefault();
    $('#destination-entry').val($(this).text());
    $(this).closest('.des-body').hide();
    $('body,html').css({ 'overflow': 'visible' });
  });

  /* 按字母查询事件 */

  $('.des-body .des-fixed .items').on('tap', function (e) {
    e.preventDefault();
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
    // var c = $('.des-body').scrollHeight - $('.des-body').clientHeight;
    // console.log(b);
    // console.log($('.des-body .des-list .title').eq(0));
    // console.log($('.des-body'));
    if (a > 0) {
      // console.log('zmise');
      $('.des-body').animate({ scrollTop: a }, 1000);
    }
  });
});
