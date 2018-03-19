require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
var toast = require('../../assets/js/toast.js');  //toast的事件
require('../../assets/js/zoomify.js'); // 查看大图


$(function () {

  // 回复评价post接口
  function replyComment(params) {
    console.log(params);
    $.ajax({
      url: '/mshz-app/security/order/comment/reply',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        console.log(res);

        if (res.status === 'C0000') {
          console.log(res.result);

          if (res.result) {
            console.log(res.result);
            var content = $("#comment").val();
            var str =
              '<div class="item">' +
              '    <span>' +
              '       <i class="current">楼主</i>' +
              '       <i>回复:</i>' +
              '    </span>' +
              '    <span>' + content + '</span>' +
              '</div>';
            $('.article-body .talk-area').append(str);
            $("#comment").val('');
          }
        } else if (res.status === 'E0002') {
          toast.show(res.message);
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }


  // 我的订单评价列表展示 get接口
  function commentDetail(params) {
    $.ajax({
      url: '/mshz-app/order/comment/queryCommentDetailById',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        console.log(res);
        if (res.status === 'C0000' && res.result) {
          var data = res.result;
          var str =
            '<div class="self-assess">' +
            '<div class="time-score">' +
            '  <span class="time">' + data.commentTimeDesc + '</span>' +
            '  <div class="score">' +
            '    <span>' + data.score.toFixed(1) + '</span>' +
            '      <div class="star-lines"><div class="star-bar-score" style="width:' + (data.score * 1.7 / 5) + 'rem"></div><div class="star-bar"></div></div>' +
            '  </div>    ' +
            '</div>' +
            '<div class="text-img">' +
            '  <span class="txt">' + (data.content.length > 0 ? data.content : '暂无评论') + '</span>';


          // 拼接评论图片
          var imgs = data.commentPicture.split(',');
          if (data.commentPicture.length > 0) {
            str += '<div class="img-list">';
            for (var j = 0; j < imgs.length; j++) {
              str += '<img class="items img-rounded" src="' + imgs[j].replace('{size}', '750x750') + '" />';
            }
            str += '</div>';
          }
          str +=
            '</div> ' +
            '<a class="content" href="/houseDetails?id=' + data.situationId + '">' +
            '  <img src="' + data.mainPic.replace('{size}', '400x300') + '" alt="">' +
            '  <div class="i-txt">' +
            '    <span class="title">' + data.title + '</span>' +
            '    <div class="time">' +
            '      <span>' + data.startTimeDesc + '至' + data.endTimeDesc + '</span>' +
            '      <span>' + data.days + '晚</span>' +
            '    </div>' +
            '    <span class="price">¥' + data.roomRate + '</span>' +
            '  </div>' +
            '</a>' +
            '</div>';

          // '      <i class="current">楼主：</i>' +
          var item = data.replyList;

          str +=
            '<div class="talk-area">' +
            '  <div class="oneline">' +
            '    <i class="icon iconfont icon-duihua"></i>' +
            '    <span>' + item.length + '</span>' +
            '  </div>';
          if (item.length > 0) {
            for (var i = 0; i < item.length; i++) {

              if (item[i].replyPersonType === 'MANAGER') {
                str +=
                  '  <div class="item reply-comment">' +
                  '    <span>' +
                  '      <i class="current">管家</i>' +
                  '<i>回复:</i>' +
                  '    </span>' +
                  '    <span class="comment-id" data-comment-id="' + item[i].commentId + '">' + item[i].replyContent + '</span>' +
                  '  </div>'
                  ;
              } else {
                str +=
                  '  <div class="item">' +
                  '    <span>' +
                  '      <i class="current">楼主</i>' +
                  '<i>回复:</i>' +
                  '    </span>' +
                  '    <span>' + item[i].replyContent + '</span>' +
                  '  </div>';
              }
            }
          }
          str += '</div>';

          $('.article-body').empty().append(str);
          $('.img-list img').zoomify();

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

  var id = getUrlParam('id');
  var params = {
    id: id,
  }

  if (id && id !== '') {
    // 关闭loading
    // $('#loading').remove();
    commentDetail(params);
  } else {
    location.replace('error.html?code=E0001')
  }

  // //点击进入房源详情houseDetails
  // $('.article-body').on('tap', '.houseDetail-entry', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   var id = getUrlParam('id');
  //   if (id && id !== '') {
  //     window.location = '/houseDetails?id=' + id;

  //   }
  // });
  // 查看评价post接口
  $.ajax({
    url: '/mshz-app/security/order/comment/seeComment',
    data: JSON.stringify(params),
    dataType: 'json',
    contentType: 'application/json;charset=UTF-8',
    type: 'POST',
    cache: false,
    success: function (res) {
      console.log(res);
      if (res.status === 'C0000') {
        console.log(res.result);
      }
    },
    error: function (error) {
      console.log(error);
      console.log('error');
    }
  });

  // 回复的交互效果
  $('.article-body').on('tap', '.reply-comment', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#commentBox").css('display', 'flex');
    $("#comment").focus();
    $("#commentId").val($(this).find('.comment-id').data('commentId'));

  });

  // 点击确认回复  发送ajax
  $('#replay-comment').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();

    if (!$("#comment").val() == '') {
      var paramsList = {
        commentId: $("#commentId").val(),
        replyContent: $("#comment").val(),
      };
      replyComment(paramsList);
    }


    $("#commentBox").hide();
    $("#comment").blur();

  });
  // body滚动隐藏commentBox
  $(window).scroll(function (e) {
    // $("#commentBox").hide();
    // $("#comment").blur();
  });
  $('body').on('click', function (e) {
    e.stopPropagation();
    // e.preventDefault();
    $("#commentBox").hide();
    $("#comment").blur();
  })
  // 回复的交互效果

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });

  // 查看大图阻止冒泡
  $('.article-body').on('tap', '.zoomify', function (e) {
    e.stopPropagation();
  });
});



