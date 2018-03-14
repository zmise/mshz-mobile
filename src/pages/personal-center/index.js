require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');

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
            '<a class="personal-info" href="./personal-info.html#">' +
            '  <div class="flex-box">';
          if (item.headPortrait.length) {
            str += '  <img class="photo" src="' + item.headPortrait.replace('{size}', '137x137') + '" alt="">';
          } else {
            str += '  <img class="photo" src="' + require('./img/headPortrait.png') + '"/>';
          }
          str +=
            '    <div class="name-time">' +
            '      <span>' + item.nickname + '</span>' +
            '      <div class="tel">' +
            '        <i class="icon iconfont icon-shouji"></i>' +
            '        <span>' + item.phone + '</span>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '  <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '</a>' +
            '<section class="other-info">' +
            '  <a class="items" href="./my-collections.html">' +
            '    <span class="number">' + item.collectRoomCount + '</span>' +
            '    <span class="txt">收藏房源</span>' +
            '  </a>' +
            '  <a class="items" href="./my-points.html" id="myInegral-entry">' +
            '    <span class="number">' + item.integral + '</span>' +
            '    <span class="txt">我的积分</span>' +
            '  </a>' +
            '  <a class="items" href="./comment-list.html" id="assessList-entry">' +
            '    <span class="number">' + item.appraiseCount + '</span>' +
            '    <span class="txt">我的评价</span>' +
            '  </a>' +
            '</section>'
            ;
          $('#articleBody').prepend(str);

          str =
            '<div class="slider">';

          var picList = item.waitInRoomOrders;
          if (picList.length > 0) {
            for (var i = 0; i < picList.length && i < 2; i++) {
              str +=
                '  <a class="items" href="./order-details.html?orderNo=' + picList[i].id + '">' +
                '    <div class="tlt">' +
                '      <span class="txt ellips">' + picList[i].title + '</span>' +
                '      <span class="txt current">已预订</span>' +
                '    </div>' +
                '    <div class="time">' +
                '      <span class="txt">' + picList[i].inRoomStartTimeDesc + '至' + picList[i].inRoomEndTimeDesc + '</span>' +
                '      <span class="txt">' + picList[i].days + '晚</span>' +
                '    </div>' +
                '  </a>';
            }
          } else {
            str +=
              '<div class="noOrder-body">' +
              '<div class="img"></div>' +
              '<p class="txt">~空空如也~</p>' +
              ' </div>'
              ;
          }
          str +=
            '  </div>' +
            '</div>';
          $('#articleBody .order-info').append(str);
          $('#articleBody').css('visibility', 'visible');

        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  queryPersonalCenter();
  // //点击进入我的积分
  // $('.articleBody').on('tap', '#myInegral-entry', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   window.location = './myIntegral.html';
  // });
  // //点击进入订单列表
  // $('.articleBody').on('tap', '#orderList-entry', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   window.location = './order-list.html';

  // });

  // //点击进入成为房东页面
  // $('.articleBody').on('tap', '#landlord-entry', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   window.location = './tobelandlord.html';
  // });
  // //点击进入成为房东页面
  // $('.articleBody').on('tap', '#landlord-entry', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   window.location = './tobelandlord.html';
  // });

  // //点击进入评价列表
  // $('.articleBody').on('tap', '#assessList-entry', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   window.location = './assess-list.html';
  // });

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
