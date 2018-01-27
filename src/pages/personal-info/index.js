require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/vendors/iconfont/iconfont.js'); //有色图标
require('../../assets/js/appDownload.js');//全局下载APP



$(function () {

  //用户个人中心所需数据get接口
  function queryInfo() {
    $.ajax({
      url: '/mshz-app/security/user/info/query',
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          console.log(res.result);
          var item = res.result;
          var sex = 'nan';
          if (item.sex === 'MALE') {
            sex = 'nv';
          }
          var str =
            '<section class="personal-info">' +
            '  <div class="items">' +
            '    <span class="title">头像</span>' +
            '    <div class="content">' +
            '      <img class="pic" src="' + item.headPortrait.replace('{size}', '88x88') + '" alt="" />' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '  <div class="items">' +
            '    <span class="title">用户名</span>' +
            '    <div class="content">' +
            '      <span>' + item.nickname + '</span>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '  <div class="items">' +
            '    <span class="title">注册手机号</span>' +
            '    <div class="content">' +
            '      <span>' + item.phone + '</span>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '  <div class="items">' +
            '    <span class="title">性别</span>' +
            '    <div class="content">' +
            '      <svg class="sex" aria-hidden="true">' +
            '        <use xlink: href="#icon-' + sex + '"></use>' +
            '      </svg>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '  <div class="items">' +
            '    <span class="title">真实姓名</span>' +
            '    <div class="content">' +
            '      <span>' + item.realName + '</span>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '  </div>' +
            '  </div>' +
            '  <div class="items">' +
            '    <span class="title">身份证号</span>' +
            '    <div class="content">' +
            '      <span>' + item.identityCard + '</span>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '</section >'
            ;
          $('.article-body').append(str);
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  queryInfo();
  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
