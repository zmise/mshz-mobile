require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/toast.js');  //toast的事件


$(function () {

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
        if (res.status === 'C0000' && res.result !== '' && res.result) {
          var data = res.result;
          var str =
            '<div class="self-assess">' +
            '<div class="time-score">' +
            '  <span class="time">' + data.commentTime + '</span>' +
            '  <div class="score">' +
            '    <span>' + data.score + '</span>' +
            '    <div class="start-line"></div>' +
            '  </div>    ' +
            '</div>' +
            '<div class="text-img">' +
            '  <span class="txt">' + data.content + '</span>';

          // <div class="img-list">

          //   <img class="items " src=""></img>

          // </div>

          str +=
            '</div> ' +
            '<div class="content houseDetail-entry">' +
            '  <img src="' + data.mainPic.replace('{size}', '400x300') + '" alt="">' +
            '  <div class="i-txt">' +
            '    <span class="title">' + data.title + '</span>' +
            '    <div class="time">' +
            '      <span>' + data.startTime + '至' + data.endTime + '</span>' +
            '      <span>' + data.days + '晚</span>' +
            '    </div>' +
            '    <span class="price">¥' + data.roomRate + '</span>' +
            '  </div>' +
            '</div>' +
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
              str += '  <div class="item">' +
                '    <span>';
              if (item[i].replyPersonType === 'MANAGER') {
                str +=
                  '      <i class="current">管家</i>' +
                  '<i>回复:</i>' +
                  '    </span>' +
                  '    <span class="reply-comment" data-comment-id="' + item[i].commentId + '">' + item[i].replyContent + '</span>' +
                  '  </div>'
                  ;
              } else {
                str += '      <i class="current">楼主</i>' +
                  '<i>回复:</i>' +
                  '    </span>' +
                  '    <span>' + item[i].replyContent + '</span>' +
                  '  </div>';
              }

              // str += 
            }


          }
          str += '</div>';

          $('.article-body').empty().append(str);

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


  //点击进入房源详情houseDetails
  $('.article-body').on('tap', '.houseDetail-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var id = getUrlParam('id');
    if (id && id !== '') {
      window.location = '/houseDetails?id=' + id;

    }
  });

  // 回复的交互效果
  $('.article-body').on('tap', '.reply-comment', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#commentBox").css('display', 'flex');
    $("#comment").focus();
    $("#commentId").val($(this).data('commentId'));

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
    $("#commentBox").hide();
    $("#comment").blur();
  });
  // 回复的交互效果

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});



