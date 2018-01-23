require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');

// require('../../assets/js/appDownload.js');//全局下载APP



$(function () {

  // 我的订单评价列表展示 get接口
  function myOrderComment(params) {
    $.ajax({
      url: '/mshz-app/security/order/comment/myOrderComment',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        console.log(res);
        if (res.status === 'C0000') {
          var data = res.result.items;
          var str = '';
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            str +=
              '<div class="all-assess">' +
              '<span class="time">' + item.commentTime + '</span>' +
              '<div class="text-img">' +
              '  <span class="txt">' + item.content + '</span>';

            // 拼接评论图片
            var imgs = item.commentPicture.split(',');
            if (item.commentPicture.length > 0) {
              str += '<div class="img-list">';
              for (var j = 0; j < imgs.length; j++) {
                str += '<img class="items" src="' + imgs[j].replace('{size}', '144x144') + '" />';
              }
              str += '</div>';
            }

            str += '</div>' +
              '<div class="content">' +
              '  <img src="' + item.mainPic + '" alt="">' +
              '  <div class="i-txt">' +
              '    <span class="title">' + item.title + '</span>' +
              '    <div class="time">' +
              '      <span>' + item.startTime + '至' + item.endTime + '</span>' +
              '      <span>' + item.days + '晚</span>' +
              '    </div>' +
              '    <span class="price">¥' + item.roomRate + '</span>';
            if (!item.content.length) {
              str += '    <div class="bnt">' +
                '      <a class="box" id="myAssess-entry">评价订单</a>' +
                '    </div>';
            }

            str += '  </div>' +
              '</div>' +
              '</div>';
          }
          $('.article-body').empty().append(str);

        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }


  //点击全部评价和待评价之间的切换
  $('.order-body').on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('current').siblings().removeClass('current');
    var params = {
      commentStatus: $(this).data('commentStatus')
    };
    myOrderComment(params);
  });

  //点击进入评价列表
  $('.article-body').on('tap', '#myAssess-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './myAssess.html';
  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
