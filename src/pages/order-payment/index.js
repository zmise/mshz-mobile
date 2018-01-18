require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');


$(function () {
  function startTimer(totalSeconds) {
    // var nowTime = new Date();
    var tMin = 60;
    var $min = $('#minute');
    var $sec = $("#seconds");
    var timeInterval = setInterval(function () {    
      var tResult = totalSeconds - 1;
      var tResultMin = Math.floor(tResult / tMin);
      var tResultSec = Math.floor(tResult % tMin);
      // 将时间小于10的,在值前面加入0; 
      if (tResultMin < 10) {
        tResultMin = "0" + tResultMin;
      }

      if (tResultSec < 10) {
        tResultSec = "0" + tResultSec;
      }
      totalSeconds = totalSeconds - 1;
      //显示到页面上
      $min.text(tResultMin);
      $sec.text(tResultSec);

      //清除定时器并执行释放房源的操作和刷新页面
      if (tResult <= 0) {
        clearInterval(timeInterval);
      }
    }, 1000);

  }
  // $.ajax('/mshz-app/openapi/user/login/password?password=e10adc3949ba59abbe56e057f20f883e&phone=13665432112');

  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

  // url上面的参数
  var params = {
    orderNo: getUrlParam('orderNo'),
  }
  if (!params.orderNo) {
    location.replace('error.html?code=E0001')
  } else {
    // 关闭loading
    $('#loading').remove();
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
        if (data && data.result && data.result !== '') {

          var json = data.result;
          console.log(json);
          var str = '<div class="txt"><span>订单号：<span>' + params.orderNo + '</span></span><div class="longTxt"><span>房费：￥<span>' + json.roomRate + '</span></span><i class="iconfont icon-riqi"></i><span>' + json.startTime.replace(/-/g, '.') + '-' + json.endTime.replace(/-/g, '.') + ' 共' + json.bookedDays + '晚</span ></div > <span>押金：￥<span>' + json.roomDeposit + '</span></span></div > ';
          $('.tol-pri').text(+json.roomRate + +json.roomDeposit);
          // console.log($('tol-pri').text())

          $('.content-body .content').empty().append(str);
          startTimer(15 * 60);

        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }

  // 订单详情get接口

});
