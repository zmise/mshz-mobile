require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/calendar.js');//日期插件
require('../../assets/js/toast.js');  //toast的事件


// $.toast('Here you can put the text of the toast');




// window.sessionStorage.JQa="JQA";
// $("#a").text(window.sessionStorage.JQa);
// window.sessionStorage.setItem('JQb','JQB');
// $("#b").text(window.sessionStorage.getItem('JQb'));


$(function () {
  var startDate, endDate, initStartDate, initEndDate, initCaleEndDate;
  // 当前日期
  function initTime() {
    var b = new Date();
    var ye = b.getFullYear();
    var mo = b.getMonth() + 1;
    var da = b.getDate();
    b = new Date(b.getTime() + 24 * 3600 * 1000);
    var ye1 = b.getFullYear();
    var mo1 = b.getMonth() + 1;
    var da1 = b.getDate();
    if (mo < 10) {
      mo = '0' + mo
    }
    if (da < 10) {
      da = '0' + da
    }
    if (mo1 < 10) {
      mo1 = '0' + mo1
    }
    if (da1 < 10) {
      da1 = '0' + da1
    }
    initStartDate = ye + '-' + mo + '-' + da;
    initEndDate = ye1 + '-' + mo1 + '-' + da1;

    b = new Date(b.getTime() + 24 * 3600 * 1000 * 89);
    ye1 = b.getFullYear();
    mo1 = b.getMonth() + 1;
    da1 = b.getDate();
    if (mo1 < 10) {
      mo1 = '0' + mo1
    }
    if (da1 < 10) {
      da1 = '0' + da1
    }
    initCaleEndDate = ye1 + '-' + mo1 + '-' + da1;

  }

  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

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
      success: function (data) {
        // console.log('success');
        console.log(data);
        if (data && data.result && data.result.map && data.result.map !== '') {
          var obj = data.result.map;

          var sourceDate = [];
          Object.keys(obj).forEach(function (key) {
            return sourceDate = sourceDate.concat(obj[key]);
          });

          var startDate = $('#startDate').val() || initStartDate;
          var endDate = $('#endDate').val() || initEndDate;
          // 初始化价格日历
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
              $('#startDate').val(start);
              $('#endDate').val(end);
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

  // 订单预览get接口
  function orderPreviewInfo(params) {

    // console.log(params);

    $.ajax({
      url: '/mshz-app/security/app/order/queryOrderPreview',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        // console.log('success');
        console.log(data);


        if (data && data.result && data.result !== '') {
          var json = data.result;
          console.log(json);
          var str = '<div class="item-oneline"><p>' + json.roomTitle + '</p><p>￥' + json.roomPrice + '</p></div ><div class="item-twoline"><i class="twoline-items" href="javascript:;">' + json.gardenArea + '</i><i class="twoline-items" href="javascript:;">' + json.roomCount + '居' + json.roomArea + '平</i><i class="twoline-items def-pnum" href="javascript:;">' + json.custCount + '人</i></div>';

          $('.yajin').text(json.roomDeposit);
          $('.house-price').text(json.roomRate);
          $('#totalPrice').text('￥' + (json.roomRate + json.roomDeposit));
          $('#addressBody').empty().append(str);
        }


      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }
  // 初始化的弹出的toast框
  function showMessage(content, duration, isCenter, animateIn, animateOut) {
    var animateIn = animateIn;
    var animateOut = animateOut;
    var content = content;
    var duration = duration;
    var isCenter = isCenter;
    $('body').toast({
      position: 'fixed',
      animateIn: animateIn,
      animateOut: animateOut,
      content: content,
      duration: duration,
      isCenter: isCenter,
    });
  }

  // 新增订单post接口

  function addOrder(params) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/security/app/order/addOrder',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (data) {
        console.log('success');
        console.log(data);
        if (data && data.result && data.result.orderNo !== '') {
          var path = '/order-payment.html?orderNo=' + data.result.orderNo;
          console.log(path);
          window.location = path;
        }


      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }



  // 初始化当前日期
  initTime();

  startDate = window.sessionStorage.startDate || initStartDate;
  endDate = window.sessionStorage.endDate || initEndDate;
  $('#startDate').val(startDate);
  $('#endDate').val(endDate);
  // var message ={
  //   E0001: 'skdjfksd',
  //   E0002: 'asldklskd'
  // }


  // url上面的参数
  // todo 
  var roomId = getUrlParam('roomId');
  console.log(roomId);
  if (!roomId) {
    location.replace('error.html?code=E0001')
  } else {
    // 关闭loading
    $('#loading').remove();
  }



  var params = {
    roomId: roomId,
    startDate: startDate,
    endDate: endDate,
  }




  // init价格日历get请求接口
  var caleParams = {
    roomId: params.roomId,
    startDate: initStartDate,
    endDate: initCaleEndDate,
  }

  calePriceInfo(caleParams);

  // 价格日历get请求接口


  var ordPreParams = {
    roomId: params.roomId,
    startTime: params.startDate,
    endTime: params.endDate,
  }
  // 订单预览get接口
  orderPreviewInfo(ordPreParams);

  // 订单预览get接口




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
  $inputLayout.on('keydown', '#name', function (e) {
    $(this).val($(this).val().replace(/[^\u4E00-\u9FA5]/g, ''));
  });
  $inputLayout.on('keydown', '#IDcard', function (e) {

    $(this).val($(this).val().replace(/\D+/g, ''));

  });
  $inputLayout.on('keydown', '#tel', function (e) {
    $(this).val($(this).val().replace(/\D+/g, ''));

  });


  /*   显示日历的控件的点击事件 */
  $('.userInfo-body').on('tap', '.calc-entry', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('.calendar').slideToggle();
    $('body,html').css({ 'overflow': 'hidden' }); //阻止首页滚动条事件
  });
  /*   显示日历的控件的点击事件 */

  $('.userInfo-body').on('tap', '#reduce', function (e) {
    if ($liveNum.find('.peo-num').text() === '2') {
      $liveNum.find('#reduce').hide();
    }
    $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 1);

  });

  /*   显示日历的控件的点击事件 */

  $('.userInfo-body').on('tap', '#add', function (e) {


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
    var IdReg = /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/; //验证身份证正则
    if ($('#name').val() == '') {
      showMessage('姓名填写不正确', 1000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
      return;
    }
    if (!IdReg.test($('#IDcard').val())) {
      showMessage('填写的身份证号码不正确', 1000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
      return;
    }
    if (!telReg.test($('#tel').val())) {
      showMessage('填写的手机号码不正确', 1000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
      return;
    }


    var paramsList = {
      custFormList: [
        {
          custIdCard: $('#IDcard').val(),
          custName: $('#name').val(),
          custPhone: $('#tel').val(),
        }
      ],
      custCount: +$('#peo-num').val() || 1,
      orderChannel: 'MSHZ_APP',
      roomId: params.roomId || '00f1cf6f-2eb9-4b4b-ad3c-95a03795dea4',
      startTime: $('#startDate').val() || '2018-02-16',
      endTime: $('#endDate').val() || '2018-02-17',
    }
    addOrder(paramsList);
  });



  // 点击返回回到上一页
  $('back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    windows.history.go(-1)
  });

});
