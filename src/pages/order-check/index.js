require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');

require('../../assets/js/plugins.js');
require('../../assets/js/calendar.js');//日期插件
var toast = require('../../assets/js/toast.js');  //toast的事件

var util = require('../../util/');

// $.toast('Here you can put the text of the toast');

$(function () {
  var startDate, endDate, initCaleEndDate, initStartDate;

  // 缓存 preview 接口返回的当前房源的各类信息。
  var orderInfo = {};

  // 当前日期
  function initDate() {
    startDate = window.sessionStorage.startDate;
    endDate = window.sessionStorage.endDate;

    var b = new Date();
    initStartDate = util.formatDate(b, 'yyyy-MM-dd');
    if (!startDate) {
      if (startDateUrl) {
        startDate = startDateUrl;
      } else {
        startDate = initStartDate;
      }
    }


    if (!endDate) {
      b = new Date(b.getTime() + 24 * 3600 * 1000);
      if (endDateUrl) {
        endDate = endDateUrl;
      } else {
        endDate = util.formatDate(b, 'yyyy-MM-dd');
      }
    }

    b = new Date(b.getTime() + 24 * 3600 * 1000 * 89);
    initCaleEndDate = util.formatDate(b, 'yyyy-MM-dd');
  }

  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }
  var startDateUrl = getUrlParam('startDate');
  var endDateUrl = getUrlParam('endDate');
  // init价格日历请求
  function calePriceInfo(params) {
    // params.endDate = '2018-03-31';
    // console.log(params)
    var city = $('#destination-entry').val();
    $.ajax({
      url: '/mshz-app/room/calendarEveryDay',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        // console.log('success');
        // console.log(data);
        if (res.status === 'C0000') {
          var data = res.result.map;

          // 将接口返回的“年-月”进行排序
          var yearMonths = [];
          for (var prop in data) {
            yearMonths.push(prop);
          }
          yearMonths.sort();

          var sourceDate = [];
          for (var i = 0; i < yearMonths.length; i++) {
            sourceDate = sourceDate.concat(data[yearMonths[i]]);
          }
          // 判断默认日期是否已经无房
          if (startDate.substr(0, 7) === sourceDate[0].date.substr(0, 7)) {
            var inDateStatus = data[startDate.substr(0, 7)][+startDate.substr(8) - new Date().getDate()].status || '';

          } else {
            var inDateStatus = data[startDate.substr(0, 7)][+startDate.substr(8) - 1].status || '';
          }
          if (inDateStatus !== 'VALID') {
            startDate = '';
            endDate = '';
          } else {
            var totalDays = (new Date(endDate) - new Date(startDate)) / 24 / 60 / 60 / 1000;
            $('#startDate').val(startDate);
            $('#endDate').val(endDate);
            $('#totalday').text('共' + totalDays + '晚');

            console.log('orderInfo.cancelDays=', orderInfo.cancelDays)
            updateCancelInfo(startDate, endDate);
          }
          // 初始化价格日历
          $('#firstSelect').calendarSwitch({
            selectors: {
              sections: '.calendar'
            },
            index: 3,      // 展示的月份个数
            animateFunction: 'slideToggle', // 动画效果
            controlDay: false,              // 知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
            // daysnumber: '90',            // 控制天数
            comeColor: '#44bb80',           // 入住颜色
            outColor: '#44bb80',            // 离店颜色
            comeoutColor: '#44bb80',        //入住和离店之间的颜色
            callback: function (start, end, totalDays, price) {
              $('#startDate').val(start);
              $('#endDate').val(end);
              if (totalDays) {
                $('#totalday').text('共' + totalDays + '晚');
              }
              if (price) {
                $('#housePrice').text(price.toFixed(1));
                $('#totalPrice').text('￥' + (price + +$('#otherPrice').text()).toFixed(1));
              }

              // 切换入住日期后，更新退款信息
              updateCancelInfo(start, end);
            },   //回调函数
            comfireBtn: '.comfire',//确定按钮的class或者id
            startData: startDate,
            endData: endDate,
            sourceData: sourceDate,
          });
        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }

  function updateCancelInfo(startDate, endDate) {
    var beforeDays = '';
    var s = new Date(startDate);
    var b = new Date(s.getTime() - 24 * 60 * 60 * 1000 * orderInfo.cancelDays);

    $('#cancelBeforeDays i').text(util.formatDate(b, 'yyyy-MM-dd') + ' ');
    $('#cancelStartDay i').text(startDate + ' ');
    $('#cancelEndDay i').text(endDate + ' ');
  }

  // 订单预览get接口
  function orderPreviewInfo(params) {

    // console.log(params);

    return $.ajax({
      url: '/mshz-app/security/app/order/queryOrderPreview',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {

        // 关闭loading
        $('#loading').remove();

        if (res.status === 'C0000') {
          orderInfo = res.result;
          var str = '<div class="item-oneline"><p>' + orderInfo.roomTitle + '</p><p>￥' + orderInfo.roomPrice + '</p></div ><div class="item-twoline"><i class="twoline-items">' + orderInfo.gardenArea + '</i><i class="twoline-items">' + orderInfo.roomCount + '居' + orderInfo.roomArea + '平</i><i class="twoline-items def-pnum">' + orderInfo.custCount + '人</i></div>';
          str =
            '<div>' +
            '<img class="mainpic" src="' + orderInfo.mainPicture.replace('{size}', '400x300') + '" />' +
            '</div>' +
            '<div class="content-info">' +
            '  <div class="item-oneline">' +
            '    <p>' + orderInfo.roomTitle + '</p>' +
            '    <p>￥' + orderInfo.roomPrice + '</p>' +
            '  </div>' +
            '  <div class="item-twoline">' +
            '    <i class="twoline-items" href="javascript:;">' + orderInfo.gardenArea + '</i>' +
            '    <i class="twoline-items" href="javascript:;">' + orderInfo.roomCount + '居' + orderInfo.roomArea + '平</i>' +
            '    <i class="twoline-items def-pnum" href="javascript:;">' + orderInfo.custCount + '人</i>' +
            '  </div>' +
            '</div>';
          $('.yajin').text(orderInfo.roomDeposit);
          $('.house-price').text(orderInfo.roomRate);
          $('#totalPrice').text('￥' + (orderInfo.roomRate + orderInfo.roomDeposit));
          $('#addressBody').empty().append(str);
          $('#cancelBeforeDays').html($('#cancelBeforeDays').html() + orderInfo.inTime);
          $('#cancelStartDay').html($('#cancelStartDay').html() + orderInfo.inTime);
          $('#cancelEndDay').html($('#cancelEndDay').html() + orderInfo.outTime);
          // 仅当后台定义了退订规则后才显示
          if (orderInfo.cancelAble) {
            $('#cancelInfoWrapper').removeClass('hidden');
            $('#cancelDays').text(orderInfo.cancelDays);
            if (orderInfo.cancelRemark.length) {
              $('#cancelRules').removeClass('hidden');
              $('#cancelRemark').html(orderInfo.cancelRemark.replace(/\n/g, '<br>'));
            }
          } else {
            $('#cancelInfoWrapper').removeClass('hidden');
            $('#cancelInfoWrapper .slide-body').hide();
            $('#cancelRules').removeClass('hidden');
            $('#cancelRemark').html('不允许退订');
          }
        } else {
          toast.show(res.message);
        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }

  // 新增订单post接口

  function addOrder(params) {
    console.log(params);
    $.ajax({
      url: '/mshz-app/security/app/order/addOrder',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {

        if (res.status === 'C0000') {
          var path = './order-payment.html?orderNo=' + res.result.orderNo;
          console.log(path);
          window.location = path;
        } else {
          toast.show(res.message);
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }


  // 初始化当前日期
  initDate();

  // url上面的参数

  var roomId = getUrlParam('roomId');
  if (!roomId) {
    location.replace('error.html?code=E0001')
  }

  var params = {
    roomId: roomId,
    startDate: startDate,
    endDate: endDate,
  }

  // 订单预览get接口
  orderPreviewInfo({
    roomId: params.roomId
  }).then(function () {

    // init价格日历get请求接口
    var caleParams = {
      roomId: params.roomId,
      startDate: initStartDate,
      endDate: initCaleEndDate,
    }

    // 价格日历get请求接口
    calePriceInfo(caleParams);

  });

  /*   页面的生成时一些盒子的隐藏判断 */
  var $liveNum = $('.userInfo-body .input-layout .liveNum');
  var $inputLayout = $('.userInfo-body .input-layout');

  if ($liveNum.find('.peo-num').text() - 0 <= 1) {
    $liveNum.find('.reduce').hide();
  }

  $inputLayout.on('input', '#IDcard', function (e) {
    $(this).val($(this).val().replace(/[^\dxX]/g, ''));
  });

  // //输入电话号码以 4 3 3 的格式
  // $inputLayout.on('input', '#tel', function (e) {
  //   var len = this.value.length;
  //   if (len === 3 || len === 8) {
  //     this.value += ' ';
  //   }
  // }).on('keydown', '#tel', function (e) {
  //   var key = e.keyCode;
  //   if ((key > 47 && key < 58) || (key > 95 && key < 106) || key === 8) {
  //     var val = this.value.replace(/^\s*/, '');
  //     var len = val.length;
  //     if (key == 8 && (len == 4 || len == 9)) {
  //       val = val.trim();
  //     }
  //     this.value = val;
  //   } else {
  //     return false;
  //   }
  // });
  //阻止首页滚动条事件
  function stopScroll() {
    $('body').css({
      position: 'fixed',
      top: -document.body.scrollTop + 'px'
    });
  }
  // /*   显示日历的控件的点击事件 */
  // $('.userInfo-body').on('tap', '.calc-entry', function (e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   $('.calendar').slideToggle();
  //   // $('body,html').css({ 'overflow': 'hidden' }); //阻止首页滚动条事件
  //   stopScroll();
  // });

  /*   显示日历的控件的点击事件 */
  $('.userInfo-body').on('tap', '#reduce', function (e) {
    e.stopPropagation();
    e.preventDefault();
    if ($liveNum.find('.peo-num').text() === '2') {
      $liveNum.find('#reduce').hide();
    }
    $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 1);

  });

  /*   显示日历的控件的点击事件 */

  $('.userInfo-body').on('tap', '#add', function (e) {
    e.stopPropagation();
    e.preventDefault();

    if ($liveNum.find('.peo-num').text() === '1') {
      $liveNum.find('#reduce').show();
    }
    if ($liveNum.find('.peo-num').text() - 0 < $('.address-body .def-pnum').text().replace('人', '') - 0) {
      $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 0 + 1);
    }
  });

  // 提交订单事件

  $('.check-body').on('tap', '#addOrder', function (e) {
    e.stopPropagation();
    e.preventDefault();
    // 验证手机格式  todo
    var telReg = /^1[3|4|5|7|8][0-9]{9}$/; //验证手机正则
    var idReg = /^(\d{18}$|^\d{17}(\d|X|x))$/; //验证身份证正则
    var nameReg = /^[\u4e00-\u9fa5]{2,18}|(^[a-zA-Z]+[\s]?([a-zA-Z]+[\s]?){0,4}[a-zA-Z]$)/;
    var nameVal = $.trim($('#name').val());
    var telVal = $.trim($('#tel').val()).replace(/\s/g, '');
    var idVal = $.trim($('#IDcard').val());
    if (nameVal.length < 2 || nameVal.length > 18) {
      toast.show('请填写正确姓名');
      return;
    }
    if (!nameReg.test(nameVal)) {
      toast.show('姓名仅限为2-18位中文或英文字母');
      return;
    }
    if (!idReg.test(idVal)) {
      toast.show('请填写正确身份证号');
      return;
    }
    if (!telReg.test(telVal)) {
      toast.show('请填写正确手机号码');
      return;
    }

    var paramsList = {
      custFormList: [{
        custIdCard: idVal,
        custName: nameVal,
        custPhone: telVal,
      }
      ],
      custCount: +$('#peo-num').val() || 1,
      orderChannel: 'MSHZ_WAP',
      roomId: params.roomId,
      startTime: $('#startDate').val(),
      endTime: $('#endDate').val(),
    }
    addOrder(paramsList);
  });



  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });

});
