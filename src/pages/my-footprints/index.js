require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');

require('../../assets/js/appDownload.js');//全局下载APP

$(function () {


  // 查询用户浏览记录post接口
  function queryUserRoomHistory(params) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/security/user/queryUserRoomHistory',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          var array = res.result || [];
          var str = '';
          for (var i = 0; i < array.length; i++) {
            var item = array[i];

            str +=
              '<div class="listItems">' +
              '  <a href="/houseDetails?id=' + item.id + '">' +
              '    <div class="index-list">' +
              '      <img src="' + item.mainPicture.replace('{size}', '680x384') + '" alt="">' +
              '        <div class="item-oneline">' +
              '          <p>' + item.title + '</p>' +
              '          <p>￥' + item.price + '</p>' +
              '        </div>' +
              '        <div class="item-twoline">' +
              '          <i class="twoline-items" href="javascript:;">' + item.cityName + '</i>' +
              '          <i class="twoline-items" href="javascript:;">' + item.houseType + '</i>' +
              '          <i class="twoline-items" href="javascript:;">' + item.customerCount + '人</i>' +
              '        </div>' +
              '        <div class="item-threeline">' +
              '          <div class="three-lline">' +
              '            <div class="star-lines"></div>' +
              '            <i class="score">' + item.rateServer + '分</i>' +
              '          </div>' +
              '          <div class="three-rline">' +
              '            <i class="twoline-items" href="javascript:;">' + item.area + '住过</i>' +
              '            <i class="twoline-items" href="javascript:;">' + item.commentCount + '条评价</i>' +
              '          </div>' +
              '        </div>' +
              '      </div>' +
              '    </a>' +
              '</div>'
              ;
          }
          $('.article-body').append(str);
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }

  var guessLikeArray = [];
  if (typeof window.localStorage.getItem('guessLike') === 'string') {
    guessLikeArray = JSON.parse(window.localStorage.getItem('guessLike')) || [];
    var ids = [];
    for (var i = 0; i < guessLikeArray.length; i++) {
      ids.push(guessLikeArray[i].situationId);
    }

    var params = {
      ids: ids,
    }
    queryUserRoomHistory(params);
  }




  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});


