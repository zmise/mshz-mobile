require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');
require('../../sass/dropload.scss');


require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/js/appDownload.js');//全局下载APP
require('../../assets/js/dropload.min'); // 分页插件

var toast = require('../../assets/js/toast.js');  //toast的事件

window.onpageshow = function (event) {
  if (event.persisted) {
    location.reload();
  }
};
/* 切换订单分类栏的事件 */
$(function () {
  var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
  // 关闭loading
  if (loginInfo) {
    $('#loading').remove();
  }

  // 获取默认页签类型
  var orderQueryType = location.hash.substr(1) || 'WAIT_PAYMENT';
  var $orderSort = $('.order-sort-body');
  $orderSort.find('a[data-order-query-type="' + orderQueryType + '"]').trigger('tap').find('.txt').addClass('current').end().find('.line').addClass('current');

  // dropload

  var $orderList = $('.article-body .list'); // $('#orderList')
  var dropload = $('.article-body').dropload({
    scrollArea: window,
    domDown: {
      domClass: 'dropload-down',
      domRefresh: '<div class="dropload-refresh"> </div>',
      domLoad: '<div class="dropload-load"><span class="dropload-loading"></span>加载中...</div>',
      domNoData: '<div class="noOrder-body">' +
        '<div class="img"></div>' +
        '<p class="txt">~空空如也~</p>' +
        ' </div>',
      domFinished: '',// <div class="dropload-finished">已加载所有房源</div>'
      domNetworkError: '<section class="unusual-body">' +
        '  <div class="no-network"></div>' +
        '  <span>网络请求失败，请检查网络</span>' +
        '</section>'
    },
    loadDownFn: loadingMore
  });
  /* get请求  订单列表数据 */
  function loadingMore(options) {
    var curPage = +$('#page').val();
    if (options && options.isReload) {
      $('#page').val(1);
      dropload.unlock();
      curPage = 1;
    } else {
      $('#page').val(curPage + 1);
      curPage += 1;
    }
    var params = {
      currentPage: curPage,
      pageSize: 10,
      orderQueryType: orderQueryType
    }
    // console.log(params);
    $.ajax({
      url: '/mshz-app/security/app/order/queryOrderPage',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        console.log(res);
        var recordCount = res.result && res.result.recordCount || 0;
        if (params.page === 1) {
          $orderList.empty();
          $('.noOrder-body').remove();
        }
        var str = '';
        if (res.status === 'C0000'
          && res.result
          && res.result.items
          && res.result.items.length > 0) {
          // $orderList.empty();
          var strA = '';
          var strB = '';
          var data = res.result.items;
          if (orderQueryType === 'WAIT_PAYMENT') {
            for (var i = 0; i < data.length; i++) {
              var item = data[i];
              str += '<div class="box" id="' + item.orderNo + '">' +
                '  <a href="./order-details.html?orderNo=' + item.orderNo + '&flag=WAIT_PAYMENT" class="content">' +
                '<div class="title current">' +
                '  <span>' + item.roomTitle + '</span><span class="weight">¥' + item.totalPrice + '</span>' +
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
                '<div class="box" id="' + item.orderNo + '">' +
                '  <a href="./order-details.html?orderNo=' + item.orderNo + '&flag=VALIDATED" class="content">' +
                '    <div class="title">' +
                '      <span class="ellips">' + item.roomTitle + '</span>' +
                '      <span class="weight">¥' + item.totalPrice + '</span>' +
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
                '<div class="box" id="' + item.orderNo + '">' +
                '  <a href="./order-details.html?orderNo=' + item.orderNo + '" class="content">' +
                '    <div class="title">' +
                '      <span>' + item.roomTitle + '</span>' +
                '      <span class="weight">¥' + item.totalPrice + '</span>' +
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
          $orderList.append(str);

        } else {
          // toast.show(res.message);
        }
        dropload.resetload(recordCount, params.currentPage, res.result && res.result.pageCount || 1);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
        $orderList.empty();
        dropload.resetload(-1);
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
          toast.show('取消成功');
          // orderList();
          var orderNo = params.orderNo
          $('#' + orderNo).remove();
          if ($('.article-body .list .box').length === 0) {
            var str =
              '<div class="dropload-down">' +
              '  <div class="noOrder-body">' +
              '    <div class="img">' +
              '    </div>' +
              '    <p class="txt">~空空如也~</p>' +
              '  </div>' +
              '</div>';
            $('.article-body').append(str);
          }
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
  // loadingMore({ isReload: true })
  //$('.order-sort-body')
  $orderSort.on('tap', '.items', function (e) {
    $orderSort.find('.txt').removeClass('current');
    $(this).find('.txt').addClass('current');
    $orderSort.find('.line').removeClass('current');
    $(this).find('.line').addClass('current');
    $orderList.empty();

    orderQueryType = $(this).data('orderQueryType');
    // orderList();
    loadingMore({ isReload: true });
    $('#orderList').on('tap', function (e) {
      e.stopPropagation();
      e.preventDefault();
      $('.navigate-body').translate({
        duration: 0.3,
        value: '100%',
        callback: function () {
          $('#overlay').hide();
        }
      });
    });
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



