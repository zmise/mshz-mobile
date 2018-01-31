require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/appDownload.js');//全局下载APP

$(function () {

  // 房源评价相关数据get接口
  function queryRoomComment(params) {
    $.ajax({
      url: '/mshz-app/order/comment/queryRoomComment',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          //todo
          console.log(res);
          var data = res.result;
          var str = '';
          str =
            '<div class="total">' +
            '  <div class="line-two">' +
            '    <div class="flex-box">' +
            '      <i class="clc-red txt socre">' + data.rate + '分</i>' +
            '      <div class="star-lines"></div>' +
            '    </div>' +
            '    <div>' +
            '      <i class="clc-red txt" href="javascript:;">环境：' + data.rateEnv + '</i>' +
            '      <i class="clc-red txt" href="javascript:;">服务：' + data.rateServer + '</i>' +
            '    </div>' +
            '  </div>' +
            '</div>';
          var array = data.comment.items || [];
          for (var i = 0; i < array.length; i++) {
            str +=
              '<div class="comment-body">' +
              '  <div class="first-comment">' +
              '    <div class="info">' +
              '      <div class="flex-box">' +
              '        <img class="photo" src="' + array[i].headPortrait.replace('{size}', '88x88') + '"/>' +
              '        <div class="name-time">' +
              '          <span>' + array[i].nickName + '</span>' +
              '          <span>' + array[i].commentTimeDesc + '</span>' +
              '        </div>' +
              '      </div>' +
              '      <span class="socre">' + array[i].score + '分</span>' +
              '    </div>' +
              '    <div class="des">' +
              '      <p class="des-cnt">' + array[i].content + '</p>';

            if (array[i].commentPicture !== '') {
              str += '      <div class="img-list">';
              var comPicArray = array[i].commentPicture.split(',');
              for (var k = 0; k < comPicArray.length; k++) {
                str +=
                  '        <img class="items " src="' + comPicArray[k].replace('{size}', '144x144') + '"/>';
              }
              str += '      </div>';
            }

            var list = array[i].replyList;
            if (list.length > 0) {
              str += '      <div class="des-duihua">'
              for (var j = 0; j < list.length; j++) {
                str +=
                  '        <div class="items">' +
                  '          <span>';

                if (list[i].replyPersonType === 'MANAGER') {
                  str += '            <i class="current">管家</i>回复：' + list[i].replyContent + '</span>';

                } else {
                  str += '            <i class="current">' + list[i].replyName + '</i>回复：' + list[i].replyContent + '</span>';
                }

                str += '        </div>';
              }
              str += '      </div>';
            }
            str +=
              '    </div>' +
              '  </div>' +
              '</div>';

          }

          $('#articleBody').append(str);
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

  var roomId = getUrlParam('roomId') || 'cdbfd42e-d6fc-4d43-8254-dc594f0fd181';

  if (!roomId) {
    location.replace('error.html?code=E0001')
  } else {
    // 关闭loading
    $('#loading').remove();
    $('#roomId').val(roomId);
    var params = {
      roomId: roomId,
    }
    queryRoomComment(params)
  }




  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});