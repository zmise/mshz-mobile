require('./index.scss');
// require('../../assets/js/plugins.js');

require('../../assets/js/toast.js');  //toast的事件


$(function () {

  //发送密码&手机号登录post接口
  function password(params) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/openapi/user/login/password',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          //sessionStorage缓存个人信息
          var item = res.result;
          if (item && item !== '') {
            window.sessionStorage.setItem('loginInfo', JSON.stringify(item));
          }
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

  // 点击items的文本框改变样式
  $('.input-list .items').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).addClass('currentborder').siblings().removeClass('currentborder');
  });


  // 点击到登录成功跳转到login
  $('#index-entry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    // 验证手机格式  
    var telReg = /^1[3|4|5|7|8][0-9]{9}$/; //验证手机正则
    var telVal = $.trim($('#tel').val()).replace(/\s/g, '');
    var pswVal = $.trim($('#psw').val()).replace(/\s/g, '');

    if (!telReg.test(telVal)) {
      showMessage('请输入正确的手机号');
      return;
    } else if (pswVal.length > 12 || pswVal.length < 6) {
      showMessage('请输入6-12位密码');
      return;
    } else {
      var listParams = {
        password: pswVal,
        phone: telVal,
      };
      password(listParams);
    }
  });


  // 点击到手机登录页面login
  $('#login-entry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.location = './login.html';
  });


  // 点击到忘记密码页面forgot-password
  $('#forgotPsw-entry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.location = './forgot-password.html';
  });
  // 点击返回回到上一页
  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
