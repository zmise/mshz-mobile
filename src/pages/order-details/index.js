require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/js/appDownload.js');//全局下载APP

require('../../assets/vendors/iconfont/iconfont.js'); //有色图标


// var str = '';
// var strA = '';
// var strB = '';
// var strC = '';
// var strD = '';
// var strE = '';
// var strF = '';
// var strG = '';

// if (json.orderState === 'BOOKED') {
//   strA = '';
//   strC = '';
//   strE = '<span>押金</span> <span>¥' + json.remark + '</span>';
//   strG = '';

// } else if (json.orderState === 'CHECKED') {

// } else if (json.orderState === 'CANCELL_REFUND') {

// } else if (json.orderState === 'CANCELL_NO_REFUND') {

// } else if (json.orderState === 'CHECKED_OUT') {

// } else if (json.orderState === 'EARLY_CHECKED_OUT') {

// } else {

// }

// return '';
var map = {
  'PENDING': { icon: 'daifukuan', text: 'asdfasdf<span id="minute">15</span>fen <span id="second">00</span>asldkjfksd', 'content': '' },
  'CHECKED': { icon: 'yiruzhu', text: '已入住', 'content': '' },
  'CANCEL': { icon: 'yiruzhu', text: '已入住', 'content': 'asdf{{TEXT}}asdf' },
};

function buildHeader(state) {
  var header = '<div><i class="icon-' + map[state].icon + '"></i><span class="state-text">' + map[state].text + '</span>';

  if (map[state].content.length > 0) {
    header += '<div class="more-text">' + map[state].content.replace('{{TEXT}}', data.refundDate) + '</div>';
  }

  header += '</div>';

  return header;
}


function startTimer(totalSeconds) {

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
    state = 'PEDDING';  // 待付款
  } else if (orderState === 'BOOKED' && payState === 'PAYMENT') {
    state = 'PAYMENT';  // 待入住
  }
  return state;
}


$(function () {


  function tobepaidTime() {
    var t_min = 60;
    var $min = $('#minute');
    var $sec = $("#seconds");
    $min.text('30');
    $sec.text('00');
    var interval = setInterval(function () {
      var t_result = ($min.text() - 0) * 60 + ($sec.text() - 0) - 1;
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

  }

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

            var newOrderState = convertStatus(orderState, payState);

            var json = data.result;


            var houseInfo =
              '< div class="order-info" >' +
              '<div class="content">' +
              '<img src="' + json.mainPicture + '" alt="">' +
              '<div class="i-txt">' +
              '<span class="title">' + json.title + '</span>' +
              '<div class="txt-line">' +
              '<i class="line-items">' + json.roomBuilding + '</i>' +
              '<i class="line-items">' + json.roomCount + '居' + json.area + '平</i>' +
              '<i class="line-items">' + json.livedCount + '人</i>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="time">' +
              '<i class="icon iconfont icon-shijianxianshi"></i>' +
              '<span class="txt">' + json.startTime + '至' + json.endTime + '</span>' +
              '<span class="txt">' + json.bookedDays + '晚</span>' +
              '</div>' +
              '<div class="address">' +
              '<i class="icon iconfont icon-lubiao"></i>' +
              '<span class="txt">地址:</span>' +
              '<span class="txt">' + json.addressDesc + '</span>' +
              '</div>' +
              '</div>';

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

            moneyInfo += '</div>' +
              '<div class="total">' +
              '<span>总额</span>' +
              '<span class="price">¥' + json.roomRate + '</span>' +
              '</div>' +
              '</div>';

            var customerInfoHTML = '<div class="peo-info">' +
              '<span class="title">入住人信息</span>';

            var custModelList = json.custModelList;
            for (var i = 0, len = custModelList.length; i < len; i++) {
              customerInfo += '<div class="pri-info">' +
                '<span>' + custModelList[0].custName + '</span>' +
                '<span>' + custModelList.custIdCard + '</span>' +
                '<span>' + custModelList + '</span>';
              '</div>';
            }
            customerInfo += '</div>';


            var headerHTML = buildHeader(newOrderState);
            var refundHTML = buildRefundContent(newOrderState);
            var buttonsHTML = buildButton(newOrderState);


            $('#orderInfo').html(headerHTML + moneyInfo + houseInfo + refundHTML + customerInfo + buttonsHTML);

            if (newOrderState === 'PENDING') {
              startTimer(json.totalSeconds);
            }


          }

        }

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
    // 关闭loading
    $('#loading').remove();
    var initParams = {
      orderNo: orderNo,
    }
    orderDetails(initParams);
  }

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.history.go(-1)
  });

});
