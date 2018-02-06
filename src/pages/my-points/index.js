require('../../common/session');
require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/appDownload.js');//全局下载APP
$(function () {

  //queryUserPointsRecord get接口
  $.ajax({
    url: '/mshz-app/security/user/queryUserPointsRecord',
    dataType: 'json',
    type: 'GET',
    cache: false,
    success: function (res) {
      if (res.status === 'C0000') {
        console.log(res);
        var item = res.result.items;
        var str = '';
        var score = 0;
        for (var i = 0; i < item.length; i++) {
          str +=
            '<div class="items">' +
            '  <div class="txt">' +
            '    <span class="theme">' + item[i].title + '</span>' +
            '    <span class="time">' + item[i].usage + ' ' + item[i].createTimeDesc
            + '</span>' +
            '  </div>' +
            '  <span class="score">+' + item[i].points + '</span>' +
            '</div>'
            ;
          score += parseInt(item[i].points);
        }
        $('#list').append(str);
        $('#score').text(score);
      }
    },
    error: function (error) {
      console.log(error);
      console.log('error');
    }
  });
  // 
  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});




