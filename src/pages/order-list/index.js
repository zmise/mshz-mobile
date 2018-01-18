require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/js/appDownload.js');//全局下载APP


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
      success: function (data) {
        console.log(data);
        if (data.status === 'C0000') {
          if (data.result) {
            var json = data.result;
            var str = '';
            var strA = '';
            var strB = '';
            var template = '';
            if (params.orderQueryType === 'WAIT_PAYMENT') {
              for (var i = 0; i < json.length; i++) {
                str += '<div class="box"><a class="content orderDetails" data-orderno="' + json[i].orderNo + '"><div class="title current"><span>' + json[i].roomTitle + '</span><span>¥' + json[i].totalPrice + '</span></div><div class="time"><span>' + json[i].startTime + '至' + json[i].endTime + '</span><div><span>房费：</span><span>¥' + json[i].roomRate + '</span></div></div><div class="total"><span>' + json[i].bookedDays + '晚</span><div> <span>押金：</span><span>¥' + json[i].roomDeposit + '</span></div></div> </a><div class="status"><div class="stu-but"><button>取消订单</button><button class="current1">付款</button></div></div></div>';
              }
            }
            if (params.orderQueryType === 'VALIDATED') {
              for (var i = 0; i < json.length; i++) {
                strA = '<div class="box"><a class="content orderDetails" data-orderno="' + json[i].orderNo + '"><div class="title"><span>' + json[i].roomTitle + '</span><span>¥' + json[i].totalPrice + '</span></div><div class="time"><span>' + json[i].startTime + '至' + json[i].endTime + '</span><div><span>房费：</span><span>¥' + json[i].roomRate + '</span></div></div><div class="total"><span>' + json[i].bookedDays + '晚</span><div> ';
                if (json[i].orderState === 'CHECKED_OUT') {
                  strB = '<span>额外费用：</span><span>¥' + json[i].extarAcount + '</span></div></div> </a><div class="status"><span class="title current2">已退房</span><div class="stu-but"><button>再次预订</button><button class="current2">评价订单</button></div></div></div>';
                } else if (json[i].orderState === 'BOOKED') {
                  strB = '<span>押金：</span><span>¥' + json[i].roomDeposit + '</span></div></div> </a><div class="status"><span class="title current3">待入住</span><div class="stu-but"><button>取消订单</button><button class="current3">再次预订</button></div></div></div>';
                } else if (json[i].orderState === 'CHECKED') {
                  strB = '<span>押金：</span><span>¥' + json[i].roomDeposit + '</span></div></div> </a><div class="status"><span class="title current3">入住中</span><div class="stu-but"><button class="current3">再次预订</button></div></div></div>';
                } else {
                  strB = '<span>额外费用：</span><span>¥' + json[i].extarAcount + '</span></div></div> </a><div class="status"><span class="title current2">提前退房</span><div class="stu-but"><button>再次预订</button><button class="current2">评价订单</button></div></div></div>';
                }

                str += strA + strB;
              }
            }
            if (params.orderQueryType === 'CANCELLED_AND_INVALIDATED') {
              for (var i = 0; i < json.length; i++) {
                str += '<div class="box"><a class="content orderDetails" data-orderno="' + json[i].orderNo + '"><div class="title"><span>' + json[i].roomTitle + '</span><span>¥' + json[i].totalPrice + '</span></div><div class="time"><span>' + json[i].startTime + '至' + json[i].endTime + '</span><div><span>房费：</span><span>¥' + json[i].roomRate + '</span></div></div><div class="total"><span>' + json[i].bookedDays + '晚</span><div> <span>押金：</span><span>¥' + json[i].roomDeposit + '</span></div></div> </a> <div class="status"><span class="title current3">' + json[i].orderStateDesc + '</span><div class="stu-but"><button class="current3">再次预订</button></div></div></div>';
              }
            }

            $('.article-body').append(str);
          }
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }
  var initParams = {
    orderQueryType: 'WAIT_PAYMENT',
  }
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

    console.log($(this).data('type'));
    var params = {
      orderQueryType: $(this).data('type'),
    }
    // ajax请求数据 刷新article-body盒子的内容
    orderList(params);
    /* 点击生成订单列表数据 */
  });

  $('.article-body').on('tap', '.orderDetails', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var orderNo = $(this).data('orderno');
    console.log(orderNo);
    if (orderNo && orderNo !== '') {
      var path = "./order-details.html?orderNo=" + orderNo;
      window.location = path;
    }
  });



  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    windows.history.go(-1)
  });
});



