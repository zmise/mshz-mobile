require('../../common/session');
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
          var index = data.length;
          var str = '';
          for (var i = 0; i < index; i++) {
            var item = data[i];
            str +=
              '<div class="all-assess myassess-entry" data-id="' + item.id + '">' +
              '<span class="time">' + item.commentTimeDesc + '</span>' +
              '<div class="text-img">' +
              '  <span class="txt">' + (item.content.lenght > 0 ? item.content : '暂无评论') + '</span>';

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
              '<a class="content" href="/houseDetails?id=' + item.situationId + '">' +
              '  <img src="' + item.mainPic.replace('{size}', '400x300') + '" alt="">' +
              '  <div class="i-txt">' +
              '    <span class="title">' + item.title + '</span>' +
              '    <div class="time">' +
              '      <span>' + item.startTimeDesc + '至' + item.endTimeDesc + '</span>' +
              '      <span>' + item.days + '晚</span>' +
              '    </div>' +
              '    <span class="price">¥' + item.roomRate + '</span>';
            if (!item.content.length) {
              str += '    <div class="bnt">' +
                '<div class="box assess-entry" data-id="' + item.id + '">评价订单</div>' +
                '    </div>';
            }

            str += '  </div>' +
              '</a>' +
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

  myOrderComment();
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

  //点击进入评论详情myassess-entry
  $('.article-body').on('tap', '.myassess-entry', function (e) {
    e.stopPropagation();
    var id = $(this).data('id');
    if (id && id !== '') {
      window.location = './my-comments.html?id=' + id;

    }
  });

  //点击进入评价订单assess-order
  $('.article-body').on('tap', '.assess-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var id = $(this).data('id');
    if (id && id !== '') {
      window.location = './comment-order.html?id=' + id;

    }
  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
