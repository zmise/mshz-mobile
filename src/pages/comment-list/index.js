require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/zoomify.js'); // 查看大图

// require('../../assets/js/appDownload.js');//全局下载APP


//  返回后页面不刷新的问题
window.onpageshow = function (event) {
  if (event.persisted) {
    location.reload();
  }
};

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
          if (params.commentStatus === '') {
            $('#allList').text('已评价（' + index + '）');
          }
          var str = '';
          if (index > 0) {
            for (var i = 0; i < index; i++) {
              var item = data[i];
              if (params.commentStatus !== 'NOT_COMMENT') {
                str +=
                  '<a class="all-assess myassess-entry" href="./my-comments.html?id=' + item.id + '" data-id="' + item.id + '">';
                if (item.hasNew) {
                  str += '<div class="small-circle"></div>';
                }
                str +=
                  '<span class="time">' + item.commentTimeDesc + '</span>' +
                  '<div class="text-img">' +
                  '  <span class="txt">' + (item.content.length > 0 ? item.content : (item.commentPicture.length > 0 ? '' : '暂无评论')) + '</span>';
              } else {
                str +=
                  '<a class="all-assess myassess-entry" href="javascript:;">';
              }

              // 拼接评论图片
              var imgs = item.commentPicture.split(',');
              if (item.commentPicture.length > 0) {
                str += '<div class="img-list">';
                for (var j = 0; j < imgs.length; j++) {
                  str += '<div class="img">' +
                    '<img class="items img-rounded" src="' + imgs[j].replace('{size}', '750x750') + '" />' +
                    '</div>';
                }
                str += '</div>';
              }

              str += '</div>' +
                '<div class="content house-details" data-id="' + item.situationId + '" href="/houseDetails?id=' + item.situationId + '">' +
                '<div class="img">' +
                '  <img src="' + item.mainPic.replace('{size}', '400x300') + '" alt="">' +
                '</div>' +
                '  <div class="i-txt">' +
                '    <span class="title">' + item.title + '</span>' +
                '    <div class="time">' +
                '      <span>' + item.startTimeDesc + '至' + item.endTimeDesc + '</span>' +
                '      <span>' + item.days + '晚</span>' +
                '    </div>' +
                '    <span class="price">¥' + item.roomRate + '</span>';
              if (!item.score && !item.content.length && !item.commentPicture.length) {
                str +=
                  '    <div class="bnt">' +
                  '  <div class="bigger assess-entry" data-room-id="' + item.roomId + '" data-order-no="' + item.orderNo + '">' +

                  '<div class="box">评价订单</div>' +
                  '    </div>' +
                  '    </div>';
              }

              str += '  </div>' +
                '</div>' +
                '</a>';
            }
          } else {
            str +=
              '<section class="unusual-body">' +
              '  <div class="no-comment-order"></div>' +
              '  <span>暂无评价订单</span>' +
              '</section>'
              ;
          }

          $('#articleBody').empty().append(str);
          $('.img-list img').zoomify();

        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  // 未评价订单数量查询 get接口
  function uncommittedCount() {
    $.ajax({
      url: '/mshz-app/security/order/comment/uncommittedCount',
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        console.log(res);
        if (res.status === 'C0000') {
          $('#unComment').text(res.result);
        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }
  var params = {
    commentStatus: ''
  }
  myOrderComment(params);
  uncommittedCount();
  //点击全部评价和待评价之间的切换
  $('.order-body').on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('current').siblings().removeClass('current');
    var params = {
      commentStatus: $(this).data('commentStatus')
    };
    $('#articleBody').empty();
    myOrderComment(params);
  });

  // 点击myassess - entry
  $('#articleBody').on('tap', '.myassess-entry', function (e) {
    e.stopPropagation();
    $(this).find('.small-circle').remove();
  });

  //点击进入评论详情house-details
  $('#articleBody').on('tap', '.house-details', function (e) {
    e.stopPropagation();
    e.preventDefault();

    var id = $(this).data('id');
    if (id && id !== '') {
      window.location = '/houseDetails?id=' + id;

    }
  });
  //点击进入评价订单assess-order
  $('#articleBody').on('tap', '.assess-entry', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var roomId = $(this).data('room-id');
    var orderNo = $(this).data('order-no');
    if (roomId && roomId !== '' && orderNo && orderNo !== '') {
      window.location = './comment-order.html?roomId=' + roomId + '&orderNo=' + orderNo;
    }
  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });

  // 阻止冒泡
  $('#articleBody').on('tap', '.zoomify', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

});
