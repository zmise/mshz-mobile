require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/js/appDownload.js');//全局下载APP


/* 切换订单分类栏的事件 */
$(function () {
  var $orderSort = $('.order-sort-body');
  $orderSort.on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $orderSort.find('.txt').removeClass('current');
    $(this).find('.txt').addClass('current');
    $orderSort.find('.line').removeClass('current');
    $(this).find('.line').addClass('current');

    // ajax请求数据 刷新article-body盒子的内容
    orderList();

    /* get请求  订单列表数据 */
    function orderList() {
      $('.article-body').empty();
      console.log('132');
      $.ajax({
        url: 'http://192.168.0.243:51312/mshz-app/room/queryRoom',
        // data: params,
        dataType: 'json',
        type: 'GET',
        cache: false,
        success: function (data) {
          console.log(data);
          if (data.status === 'C0000') {
            if (data.result && data.result.items) {
              var json = data.result.items;
              var str = '';
              for (var i = 0; i < json.length; i++) {
                str += '';
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

  });
});



