require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/calendar.js');//日期插件

// $.toast('Here you can put the text of the toast')
$(function () {
  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

  // url上面的参数
  var params = {
    'roomId': getUrlParam('roomId') || '1ce93b4a-302d-4ed8-85e6-45143d07ffb7',
    'startDate': getUrlParam('startDate') || '2018-01-14',
    'endDate': getUrlParam('endDate') || '2018-01-15',
  }




  // 价格日历get请求接口


  calePriceInfo(params);
  // 价格日历请求

  function calePriceInfo(params) {
    params.endDate = '2018-04-01';
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

          var startDate = $('#startDate').val() || params.startDate;
          var endDate = $('#endDate').val() || params.endDate;
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
        } else {
          var startDate = $('#startDate').val() || params.startDate;
          var endDate = $('#endDate').val() || params.endDate;
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
          });
        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }
  // 价格日历get请求接口


  var ordPreParams = {
    'roomId': params.roomId,
    'startTime': params.startDate,
    'endTime': params.endDate,
  }
  // 订单预览get接口
  orderPreviewInfo(ordPreParams);
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
          $('.tol-pri').text(json.roomRate + json.roomDeposit);
          $('.address-body').empty().append(str);
        }


      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }


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

  $('.userInfo-body').on('tap', '.reduce', function (e) {
    if ($liveNum.find('.peo-num').text() === '2') {
      $liveNum.find('.reduce').hide();
    }
    $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 1);

  });

  /*   显示日历的控件的点击事件 */

  $('.userInfo-body').on('tap', '.add', function (e) {
    // console.log(123);
    // console.log($liveNum);

    // console.log($liveNum.find('.peo-num').text());

    if ($liveNum.find('.peo-num').text() === '1') {
      $liveNum.find('.reduce').show();
    }
    if ($liveNum.find('.peo-num').text() - 0 < $('.address-body .def-pnum').text().replace('人', '') - 0) {
      $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 0 + 1);
    }
  });


  // 提交订单事件

  $('.check-body').on('tap', '#addOrder', function (e) {
    e.stopPropagation();
    e.preventDefault();


    var paramsList = {
      custFormList: [
        {
          custIdCard: $('#IDcard').val() || '411421199002087746',
          custName: $('#name').val() || '测试1',
          custPhone: $('#tel').val() || '18823370299'
        }
      ],
      custCount: +$('#peo-num').val() || 1,
      orderChannel: 'MSHZ_APP',
      remark: 'test by hao',
      roomId: params.roomId || '1ce93b4a-302d-4ed8-85e6-45143d07ffb7',
      startTime: $('#startDate').val() || '2018-02-16',
      endTime: $('#endDate').val() || '2018-02-19'
    }

    // 验证手机格式  
    var telReg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则  
    if (telReg.test($('#tel').val())) {
      addOrder(paramsList);
    } else {
      console.log(13)
    }


  });
  // 新增订单post接口

  function addOrder(params) {
    // console.log(params)
    $.ajax({
      url: '/mshz-app/security/app/order/addOrder',
      data: JSON.stringify(params),  //todo
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',  //todo
      type: 'POST',
      cache: false,
      success: function (data) {
        console.log('success');
        console.log(data);
        if (data && data.orderNo && data.orderNo !== '') {
          var path = "/html/order-payment.html?orderNo=" + data.orderNo;
          window.location = path;
        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }

  // 新增订单post接口


});
