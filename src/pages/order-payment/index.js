require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');


$(function () {
  //结束时间
  // var t_endtime = new Date("2016-05-22 00:00:00");
  // 时间换算规则
  // var t_day = 60 * 60 * 24;
  // var t_hour = 60 * 60;
  var t_min = 60;
  // var ele_day = document.getElementById("day");
  // var ele_hour = document.getElementById("hour");
  var $min = $('#minute');
  var $sec = $("#seconds");
  $min.text('15');
  $sec.text('00');
  var interval = setInterval(function () {
    //剩余时间
    var t_result = ($min.text() - 0) * 60 + ($sec.text() - 0) - 1;
    // //剩余时间换算
    // var t_time = Math.floor(t_result / 1000);
    // var t_result_day = Math.floor(t_time / t_day);
    // var t_result_hour = Math.floor(t_time % t_day / t_hour);
    var t_result_min = Math.floor(t_result / t_min);
    var t_result_sec = Math.floor(t_result % t_min);
    // 将时间小于10的,在值前面加入0; 
    if (t_result_min < 10) {
      t_result_min = "0" + t_result_min;
    }

    if (t_result_sec < 10) {
      t_result_sec = "0" + t_result_sec;
    }

    //显示到页面上
    $min.text(t_result_min);
    $sec.text(t_result_sec);

    //清除定时器并执行释放房源的操作和刷新页面
    if (t_result <= 0) {
      clearInterval(interval);
    }
  }, 1000);

  // $.ajax('/mshz-app/openapi/user/login/password?password=e10adc3949ba59abbe56e057f20f883e&phone=13665432112');

  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

  // url上面的参数
  var params = {
    'orderNo': getUrlParam('orderNo') || 'SZ010915491070',
  }



  // 订单详情get接口
  orderPreviewInfo(params);

  function orderPreviewInfo(params) {

    console.log(params);
    $.ajax({
      url: '/mshz-app/security/app/order/queryOrderDetail',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        console.log('success');
        console.log(data);

        var json = data.result;
        console.log(json);
        var str = '<div class="txt"><span>订单号：<span>' + params.orderNo + '</span></span><div class="longTxt"><span>房费：￥<span>' + json.roomRate + '</span></span><i class="iconfont icon-riqi"></i><span>' + json.startTime.replace(/-/g, '.') + '-' + json.endTime.replace(/-/g, '.') + ' 共' + json.bookedDays + '晚</span ></div > <span>押金：￥<span>' + json.roomDeposit + '</span></span></div > ';
        $('.tol-pri').text(+json.roomRate + +json.roomDeposit);
        // console.log($('tol-pri').text())

        $('.content-body .content').empty().append(str);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }

  // 订单详情get接口

});
