require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
var order = require('../../common/order-utils');

$(function () {
  $.when(order.orderInfo()).done(function (data) {

    if (data.newOrderState === 'PENDING' && data.effectTimeSecond > 0) {
      // 关闭loading
      $('#loading').remove();

      var str = '<div class="txt"><span>订单号：<span>' + order.orderNo + '</span></span><div class="longTxt"><span>房费：￥<span>' + data.roomRate + '</span></span><i class="iconfont icon-riqi"></i><span>' + data.startTime.replace(/-/g, '.') + '-' + data.endTime.replace(/-/g, '.') + ' 共' + data.bookedDays + '晚</span></div><span>押金：￥<span>' + data.roomDeposit + '</span></span></div> ';
      $('.tol-pri').text(+data.roomRate + +data.roomDeposit);
      // console.log($('tol-pri').text())

      $('.content-body .content').empty().append(str);

      order.startTimer(data.effectTimeSecond);
    } else {
      location.replace('./order-details.html?orderNo=' + order.orderNo);
    }
  });

  // 订单支付页面的post接口
  function orderPaid() {
    location.href = '/mshz-app/security/orderpay/ali/getorderstr/wap?orderNo=' + order.orderNo;
  }


  $('#alipay').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    orderPaid();
  });


  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });

});
