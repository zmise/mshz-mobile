require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏

require('../../assets/vendors/iconfont/iconfont.js'); //有色图标
require('../../assets/js/toast.js');  //toast的事件


// CHECKED: 已入住
// CANCELL_REFUND, 已取消，有退款
// CANCELL_NO_REFUND, 已取消，无退款
// CHECKED_OUT, 已退房
// EARLY_CHECKED_OUT, 提前退房
// INVALIDATED 无效
// return '';
var map = {
  // PENDING: { icon: 'dairuzhu', text: '待入住', className: 'current2' },
  PAYMENT: { icon: 'dairuzhu', text: '待入住', className: 'current2' },
  CANCELL_REFUND: { icon: 'yiquxiao', text: '已取消', className: 'current1' },
  CHECKED_OUT: { icon: 'yituifangwutuikuan', text: '已退房', className: 'current2' },
  EARLY_CHECKED_OUT: { icon: 'yituifangyoutuikuan', text: '提前退房', className: 'current2' },
  INVALIDATED: { icon: 'zhifuchaoshi', text: '支付超时', className: 'current2' },
  CANCELL_NO_REFUND: { icon: 'yiquxiao', text: '已取消', className: 'current1' },

};

function buildHeader(state, data) {
  var header = '';
  if (state === 'PENDING') {
    header =
      '<div class="time-paid">' +
      '<span class="txt">已为您保留房源，请于' +
      '<span class="minute" id="minute"></span> 分' +
      '<span class="seconds" id="seconds"></span>' +
      '秒内支付订单' +
      '</span>' +
      '<i class="icon iconfont icon-daojishi"></i>' +
      '</div>'
      ;

  } else if (state === 'CANCELL_REFUND' || state === 'EARLY_CHECKED_OUT') {
    header =
      '<div class="others-info">' +
      '<svg class="icon" aria-hidden="true">' +
      '<use xlink:href="#icon-' + map[state].icon + '"></use>' +
      '</svg>' +
      '<div>' +
      '<span class="txt ' + map[state].className + '">' + map[state].text + '</span>' +
      '<p class="cot-txt ' + map[state].className + '">退款中，申请时间：' + data + ' 处理时间：1-3个工作日' + '</p>' +
      '</div>' +
      '</div>'
      ;
  } else {
    header =
      '<div class="others-info">' +
      '<svg class="icon" aria-hidden="true">' +
      '<use xlink:href="#icon-' + map[state].icon + '"></use>' +
      '</svg>' +
      '<span class="txt ' + map[state].className + '">' + map[state].text + '</span>' +
      '</div>'
      ;
  }
  return header;
}
function buildRefundContent(state, data) {
  var refund = '';
  if (state === 'CANCELL_REFUND' || state === 'EARLY_CHECKED_OUT') {
    refund += '<div class="cancel-info">' +
      '<span>退款金额</span>' +
      '<span class="cancel-price">¥' + data.refund + '</span>' +
      '</div>'
      ;
  }

  return refund;
}
function buildButton(state) {
  var button = '';
  if (state === 'PENDING') {
    button =
      '<section class="check-body">' +
      '<a class="items" id="order-cancel">' +
      '<p>取消订单</p>' +
      '</a>' +
      '<a class="items" href="javascript:;" id="order-paid">付款</a>' +
      '</section>'
      ;
  } else if (state === 'CANCELL_REFUND' || state === 'EARLY_CHECKED_OUT' || state === 'INVALIDATED' || state === 'CHECKED_OUT') {
    button =
      '<section class="opinion-body">' +
      '<a class="items" id="talk-order">' +
      '<p>评价订单</p>' +
      '</a>' +
      '</section>'
      ;
  } else {
    button =
      '<section class="opinion-body">' +
      '<a class="items current" id="order-cancel">' +
      '<p>取消订单</p>' +
      '</a>' +
      '</section>'
      ;
  }
  // if (map[state].content.length > 0) {
  //   button += '<div class="more-text">' + map[state].content.replace('{{TEXT}}', data.refundDate) + '</div>';
  // }


  return button;
}

function startTimer(totalSeconds) {
  var tMin = 60;
  var $min = $('#minute');
  var $sec = $("#seconds");
  var interval = setInterval(function () {
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
      clearInterval(interval);
    }
  }, 1000);

}

