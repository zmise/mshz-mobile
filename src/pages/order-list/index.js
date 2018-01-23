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
                str += '<div class="box"><a class="content orderDetails" data-orderno="' + data[i].orderNo + '" data-orderstate="' + data[i].orderState + '"><div class="title current"><span>' + data[i].roomTitle + '</span><span>¥' + data[i].totalPrice + '</span></div><div class="time"><span>' + data[i].startTime + '至' + data[i].endTime + '</span><div><span>房费：</span><span>¥' + data[i].roomRate + '</span></div></div><div class="total"><span>' + data[i].bookedDays + '晚</span><div> <span>押金：</span><span>¥' + data[i].roomDeposit + '</span></div></div> </a><div class="status"><div class="stu-but"><button class="cancel-order">取消订单</button><button class="current1 order-paid">付款</button></div></div></div>';
              }
            }
            if (params.orderQueryType === 'VALIDATED') {
              for (var i = 0; i < data.length; i++) {
                strA = '<div class="box"><a class="content orderDetails" data-orderno="' + data[i].orderNo + '" data-orderstate="' + data[i].orderState + '"><div class="title"><span>' + data[i].roomTitle + '</span><span>¥' + data[i].totalPrice + '</span></div><div class="time"><span>' + data[i].startTime + '至' + data[i].endTime + '</span><div><span>房费：</span><span>¥' + data[i].roomRate + '</span></div></div><div class="total"><span>' + data[i].bookedDays + '晚</span><div>';
                if (data[i].orderState === 'BOOKED') {
                  strB = '<span>押金：</span><span>¥' + data[i].roomDeposit + '</span></div></div></a><div class="status"><span class="title current3">待入住</span><div class="stu-but"><button class="cancel-order">取消订单</button><button class="current3 order-again" data-order-no="' + data[i].orderNo + '" data-roomid="' + data[i].roomId + '">再次预订</button></div></div></div>';
                } else if (data[i].orderState === 'CHECKED') {
                  strB = '<span>押金：</span><span>¥' + data[i].roomDeposit + '</span></div></div></a><div class="status"><span class="title current3">入住中</span><div class="stu-but"><button class="current3 order-again" data-order-no="' + data[i].orderNo + '" data-roomid="' + data[i].roomId + '">再次预订</button></div></div></div>';
                } else {
                  strB = '<span>额外费用：</span><span>¥' + data[i].extarAcount + '</span></div></div></a><div class="status"><span class="title current2">' + data[i].orderStateDesc + '</span><div class="stu-but"><button class="order-again" data-order-no="' + data[i].orderNo + '" data-roomid="' + data[i].roomId + '">再次预订</button><button class="current2 talk-order" data-orderno="' + data[i].orderNo + '" data-roomid="' + data[i].roomId + '">评价订单</button></div></div></div>';
                }

                str += strA + strB;
              }
            }
            if (params.orderQueryType === 'CANCELLED_AND_INVALIDATED') {
              for (var i = 0; i < data.length; i++) {
                str += '<div class="box"><a class="content orderDetails" data-orderno="' + data[i].orderNo + '" data-orderstate="' + data[i].orderState + '"><div class="title"><span>' + data[i].roomTitle + '</span><span>¥' + data[i].totalPrice + '</span></div><div class="time"><span>' + data[i].startTime + '至' + data[i].endTime + '</span><div><span>房费：</span><span>¥' + data[i].roomRate + '</span></div></div><div class="total"><span>' + data[i].bookedDays + '晚</span><div> <span>押金：</span><span>¥' + data[i].roomDeposit + '</span></div></div> </a> <div class="status"><span class="title current3">' + data[i].orderStateDesc + '</span><div class="stu-but"><button class="current3 order-again" data-order-no="' + data[i].orderNo + '" data-roomid="' + data[i].roomId + '">再次预订</button></div></div></div>';
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

  $('.article-body').on('tap', '.orderDetails', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var orderNo = $(this).data('orderno');
    var orderState = $(this).data('orderstate');
    console.log(orderNo);
    if (orderNo && orderNo !== '') {
      var path = './order-details.html?orderNo=' + orderNo;
      window.location = path;
    }
  });



  // 点击付款order-paid按钮跳转到订单支付页面 order-payment
  $('.article-body').on('tap', '.order-paid', function (e) {
    e.stopPropagation();
    e.preventDefault();
    // console.log($(this).closest('.box').find('.orderDetails').data('orderno'));
    var orderNo = $(this).closest('.box').find('.orderDetails').data('orderno');

    var path = './order-payment.html?orderNo=' + orderNo;
    window.location = path;

  });

  // 点击再次预订order-again按钮跳转到订单确认页面order-check
  $('.article-body').on('tap', '.order-again', function (e) {
    e.stopPropagation();
    e.preventDefault();
    // var roomId = $(this).data('roomid');
    var orderNo = $(this).data('orderNo');

    var path = './order-details.html?orderNo=' + orderNo;
    console.log(path)
    window.location = path;

  });


  // 点击取消订单cancel-order按钮，弹出弹框，点击确定取消，删除该订单dom，toast，取消成功”释放房源
  $('.article-body').on('tap', '.cancel-order', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var orderNo = $(this).closest('.box').find('.orderDetails').data('orderno');
    $('#orderno').val(orderNo);
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
  $('.article-body').on('tap', '.talk-order', function (e) {
    e.stopPropagation();
    e.preventDefault();

    var orderNo = $(this).data('orderno');
    var roomId = $(this).data('roomid');

    var path = './assess-order.html?orderNo=' + orderNo + '&roomId=' + roomId;
    // console.log(path)
    window.location = path;
  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});



