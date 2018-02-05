require('../../common/session');
require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');

require('../../assets/js/appDownload.js');//全局下载APP

$(function () {


  // 查询用户收藏房源get接口
  function queryUserCollectRoom(params) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/security/userinfo/queryUserCollectRoom',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          var array = res.result;
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
              '          <i class="twoline-items">' + item.region + '</i>' +
              '          <i class="twoline-items">' + item.houseType + '</i>' +
              '          <i class="twoline-items">' + item.customerCount + '人</i>' +
              '        </div>' +
              '        <div class="item-threeline">' +
              '    <div class="three-lline">' +
              '      <div class="star-lines"><div class="star-bar-score" style="width:' + (item.rate * 1.7 / 5) + 'rem"></div><div class="star-bar"></div></div>' +
              '      <i class="score">' + item.rate.toFixed(1) + '分</i>' +
              '    </div>' +
              '          <div class="three-rline">' +
              '            <i class="twoline-items">' + item.livedCount + '人住过</i>' +
              '            <i class="twoline-items">' + item.commentCount + '条评价</i>' +
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
  var params = {
    currentPage: 1,
    pageSize: 20,
  }
  queryUserCollectRoom(params);


  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});


