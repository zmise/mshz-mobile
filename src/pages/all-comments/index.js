require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/appDownload.js');//全局下载APP

$(function () {

  // 房源评价相关数据get接口
  function guessLikeInfo(params) {
    $.ajax({
      url: '/mshz-app/order/comment/queryRoomComment',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          //todo
          var data = res.result;
          var str = '';
          str =
            '<div class="total">' +
            '  <div class="line-two">' +
            '    <div class="flex-box">' +
            '      <i class="clc-red txt socre">4.7分</i>' +
            '      <div class="star-lines"></div>' +
            '    </div>' +
            '    <div>' +
            '      <i class="clc-red txt" href="javascript:;">环境：4.7</i>' +
            '      <i class="clc-red txt" href="javascript:;">服务：4.8</i>' +
            '    </div>' +
            '  </div>' +
            '</div>';
          var array = data.items;
          for (var i = 0; i < array.length; i++) {
            str +=
              '<div class="comment-body">' +
              '  <div class="first-comment">' +
              '    <div class="info">' +
              '      <div class="flex-box">' +
              '        <div class="photo"></div>' +
              '        <div class="name-time">' +
              '          <span>云来***9</span>' +
              '          <span>2017-05-08</span>' +
              '        </div>' +
              '      </div>' +
              '      <span class="socre">5.0分</span>' +
              '    </div>' +
              '    <div class="des">' +
              '      <p class="des-cnt">第一交通非常便利，离雍和宫地铁站仅200米，二四合院气氛非常浓，。</p>' +
              '      <div class="img-list">' +
              '        <img class="items " src="./img/feature-garden.jpg"></img>' +
              '        <img class="items"></img>' +
              '        <img class="items"></img>' +
              '        <img class="items"></img>' +
              '      </div>' +
              '      <div class="des-duihua">';

            var list = array[i].replyList;
            for (var j = 0; j < array.length; j++) {

              str +=
                '        <div class="items">' +
                '          <span>' +
                '            <i class="current">管家</i>回复：谢谢你的点评，欢迎下次入sdfdsfdfsdf住。</span>' +
                '        </div>'
                ;
            }

            str +=
              '      </div>' +
              '    </div>' +
              '  </div>' +
              '</div>';

          }


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
  }

  var params = {
    roomId: roomId,
  }


  guessLikeInfo();
  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
