require('./index.scss');
// require('../../assets/js/plugins.js');

require('../../assets/js/toast.js');  //toast的事件


$(function () {

  //设置密码post接口
  function modPassword(params) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/security/user/modPassword',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          window.location = '/';
        } else {
          showMessage(res.message);
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  // 初始化的弹出的toast框
  function showMessage(content, duration, isCenter, animateIn, animateOut) {
    var animateIn = animateIn || 'fadeIn';
    var animateOut = animateOut || 'fadeOut';
    var content = content || '这是一个提示信息';
    var duration = duration || '3000';
    var isCenter = isCenter || false;
    $('body').toast({
      position: 'fixed',
      animateIn: animateIn,
      animateOut: animateOut,
      content: content,
      duration: duration,
      isCenter: isCenter,
      padding: '0.1rem 0.27rem',
      background: 'rgba(181, 185, 190, 0.8)',
      borderRadius: '.31rem',
      fontSize: '.24rem',
      top: "80%",        //bottom底部的位置    具体的数值 或者center  垂直居中
    });
  }
  // showMessage('zmise', 100000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');

  // 点击toggleStyle字体图标改变样式和 input的type属性
  $('#toggleStyle').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    if ($('.icon-yanjingbukejian').length !== 0) {
      $(this).removeClass('icon-yanjingbukejian').addClass('icon-yanjingkejian');
      $('#psw').attr('type', 'text');
    } else {
      $(this).removeClass('icon-yanjingkejian').addClass('icon-yanjingbukejian');
      $('#psw').attr('type', 'password');
    }
  });

  // 点击到完成并登录成功跳转到index
  $('#index-entry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.location = '/index.html';
  });

  // 点击到完成并登录成功跳转到login
  $('#index-entry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var pswVal = $.trim($('#psw').val()).replace(/\s/g, '');

    if (pswVal.length > 12 || pswVal.length < 6) {
      showMessage('请输入6-12位密码');
      return;
    } else {
      var listParams = {
        newPassword: pswVal,
        passwordStatus: 'NOT_SET',
      };
      modPassword(listParams);
    }
  });

  // 点击到完成并登录成功跳转到login
  $('#passing').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.location = '/';
  });

  // 点击返回回到上一页
  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});