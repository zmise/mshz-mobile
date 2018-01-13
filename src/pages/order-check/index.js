require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/calendar.js');//日期插件
$(function () {

  // $.ajax('/mshz-app/security/app/order/queryOrderList?orderQueryType=VALIDATED');
  /* ajax请求模板 */


  var sourceDate;
  var startDate = $('#startDate').val();
  var endDate = $('#endDate').val();
  // console.log(startDate);
  // console.log(endDate);
  /*   日历控件的生成 */
  $('#firstSelect').calendarSwitch({
    selectors: {
      sections: ".calendar"
    },
    index: 3,      //展示的月份个数
    animateFunction: "slideToggle",        //动画效果
    controlDay: false,//知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
    // daysnumber: "90",     //控制天数
    comeColor: "#44bb80",       //入住颜色
    outColor: "#44bb80",      //离店颜色
    comeoutColor: "#44bb80",        //入住和离店之间的颜色
    callback: function (start, end) {
      // $('#firstSelect').data("startdata", start);
      // $('#firstSelect').data("enddata", end);
      // console.log($('#firstSelect').data())
      $('#startDate').val(start);
      $('#endDate').val(end);
      // loadingMore();
    },   //回调函数
    comfireBtn: '.comfire',//确定按钮的class或者id
    startData: startDate,
    endData: endDate,
    sourceData: sourceDate,
  });

  /*   页面的生成时一些盒子的隐藏判断 */
  var $liveNum = $('.userInfo-body .input-layout .liveNum');
  var $inputLayout = $('.userInfo-body .input-layout');

  if ($liveNum.find('.peo-num').text() - 0 <= 1) {
    $liveNum.find('.reduce').hide();
  }

  /* 一些input框的正则判断  */
  // $inputLayout.find('.name')
  // $inputLayout.find('.IDcard')
  // $inputLayout.find('.tel')
  // $inputLayout.on('keydown', '.name', function (e) {
  //   e.preventDefault();
  //   $(this).val($(this).val().replace(/[^\u4E00-\u9FA5]/g, ''));
  // });
  // $inputLayout.on('keydown', '.IDcard', function (e) {
  //   e.preventDefault();

  //   $(this).val($(this).val().replace(/\D+/g, ''));

  // });
  // $inputLayout.on('keydown', '.tel', function (e) {
  //   e.preventDefault();
  //   $(this).val($(this).val().replace(/\D+/g, ''));

  // });


  /*   显示日历的控件的点击事件 */
  $('.userInfo-body').on('tap', '.calc-entry', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('.calendar').slideToggle();
    $('body,html').css({ 'overflow': 'hidden' }); //阻止首页滚动条事件
  });
  /*   显示日历的控件的点击事件 */

  $('.userInfo-body').on('tap', '.reduce', function (e) {
    if ($liveNum.find('.peo-num').text() === '2') {
      $liveNum.find('.reduce').hide();
    }
    $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 1);

  });

  /*   显示日历的控件的点击事件 */

  $('.userInfo-body').on('tap', '.add', function (e) {
    console.log(123);
    console.log($liveNum);

    console.log($liveNum.find('.peo-num').text());

    if ($liveNum.find('.peo-num').text() === '1') {
      $liveNum.find('.reduce').show();
    }
    if ($liveNum.find('.peo-num').text() - 0 < $('.address-body .def-pnum').text().replace('人', '') - 0) {
      $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 0 + 1);
    }
  });



});
