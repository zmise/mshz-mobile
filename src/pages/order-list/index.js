require('../../common/session');
require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/js/appDownload.js');//全局下载APP
require('../../assets/js/toast.js');  //toast的事件


/* 切换订单分类栏的事件 */
$(function () {
  // 获取默认页签类型
  var orderQueryType = location.hash.substr(1) || 'WAIT_PAYMENT';
  var $orderSort = $('.order-sort-body');

  $orderSort.on('tap', '.items', function (e) {
    $orderSort.find('.txt').removeClass('current');
    $(this).find('.txt').addClass('current');
    $orderSort.find('.line').removeClass('current');
    $(this).find('.line').addClass('current');
    $('.article-body').empty();

    orderQueryType = $(this).data('orderQueryType');

    orderList();
  });

  $orderSort.find('a[data-order-query-type="' + orderQueryType + '"]').trigger('tap');


  /* get请求  订单列表数据 */
  function orderList() {
    $.ajax({
      url: '/mshz-app/security/app/order/queryOrderList',
      data: {
        orderQueryType: orderQueryType
      },
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          $('.article-body').empty();

          var str = '';
          var strA = '';
          var strB = '';
          var data = res.result;

          if (data.length !== 0) {

            if (orderQueryType === 'WAIT_PAYMENT') {
              for (var i = 0; i < data.length; i++) {
                var item = data[i];
                str += '<div class="box">' +
                  '  <a href="./order-details.html?orderNo=' + item.orderNo + '" class="content">' +
                  '<div class="title current">' +
                  '  <span>' + item.roomTitle + '</span><span>¥' + item.totalPrice + '</span>' +
                  '</div>' +
                  '<div class="time">' +
                  '  <span>' + item.startTime + '至' + item.endTime + '</span>' +
                  '  <div><span>房费：</span><span class="amount">¥' + item.roomRate + '</span></div>' +
                  '</div>' +
                  '<div class="total">' +
                  '  <span>' + item.bookedDays + '晚</span>' +
                  '  <div><span>押金：</span><span class="amount">¥' + item.roomDeposit + '</span></div>' +
                  '</div>' +
                  '</a>' +
                  '<div class="status">' +
                  '  <div class="stu-but">' +
                  '    <a href="javascript:;" class="cancel-order" data-order-no="' + item.orderNo + '">取消订单</a>' +
                  '    <a class="current1" href="./order-payment.html?orderNo=' + item.orderNo + '">付款</a>' +
                  '  </div>' +
                  '</div></div>';
              }
            } else if (orderQueryType === 'VALIDATED') {
              for (var i = 0; i < data.length; i++) {
                var item = data[i];
                strA =
                  '<div class="box">' +
                  '  <a href="./order-details.html?orderNo=' + item.orderNo + '" class="content">' +
                  '    <div class="title">' +
                  '      <span class="ellips">' + item.roomTitle + '</span>' +
                  '      <span>¥' + item.totalPrice + '</span>' +
                  '    </div>' +
                  '    <div class="time">' +
                  '      <span>' + item.startTime + '至' + item.endTime + '</span>' +
                  '      <div>' +
                  '        <span>房费：</span><span class="amount">¥' + item.roomRate + '</span>' +
                  '      </div>' +
                  '    </div>' +
                  '    <div class="total">' +
                  '      <span>' + item.bookedDays + '晚</span>';
                if (item.orderState === 'BOOKED') {
                  strB =
                    '      <div>' +
                    '        <span>押金：</span><span class="amount">¥' + item.roomDeposit + '</span>' +
                    '      </div>' +
                    '    </div>' +
                    '  </a>' +
                    '  <div class="status">' +
                    '    <span class="title current3">已预订</span>' +
                    '    <div class="stu-but">';
                  if (item.cancelFlag === '1') {
                    strB +=
                      '    <a href="javascript:;" class="cancel-order" data-order-no="' + item.orderNo + '">取消订单</a>';
                  }
                  strB +=
                    '      <a class="current3" href="/houseDetails?id=' + item.situationId + '">再次预订</a>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
                } else if (item.orderState === 'CHECKED') {
                  strB =
                    '      <div>' +
                    '        <span>押金：</span><span class="amount">¥' + item.roomDeposit + '</span>' +
                    '      </div>' +
                    '    </div>' +
                    '  </a>' +
                    '  <div class="status">' +
                    '    <span class="title current3">已入住</span>' +
                    '    <div class="stu-but">' +
                    '      <a class="current3" href="/houseDetails?id=' + item.situationId + '">再次预订</a>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
                } else {
                  strB = '';
                  if (item.extarAcount > 0) {
                    strB =
                      '      <div>' +
                      '        <span>额外费用：</span><span class="amount">¥' + item.extarAcount + '</span>' +
                      '      </div>';
                  }
                  strB +=
                    '    </div>' +
                    '  </a>' +
                    '  <div class="status">' +
                    '    <span class="title current2">' + item.orderStateDesc + '</span>' +
                    '    <div class="stu-but">' +
                    '      <a href="/houseDetails?id=' + item.situationId + '">再次预订</a>';
                  if (item.commentState !== 'ALREADY_COMMENT') {
                    strB +=
                      '      <a class="current2" href="./comment-order.html?orderNo=' + item.orderNo + '&roomId=' + item.roomId + '">评价订单</a>';
                  }
                  strB += '    </div>' +
                    '  </div>' +
                    '</div>';
                }

                str += strA + strB;
              }
            } else if (orderQueryType === 'CANCELLED_AND_INVALIDATED') {
              for (var i = 0; i < data.length; i++) {
                var item = data[i];
                str +=
                  '<div class="box">' +
                  '  <a href="./order-details.html?orderNo=' + item.orderNo + '" class="content">' +
                  '    <div class="title">' +
                  '      <span>' + item.roomTitle + '</span>' +
                  '      <span>¥' + item.totalPrice + '</span>' +
                  '    </div>' +
                  '    <div class="time">' +
                  '      <span>' + item.startTime + '至' + item.endTime + '</span>' +
                  '      <div>' +
                  '        <span>房费：</span>' +
                  '        <span class="amount">¥' + item.roomRate + '</span>' +
                  '      </div>' +
                  '    </div>' +
                  '    <div class="total">' +
                  '      <span>' + item.bookedDays + '晚</span>' +
                  '      <div>' +
                  '        <span>押金：</span>' +
                  '        <span class="amount">¥' + item.roomDeposit + '</span>' +
                  '      </div>' +
                  '    </div>' +
                  '  </a>' +
                  '  <div class="status">';
                if (item.orderState === 'CANCELL_REFUND' || item.orderState === 'CANCELL_NO_REFUND') {
                  str +=
                    '    <span class="title current3">已取消</span>';
                } else if (item.orderState === 'INVALIDATED') {
                  str +=
                    '    <span class="title current3">支付超时，订单已失效</span>';
                } else {
                  str +=
                    '    <span class="title current3">' + item.orderStateDesc + '</span>';
                }
                str +=
                  '    <div class="stu-but">' +
                  '      <a class="current3" href="/houseDetails?id=' + item.situationId + '">再次预订</a>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>';
              }
            }
          } else {
            str =
              '<div class="noOrder-body">' +
              '<div class="img"></div>' +
              '<p clss="txt">~空空如也~</p>' +
              ' </div>'
              ;
          }
          $('.article-body').append(str);

        } else {
          showMessage(res.message, 3000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
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
      success: function (res) {

        if (res.status === 'C0000') {
          showMessage('取消成功', 1000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
          orderList();
        } else {
          showMessage(res.message, 3000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
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

  // 点击取消订单cancel-order按钮，弹出弹框，点击确定取消，删除该订单dom，toast，取消成功”释放房源
  $('.article-body').on('tap', '.cancel-order', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var orderNo = $(this).data('orderNo');
    $('#orderNo').val(orderNo);
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
    var orderNo = $('#orderNo').val();
    $('#overlay').hide();
    $('#overlay .box').hide();
    //释放房源
    var cancelParams = {
      orderNo: orderNo,
    }
    orderCancel(cancelParams);

  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});



