var map = {
  PENDING: { icon: 'dairuzhu', text: '待付款', className: 'current2' },
  PAYMENT: { icon: 'dairuzhu', text: '已预订', className: 'current2' },
  CANCELL_REFUND: { icon: 'yiquxiao', text: '已取消', className: 'current1' },
  CANCELL_NO_REFUND: { icon: 'yiquxiao', text: '已取消', className: 'current1' },
  CHECKED: { icon: 'yituifangyoutuikuan', text: '已入住', className: 'current2' },
  CHECKED_OUT: { icon: 'yituifangwutuikuan', text: '已退房', className: 'current2' },
  EARLY_CHECKED_OUT: { icon: 'yituifangyoutuikuan', text: '提前退房', className: 'current2' },
  INVALIDATED: { icon: 'zhifuchaoshi', text: '支付超时，订单已失效', className: 'current1' },
  INVALIDATIING: { icon: 'zhifuchaoshi', text: '支付超时，订单取消中', className: 'current1' }
};


var orderNo = ''; // 保存当前页的订单号
var newOrderState = ''; // 重新定义浏览器端所使用的订单状态
var reqSource = ''; // 判断前一个页面是否是订单支付
var flag = ''; // 判断前一个页面那种类型的列表
//获取url中的参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}

function buildHeader(data) {
  var state = data.newOrderState;
  var header = '';
  if (state === 'PENDING' || state === 'BOOKED') {
    header =
      '<div class="time-paid">' +
      '<span class="txt">已为您保留房源，请于 ' +
      '<span class="minute" id="minute"></span> 分 ' +
      '<span class="seconds" id="seconds"></span>' +
      ' 秒内支付订单</span>' +
      '<i class="icon iconfont icon-daojishi"></i>' +
      '</div>';

  } else if (state === 'CANCELL_REFUND' || state === 'EARLY_CHECKED_OUT') {
    header =
      '<div class="others-info">' +
      '  <svg class="icon" aria-hidden="true">' +
      '    <use xlink:href="#icon-' + map[state].icon + '"></use>' +
      '  </svg>' +
      '<div>';

    if (state === 'EARLY_CHECKED_OUT' && data.refund === 0) {
      header += '  <span class="txt ' + map[state].className + '">' + map[state].text + '</span>';
    } else if (data.refundState !== 'REFUND_FINISH') {
      header += '  <span class="txt ' + map[state].className + '">' + map[state].text + '</span>' +
        '<p class="cot-txt ' + map[state].className + '">退款中，申请时间：' + data.refundApplyTime + ' 处理时间：1-3个工作日';
    } else {
      //header += '  <span class="txt ' + map[state].className + '">' + data.refundStateDesc + '</span>';
      header += '  <span class="txt ' + map[state].className + '">' + map[state].text + '</span>';
    }

    header += '</p>' +
      '  </div>' +
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
function buildRefundContent(data) {
  var state = data.newOrderState;
  var refund = '';
  if (data.refund > 0 && (state === 'CANCELL_REFUND' || state === 'EARLY_CHECKED_OUT')) {
    refund += '<div class="cancel-info">' +
      '<span>退款金额</span>' +
      '<span class="cancel-price">¥' + data.refund + '</span>' +
      '</div>';
  }

  return refund;
}
function buildButton(state, data) {
  var button = '';
  if (data.commentState === 'ALREADY_COMMENT') {
    return;
  } else if (state === 'PENDING') {
    button =
      '<section class="check-body">' +
      '<a class="items" id="orderCancel">' +
      '<p>取消订单</p>' +
      '</a>' +
      '<a class="items" href="javascript:;" id="orderPaid">付款</a>' +
      '</section>';
  } else if (state === 'PAYMENT' && data.cancelFlag === '1') {
    button =
      '<section class="opinion-body">' +
      '<a class="items" id="orderCancel">' +
      '<p>取消订单</p>' +
      '</a>' +
      '</section>';
  } else if (state === 'EARLY_CHECKED_OUT' || state === 'CHECKED_OUT') {
    button =
      '<section class="opinion-body">' +
      '<a class="items" id="talk-order" data-roomid="' + data.roomId + '">' +
      '<p>评价订单</p>' +
      '</a>' +
      '</section>';
  }


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
      tResultMin = '0' + tResultMin;
    }

    if (tResultSec < 10) {
      tResultSec = '0' + tResultSec;
    }
    totalSeconds = totalSeconds - 1;
    //显示到页面上
    $min.text(tResultMin);
    $sec.text(tResultSec);

    //清除定时器并执行释放房源的操作和刷新页面
    if (tResult <= 0) {
      clearInterval(interval);
      location.replace('./order-details.html?orderNo=' + orderNo);
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
  if (orderState === 'BOOKED' && payState === 'WAIT_PAYMENT') {
    state = 'PENDING';  // 待付款
  } else if (orderState === 'BOOKED' && payState === 'PAYMENT') {
    state = 'PAYMENT';  // 已预订
  } else if (orderState === 'BOOKED' && payState === 'PART_PAYMENT') {
    state = 'PAYMENT';  // 已预订
  }
  return state;
}


function orderInfo() {
  orderNo = getUrlParam('orderNo');
  flag = getUrlParam('flag');

  if (!orderNo || orderNo.length < 14) {
    location.replace('error.html?code=E0001');
  }

  reqSource = getUrlParam('reqSource');
  var params = {}
  if (reqSource && reqSource !== '') {
    params = {
      orderNo: orderNo,
      reqSource: reqSource,
    }
  } else {
    params = {
      orderNo: orderNo
    }
  }

  var dfd = $.Deferred();

  $.ajax({
    url: '/mshz-app/security/app/order/queryOrderDetail',
    data: params,
    dataType: 'json',
    type: 'GET',
    cache: false
  }).then(function (res) {
    if (res.status === 'C0000') {
      res.result.newOrderState = convertStatus(res.result.orderState, res.result.payState);
      dfd.resolve(res.result);
    } else {
      dfd.reject(res);
    }
  }).fail(function (err) {
    dfd.reject(err);
  });

  return dfd.promise();
}


module.exports = {
  orderNo: getUrlParam('orderNo'),
  reqSource: getUrlParam('reqSource'),
  flag: getUrlParam('flag'),
  buildHeader: buildHeader,
  buildRefundContent: buildRefundContent,
  buildButton: buildButton,
  orderInfo: orderInfo,
  startTimer: startTimer
};
