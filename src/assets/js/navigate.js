$(function () {
  var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
  if (loginInfo) {
    // console.log(loginInfo);
    var str =
      '<nav class="navigate-body" js-plugin="slide" data-direction="vertical">' +
      ' <div class="navigate">' +
      '   <div class="login" href="javascript:;">' +
      '     <img class="photo" src="' + loginInfo.headPortrait.replace('{size}', '120x120') + '" alt="">' +
      '     <span class="txt">' + loginInfo.nickname + '</span>' +
      '     <div class="tel">' +
      '       <i class="icon iconfont icon-shouji"></i>' +
      '       <span class="Ttxt">' + loginInfo.phone + '</span>' +
      '     </div>' +
      '   </div>' +
      '   <div class="content">' +
      '     <a class="items" href="/">' +
      '       <i class="icon iconfont icon-gerenzhongxinshouye"></i>' +
      '       <span class="txt">首页</span>' +
      '     </a>' +
      '     <a class="items" href="/user/personal-center.html">' +
      // '     <a class="items" href="/personal-center.html">' +
      '       <i class="icon iconfont icon-gerenzhongxinwode"></i>' +
      '       <span class="txt">我的</span>' +
      '     </a>' +
      '     <a class="items" href="/user/order-list.html">' +
      // '     <a class="items" href="/order-list.html">' +
      '       <i class="icon iconfont icon-gerenzhongxinwodedingdan"></i>' +
      '       <span class="txt">订单</span>' +
      '       <span class="num">6</span>' +
      '     </a>' +
      '     <a class="items" href="/user/my-collection.html">' +
      // '     <a class="items" href="/my-collection.html">' +
      '       <i class="icon iconfont icon-gerenzhongxinwodeshoucang"></i>' +
      '       <span class="txt">收藏</span>' +
      '     </a>' +
      '     <a class="items" href="/user/my-footprint.html">' +
      '       <i class="icon iconfont icon-zuji"></i>' +
      '       <span class="txt">足迹</span>' +
      '     </a>';

    if (loginInfo.hasSetPassword) {
      str +=
        '     <a class="items" href="/user/change-password.html">' +
        // '     <a class="items" href="/change-password.html">' +
        '       <i class="icon iconfont icon-xiugaimima"></i>' +
        '       <span class="txt">修改密码</span>' +
        '     </a>';
    } else {
      str +=
        '     <a class="items" href="/user/setting-password.html">' +
        // '     <a class="items" href="/setting-password.html">' +
        '       <i class="icon iconfont icon-xiugaimima"></i>' +
        '       <span class="txt">设置密码</span>' +
        '     </a>';
    }


    str += '     <a class="items" href="/" id="outLogin">' +
      '       <i class="icon iconfont icon-gerenzhongxintuichu"></i>' +
      '       <span class="txt">退出登录</span>' +
      '     </a>' +
      '   </div> ' +
      ' </div>' +
      ' <div class="nav-footer">' +
      '   <a class="box">' +
      '     <i class="icon iconfont icon-xiazai"></i>' +
      '     <span class="ftxt">下载APP</span>' +
      '   </a>' +
      '   <a class="box" href="/user/suggestion.html">' +
      // '   <a class="box" href="/suggestion.html">' +
      '     <i class="icon iconfont icon-gerenzhongxinyijianfankui"></i>' +
      '     <span class="ftxt">意见反馈</span>' +
      '   </a>' +
      ' </div>' +
      '</nav>';
    $('body').append(str);
    //样式高亮
    var p = location.pathname;
    if (p === '/') {
      $('.navigate a:first-child').addClass('current').find('.icon').addClass('current');
    } else {
      //[attr*="val" i]选择属性attr的值任意位置包含val或者VAL或者 Val 或者vAl或者 vaL字符
      $('.navigate a[href*="' + p + '" i]').addClass('current').find('.icon').addClass('current');
    }
    // window.jquery = $;
  }
  /* 阻止滚动条事件  */
  $('#overlay,.navigate-body').on('touchmove', function (e) {
    e.preventDefault();
  });

  /* 打开侧边导航栏  */
  $('#menu').on('tap', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#overlay').show();
    $('.navigate-body').translate({
      duration: 0.3,
      value: 0
    });
  });

  /* 关闭侧边导航栏  */
  $('#overlay').on('tap.navigate', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.navigate-body').translate({
      duration: 0.3,
      value: '100%',
      callback: function () {
        $('#overlay').hide();
      }
    });
  });

  /*  点击改变颜色current  */
  $('.navigate .content').on('tap', '.items', function (e) {
    e.stopPropagation();
    $(this).addClass('current').siblings().removeClass('current');
    $(this).find('.icon').addClass('current').end().siblings().find('.icon').removeClass('current');
  });


  /*  点击退出登录  */
  $('body').on('click', '#outLogin', function (e) {
    e.stopPropagation();

    // var path = '/user/order-list.html';
    console.log(123);
    window.sessionStorage.removeItem('loginInfo');
  });

  // /*  点击进入订单列表  */
  // $('#order-list').on('tap', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   // var path = '/user/order-list.html';
  //   var path = './order-list.html';
  //   window.location = path;
  // });

  // /*  点击进入个人中心  */
  // $('#personal-center').on('tap', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   // var path = '/user/personal-center.html';
  //   var path = './personal-center.html';
  //   window.location = path;
  // });
});
