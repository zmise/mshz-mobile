require('./index.scss');
require('../../assets/js/analytics.js');

var toast = require('../../assets/js/toast.js');  //toast的事件
require('../../assets/js/record'); //判断无痕模式


$(function () {
  window.sessionStorage.removeItem('loginInfo');

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

          var lastLocation = window.sessionStorage.getItem('lastLocation');
          if (lastLocation) {
            window.sessionStorage.removeItem('lastLocation');
            location.replace(lastLocation);
          } else {
            location.replace('/');
          }
        } else {
          toast.show(res.message);
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

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
    var pswReg = /[\u4e00-\u9fa5_\s]/g;; //验证密码正则

    var telVal = $.trim($('#tel').val()).replace(/\s/g, '');
    var pswVal = $('#psw').val();

    if (!telReg.test(telVal)) {
      toast.show('请输入正确的手机号');
      return;
    } else if (pswVal.length > 12 || pswVal.length < 6) {
      toast.show('请输入6-12位密码');
      return;
    } else if (pswReg.test(pswVal)) {
      toast.show('禁止输入中文和空格');
      $('#psw').val('');
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
    location.replace('./login.html');
  });


  // 点击到忘记密码页面forgot-password
  $('#forgotPsw-entry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    location.replace('./forgot-password.html');
  });
  // 点击返回回到上一页
  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