function convertStatus(orderState, payState) {
  var state = orderState;


  /*
  CHECKED: 已入住
    CANCELL_REFUND, 已取消，有退款
    CANCELL_NO_REFUND, 已取消，无退款
  CHECKED_OUT, 已退房
  EARLY_CHECKED_OUT, 提前退房
  INVALIDATED 无效
  */
  if (orderState === 'BOOKED' && payState === 'NO_PAYMENT') {
    state = 'PENDING';  // 待付款
  } else if (orderState === 'BOOKED' && payState === 'PAYMENT') {
    state = 'PAYMENT';  // 待入住
  }
  return state;
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



$(function () {




  // 订单详情页面的get接口
  function orderDetails(params) {
    $.ajax({
      url: '/mshz-app/security/app/order/queryOrderDetail',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        // console.log('success');
        console.log(data);
        if (data.status === 'C0000') {
          if (data && data.result && data.result !== '') {
            var json = data.result;

            var newOrderState = convertStatus(json.orderState, json.payState);

            var houseInfo =
              '<div class="order-info">' +
              '<div class="content">' +
              '<img src="' + json.roomMainPic + '" alt="">' +
              '<div class="i-txt">' +
              '<span class="title">' + json.roomTitle + '</span>' +
              '<div class="txt-line">' +
              '<i class="line-items">' + json.gardenArea + '</i>' +
              '<i class="line-items">' + json.roomLayout + '居' + json.roomArea + '平</i>' +
              '<i class="line-items">' + json.roomCount + '人</i>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="time">' +
              '<i class="icon iconfont icon-shijianxianshi"></i>' +
              '<span class="txt">' + json.startTime + '至' + json.endTime + '</span>' +
              '<span class="txt"> ' + json.bookedDays + '晚</span>' +
              '</div>' +
              '<div class="address">' +
              '<i class="icon iconfont icon-lubiao"></i>' +
              '<span class="txt">地址:</span>' +
              '<span class="txt">' + json.address + '</span>' +
              '</div>' +
              '</div>'
              ;

            var moneyInfo =
              '<div class="money-info">' +
              '<span class="title">费用信息</span>' +
              '<div class="check-list">';

            var fundsModelList = json.fundsModelList;
            for (var i = 0, len = fundsModelList.length; i < len; i++) {
              moneyInfo += '<div class="items">' +
                '<span>' + fundsModelList[i].itemName + '</span>' +
                '<span>¥' + fundsModelList[i].itemMoney + '</span>' +
                '</div>';
            }

            moneyInfo +=

              '</div>' +
              '<div class="total">' +
              '<span>总额</span>' +
              '<span class="price">¥' + json.totalPrice + '</span>' +
              '</div>' +
              '</div>'
              ;

            var customerInfoHTML = '<div class="peo-info">' +
              '<span class="title">入住人信息</span>';

            var custModelList = json.custModelList;
            for (var i = 0, len = custModelList.length; i < len; i++) {
              customerInfoHTML += '<div class="pri-info">' +
                '<span>' + custModelList[0].custName + '</span>' +
                '<span>' + custModelList[0].custIdCard + '</span>' +
                '<span>' + custModelList[0].custPhone + '</span>';
              '</div>';
            }
            customerInfoHTML += '</div>';

            newOrderState = 'PAYMENT';
            var headerHTML = buildHeader(newOrderState, json);
            var refundHTML = buildRefundContent(newOrderState, json);


            $('#article-body').html(headerHTML + houseInfo + moneyInfo + refundHTML + customerInfoHTML);
            var buttonsHTML = buildButton(newOrderState);
            $('body').append(buttonsHTML);
            console.log(newOrderState);
            console.log('json.effectTimeSecond=', json.effectTimeSecond);
            if (newOrderState === 'PENDING') {
              startTimer(json.effectTimeSecond);
            }


          }
          else {

          }
        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }


  // 取消订单的post接口
  function orderCancel(params) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/security/app/order/cancelOrder',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (data) {
        console.log(data);

        if (data.status === 'C0000') {
          console.log('success');
          showMessage('取消成功', 1000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');

          //跳转order-list页面
          var path = './order-list页面.html';
          window.location = path;
        }
        // if (data && data.result && data.result.orderNo !== '') {
        //   var path = './order-payment.html?orderNo=' + data.result.orderNo;
        //   console.log(path);
        //   window.location = path;
        // }


      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }
  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }
  var orderNo = getUrlParam('orderNo');
  if (!orderNo) {
    location.replace('error.html?code=E0001')
  } else {
    $('#orderNo').val(orderNo);
    // 关闭loading
    $('#loading').remove();
    var initParams = {
      orderNo: orderNo,
    }
    orderDetails(initParams);
  }



  // 点击付款按钮跳转到订单支付页面 order-payment

  $('#order-paid').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var order = $('#orderNo').val();

    var path = './order-payment.html?orderNo=' + orderNo;
    window.location = path;
    // orderPaid(paidParams);
  });

  // 点击取消订单 跳转到订单列表页面  弹出弹框，点击确定取消，删除该订单dom”释放房源，toast，取消成功，跳转订单列吧
  $('#order-cancel').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#overlay').show();
    $('#overlay .box').show();
    // orderCancel(cancelParams);

    // var path = './order-list.html';
    // window.location = path;
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
    var orderNo = $('#orderno').val();
    $('#overlay').hide();
    $('#overlay .box').hide();
    //释放房源
    var cancelParams = {
      orderNo: orderNo,
    }
    orderCancel(cancelParams);

  });


  // 点击评价订单
  $('#talk-order').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var order = $('#orderNo').val();

  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });

});
