require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/js/appDownload.js');//全局下载APP
require('../../assets/js/toast.js');  //toast的事件


/* 切换订单分类栏的事件 */
$(function () {
  /* get请求  订单列表数据 */
  function orderList(params) {
    $.ajax({
      url: '/mshz-app/security/app/order/queryOrderList',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        console.log(res);
        if (res.status === 'C0000') {
          // console.log(res.result);
          $('.article-body').empty();

          var str = '';
          var strA = '';
          var strB = '';
          var data = res.result;

          if (data.length !== 0) {

            if (params.orderQueryType === 'WAIT_PAYMENT') {
              for (var i = 0; i < data.length; i++) {
                str += '<div class="box">' +
                  '  <a href="./order-details.html?orderNo=' + data[i].orderNo + '" class="content">' +
                  '<div class="title current">' +
                  '  <span>' + data[i].roomTitle + '</span><span>¥' + data[i].totalPrice + '</span>' +
                  '</div>' +
                  '<div class="time">' +
                  '  <span>' + data[i].startTime + '至' + data[i].endTime + '</span>' +
                  '  <div><span>房费：</span><span>¥' + data[i].roomRate + '</span></div>' +
                  '</div>' +
                  '<div class="total">' +
                  '  <span>' + data[i].bookedDays + '晚</span>' +
                  '  <div><span>押金：</span><span>¥' + data[i].roomDeposit + '</span></div>' +
                  '</div>' +
                  '</a>' +
                  '<div class="status">' +
                  '  <div class="stu-but">' +
                  '      <a href="javascript:;" class="cancel-order" data-order-no="' + data[i].orderNo + '">取消订单</a>' +
                  '      <a class="current1" href=./order-payment.html?orderNo=' + data[i].orderNo + '">付款</a>' +
                  '  </div>' +
                  '</div></div>';
              }
            } else if (params.orderQueryType === 'VALIDATED') {
              for (var i = 0; i < data.length; i++) {
                strA =
                  '<div class="box">' +
                  '  <a href="./order-details.html?orderNo=' + data[i].orderNo + '" class="content">' +
                  '    <div class="title">' +
                  '      <span>' + data[i].roomTitle + '</span>' +
                  '      <span>¥' + data[i].totalPrice + '</span>' +
                  '    </div>' +
                  '    <div class="time">' +
                  '      <span>' + data[i].startTime + '至' + data[i].endTime + '</span>' +
                  '      <div>' +
                  '        <span>房费：</span>' +
                  '        <span>¥' + data[i].roomRate + '</span>' +
                  '      </div>' +
                  '    </div>' +
                  '    <div class="total">' +
                  '      <span>' + data[i].bookedDays + '晚</span>';
                if (data[i].orderState === 'BOOKED') {
                  strB =
                    '      <div>' +
                    '        <span>押金：</span>' +
                    '        <span>¥' + data[i].roomDeposit + '</span>' +
                    '      </div>' +
                    '    </div>' +
                    '  </a>' +
                    '  <div class="status">' +
                    '    <span class="title current3">已预订</span>' +
                    '    <div class="stu-but">' +
                    '      <a href="javascript:;" class="cancel-order" data-order-no="' + data[i].orderNo + '">取消订单</a>' +
                    '      <a class="current3" href="./order-details.html?orderNo=' + data[i].orderNo + '">再次预订</a>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
                } else if (data[i].orderState === 'CHECKED') {
                  strB =
                    '      <div>' +
                    '        <span>押金：</span>' +
                    '        <span>¥' + data[i].roomDeposit + '</span>' +
                    '      </div>' +
                    '    </div>' +
                    '  </a>' +
                    '  <div class="status">' +
                    '    <span class="title current3">已入住</span>' +
                    '    <div class="stu-but">' +
                    '      <a class="current3" href="./order-details.html?orderNo=' + data[i].orderNo + '">再次预订</a>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
                } else {
                  strB =
                    '      <div>' +
                    '        <span>额外费用：</span>' +
                    '        <span>¥' + data[i].extarAcount + '</span>' +
                    '      </div>' +
                    '    </div>' +
                    '  </a>' +
                    '  <div class="status">' +
                    '    <span class="title current2">' + data[i].orderStateDesc + '</span>' +
                    '    <div class="stu-but">' +
                    '      <a href="./order-details.html?orderNo=' + data[i].orderNo + '">再次预订</a>' +
                    '      <a class="current2" href="./assess-order.html?orderNo=' + data[i].orderNo + '&roomId=' + data[i].roomId + '">评价订单</a>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
                }

                str += strA + strB;
              }
            } else if (params.orderQueryType === 'CANCELLED_AND_INVALIDATED') {
              for (var i = 0; i < data.length; i++) {
                str +=
                  '<div class="box">' +
                  '  <a href="./order-details.html?orderNo=' + data[i].orderNo + '" class="content">' +
                  '    <div class="title">' +
                  '      <span>' + data[i].roomTitle + '</span>' +
                  '      <span>¥' + data[i].totalPrice + '</span>' +
                  '    </div>' +
                  '    <div class="time">' +
                  '      <span>' + data[i].startTime + '至' + data[i].endTime + '</span>' +
                  '      <div>' +
                  '        <span>房费：</span>' +
                  '        <span>¥' + data[i].roomRate + '</span>' +
                  '      </div>' +
                  '    </div>' +
                  '    <div class="total">' +
                  '      <span>' + data[i].bookedDays + '晚</span>' +
                  '      <div>' +
                  '        <span>押金：</span>' +
                  '        <span>¥' + data[i].roomDeposit + '</span>' +
                  '      </div>' +
                  '    </div>' +
                  '  </a>' +
                  '  <div class="status">' +
                  '    <span class="title current3">' + data[i].orderStateDesc + '</span>' +
                  '    <div class="stu-but">' +
                  '      <a class="current3" href="./order-details.html?orderNo=' + data[i].orderNo + '">再次预订</a>' +
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
          var params = {
            orderQueryType: $('#orderQueryType').val(),
          }

          showMessage('取消成功', 1000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
          orderList(params);
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


  var initParams = {
    orderQueryType: 'WAIT_PAYMENT',
  }
  $('#orderQueryType').val(initParams.orderQueryType);
  orderList(initParams);


  var $orderSort = $('.order-sort-body');

  $('#tobepaid').attr('data-type', 'WAIT_PAYMENT');
  $('#valid').attr('data-type', 'VALIDATED');
  $('#invalid').attr('data-type', 'CANCELLED_AND_INVALIDATED');

  $orderSort.on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $orderSort.find('.txt').removeClass('current');
    $(this).find('.txt').addClass('current');
    $orderSort.find('.line').removeClass('current');
    $(this).find('.line').addClass('current');
    $('.article-body').empty();

    // console.log($(this).data('type'));
    var params = {
      orderQueryType: $(this).data('type'),
    }
    $('#orderQueryType').val(params.orderQueryType);

    // ajax请求数据 刷新article-body盒子的内容
    orderList(params);
    /* 点击生成订单列表数据 */
  });


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



