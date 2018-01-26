require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/appDownload.js');//全局下载APP


$(function () {

  //用户个人中心所需数据get接口
  function queryPersonalCenter() {
    $.ajax({
      url: '/mshz-app/security/user/queryPersonalCenter',
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          console.log(res.result);
          var item = res.result;
          var str =
            '<section class="personal-info">' +
            '  <div class="flex-box">' +
            '    <img class="photo" href="' + item.headPortrait.replace('{size}', '137x137') + '"/>' +
            '    <div class="name-time">' +
            '      <span>' + item.nickname + '</span>' +
            '      <div class="tel">' +
            '        <i class="icon iconfont icon-shouji"></i>' +
            '        <span>' + item.phone + '</span>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '  <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '</section>' +
            '<section class="other-info">' +
            '  <div class="items">' +
            '    <span class="number ">' + item.collectRoomCount + '</span>' +
            '    <span class="txt">收藏房源</span>' +
            '  </div>' +
            '  <div class="items" id="myInegral-entry">' +
            '    <span class="number">' + item.integral + '</span>' +
            '    <span class="txt">我的积分</span>' +
            '  </div>' +
            '  <div class="items" id="assessList-entry">' +
            '    <span class="number">' + item.appraiseCount + '</span>' +
            '    <span class="txt">我的评价</span>' +
            '  </div>' +
            '</section>'
            ;
          $('#article-body').prepend(str);

          str =
            '<div class="slider">';

          var picList = item.waitInRoomOrders;
          if (picList > 0) {
            for (var i = 0; i < picList.length; i++) {
              str +=
                '  <div class="items">' +
                '    <div class="tlt">' +
                '      <span class="txt">' + picList.address + '</span>' +
                '      <span class="txt current">' + picList.id + '</span>' +
                '    </div>' +
                '    <div class="time">' +
                '      <span class="txt">' + picList.inRoomStartTime + '至' + picList.inRoomEndTime + '</span>' +
                '      <span class="txt">' + picList.days + '晚</span>' +
                '    </div>' +
                '  </div>';
            }
          } else {
            str += '';
          }



          str +=
            '  </div>' +
            '</div>';
          $('#article-body .order-info').append(str);

        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  queryPersonalCenter();
  //点击进入个人中心
  $('.article-body').on('tap', '#myInegral-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './myIntegral.html';
  });
  //点击进入订单列表
  $('.article-body').on('tap', '#orderList-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './order-list.html';

  });

  //点击进入成为房东页面
  $('.article-body').on('tap', '#landlord-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './tobelandlord.html';
  });
  //点击进入成为房东页面
  $('.article-body').on('tap', '#landlord-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './tobelandlord.html';
  });

  //点击进入评价列表
  $('.article-body').on('tap', '#assessList-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './assess-list.html';
  });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
