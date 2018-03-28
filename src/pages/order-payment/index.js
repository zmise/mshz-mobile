require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
var toast = require('../../assets/js/toast.js');  //toast的事件

var order = require('../../common/order-utils');

$(function () {
  $.when(order.orderInfo()).done(function (data) {

    if (data.newOrderState === 'PENDING' && data.effectTimeSecond > 0) {
      // 关闭loading
      $('#loading').remove();

      var str = '<div class="txt"><span>订单号：<span>' + order.orderNo + '</span></span><div class="longTxt"><span>房费：￥<span>' + data.roomRate + '</span></span><i class="iconfont icon-riqi"></i><span>' + data.startTime.replace(/-/g, '.') + '-' + data.endTime.replace(/-/g, '.') + ' 共' + data.bookedDays + '晚</span></div><span>押金：￥<span>' + data.roomDeposit + '</span></span></div> ';
      $('.tol-pri').text('￥' + (+data.roomRate + +data.roomDeposit));
      // console.log($('tol-pri').text())

      $('.content-body .content').empty().append(str);
      $('#paymentInfo').show();

      order.startTimer(data.effectTimeSecond);
    } else {
      location.replace('./order-details.html?orderNo=' + order.orderNo);
    }
  }).fail(function (res) {
    // 关闭loading
    $('#loading').remove();
    $('#paymentInfo').empty().show();
    setTimeout(function () {
      history.go(-1);
    }, 2e3);
    toast.show('请求失败');
  });

  // ali订单支付页面的post接口
  function orderAliPaid() {

    // 先查询当前订单状态是否可进行支付
    $.ajax({
      url: '/mshz-app/security/orderpay/statusConfirm',
      data: JSON.stringify({ orderNo: order.orderNo }),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {  // 可支付
          location.href = '/mshz-app/security/orderpay/ali/wap?orderNo=' + order.orderNo;
        } else if (res.status === 'R0003') {  // 订单已失效
          location.replace('./order-details.html?orderNo=' + order.orderNo);
        } else { // 订单不存在
          location.replace('./order-list.html');
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  function orderWechatPaid() {

    // 先查询当前订单状态是否可进行支付
    $.ajax({
      url: '/mshz-app/security/orderpay/weixin/unifiedorder/wap',
      data: JSON.stringify({ orderNo: order.orderNo }),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {  // 可支付
          console.log(res)
          location.href = res.result.mweb_url;
        } else if (res.status === 'R0003' && res.status === 'R0002') {  //  R0002("订单不存在")  R0003("订单已失效")
          location.replace('./order-details.html?orderNo=' + order.orderNo);
        } else { // 订单不存在
          location.replace('./order-list.html');
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

  $('#alipay').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    orderAliPaid();
  });


  $('#wechatpay').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    orderWechatPaid();
  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });

});
