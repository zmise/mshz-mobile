require('../../common/session');
require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/vendors/iconfont/iconfont.js'); //有色图标
var toast = require('../../assets/js/toast.js');  //toast的事件

var order = require('../../common/order-utils');

function houseInfo(data) {
  return '<div class="order-info">' +
    '<a class="content" href="/houseDetails?id=' + data.situationId + '">' +
    '<img src="' + data.roomMainPic.replace('{size}', '120x100') + '" alt="">' +
    '<div class="i-txt">' +
    '<span class="title">' + data.roomTitle + '</span>' +
    '<div class="txt-line">' +
    '<i class="line-items">' + data.gardenArea + '</i>' +
    '<i class="line-items">' + data.roomLayout + '居' + data.roomArea + '平</i>' +
    '<i class="line-items">' + data.custCount + '人</i>' +
    '</div>' +
    '</div>' +
    '</a>' +
    '<div class="time">' +
    '<i class="icon iconfont icon-shijianxianshi"></i>' +
    '<span class="txt">' + data.startTime + '至' + data.endTime + '</span>' +
    '<span class="txt"> ' + data.bookedDays + '晚</span>' +
    '</div>' +
    '<div class="address">' +
    '<i class="icon iconfont icon-lubiao"></i>' +
    '<span class="txt">地址:</span>' +
    '<span class="txt">' + data.address + '</span>' +
    '</div>' +
    '</div>';
}

function moneyInfo(data) {

  var moneyInfo =
    '<div class="money-info">' +
    '<span class="title">费用信息</span>' +
    '<div class="check-list">';

  var fundsModelList = data.fundsModelList;
  for (var i = 0, len = fundsModelList.length; i < len; i++) {
    if (fundsModelList[i].itemMoney > 0) {
      moneyInfo += '<div class="items">' +
        '<span>' + fundsModelList[i].itemName + '</span>' +
        '<span>¥' + fundsModelList[i].itemMoney + '</span>' +
        '</div>';
    }
  }

  moneyInfo +=
    '</div>' +
    '<div class="total">' +
    '<span>总额</span>' +
    '<span class="price">¥' + data.totalPrice + '</span>' +
    '</div>' +
    '</div>'
    ;

  return moneyInfo;
}

function customerInfo(data) {
  var customerInfoHTML = '<div class="peo-info">' +
    '<span class="title">入住人信息</span>';

  var custModelList = data.custModelList;
  for (var i = 0, len = custModelList.length; i < len; i++) {
    customerInfoHTML += '<div class="pri-info">' +
      '<span>' + custModelList[0].custName + '</span>' +
      '<span>' + custModelList[0].custIdCard + '</span>' +
      '<span>' + custModelList[0].custPhone + '</span>';
    '</div>';
  }
  customerInfoHTML += '</div>';
  return customerInfoHTML;
}


// 取消订单的post接口
function orderCancel(data) {
  $.ajax({
    url: '/mshz-app/security/app/order/cancelOrder',
    data: JSON.stringify({ orderNo: order.orderNo }),
    dataType: 'json',
    contentType: 'application/json;charset=UTF-8',
    type: 'POST',
    cache: false,
    success: function (res) {
      if (res.status === 'C0000') {
        console.log('success');
        toast.show('取消成功');
        //跳转order-list页面
        var path = './order-list.html';
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


// 点击付款按钮跳转到订单支付页面 order-payment
$(document).on('tap', '#orderPaid', function (e) {
  e.stopPropagation();
  e.preventDefault();
  location.href = './order-payment.html?orderNo=' + order.orderNo;
});

// 点击取消订单 跳转到订单列表页面  弹出弹框，点击确定取消，删除该订单dom”释放房源，toast，取消成功，跳转订单列表
$(document).on('tap', '#orderCancel', function (e) {
  e.stopPropagation();
  e.preventDefault();
  $('#overlay').show();
  $('#overlay .box').show();
});

//点击不取消按钮
$('#overlay').on('tap', '#no-cancel', function (e) {
  e.stopPropagation();
  e.preventDefault();
  $('#overlay').hide();
  $('#overlay .box').hide();
});

//点击确认取消按钮
$('#overlay').on('tap', '#cancel', function (e) {
  e.stopPropagation();
  e.preventDefault();

  $('#overlay').hide();
  $('#overlay .box').hide();
  //释放房源
  var cancelParams = {
    orderNo: order.orderNo,
  }
  orderCancel(cancelParams);

});

// 点击评价订单
$(document).on('tap', '#talk-order', function (e) {
  e.stopPropagation();
  e.preventDefault();
  var roomId = $(this).data('roomid');
  location.href = './comment-order.html?orderNo=' + order.orderNo + '&roomId=' + roomId;
});

// 点击返回回到order-list
$('#back').on('tap', function (e) {
  e.stopPropagation();
  e.preventDefault();

  var flag = order.reqSource;
  if (flag === 'ALIPAY') {
    window.location = './order-list.html#VALIDATED';
  } else {
    history.go(-1);
  }


});



$(function () {
  $.when(order.orderInfo()).done(function (data) {

    var houseInfoHTML = houseInfo(data);
    var moneyInfoHTML = moneyInfo(data);
    var customerInfoHTML = customerInfo(data);

    var headerHTML = order.buildHeader(data);
    var refundHTML = order.buildRefundContent(data);


    $('#article-body').html(headerHTML + houseInfoHTML + refundHTML + moneyInfoHTML + customerInfoHTML);
    var buttonsHTML = order.buildButton(data.newOrderState, data);
    $('body').append(buttonsHTML);

    // 关闭loading
    $('#loading').remove();

    if (data.newOrderState === 'PENDING' && data.effectTimeSecond > 0) {
      order.startTimer(data.effectTimeSecond);
    }
  }).fail(function (err) {
    toast.show('请求失败');
    // 关闭loading
    $('#loading').remove();
  });;
});
