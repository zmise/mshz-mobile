require('./index.scss');
// require('../../assets/js/plugins.js');

require('../../assets/js/toast.js');  //toast的事件


$(function () {

  //发送登录短信验证码get接口
  function sendcheckcode(params) {
    $.ajax({
      url: '/mshz-app/openapi/user/login/sendcheckcode',
      data: {
        phone: params
      },
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          showMessage('发送中，请耐心等待');
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  // 验证码登录的post接口
  function checkcode(params) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/openapi/user/login/checkcode',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          if (res.result.hasSetPassword) {
            window.location = '/';
          } else {
            window.location = './setting-password.html';
          }
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

  //倒计时
  function timer(totalSeconds) {
    var tMin = 60;
    var $sec = $("#seconds");
    var interval = setInterval(function () {
      var tResult = totalSeconds - 1;
      var tResultSec = Math.floor(tResult % tMin);
      // 将时间小于10的,在值前面加入0;   
      if (tResultSec < 10) {
        tResultSec = '0' + tResultSec;
      }
      totalSeconds = totalSeconds - 1;
      //显示到页面上
      $sec.text(tResultSec);

      //清除定时器并执行释放房源的操作和刷新页面
      if (tResult <= 0) {
        clearInterval(interval);
        $('#seconds').closest('.hide').hide().siblings().show();
      }
    }, 1000);

  }
  // showMessage('zmise', 100000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');




  // 点击items的文本框改变样式
  $('.input-list .items').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).addClass('currentborder').siblings().removeClass('currentborder');
  });


  // 点击send-verify的发送验证码
  $('#send-verify').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();


    // 验证手机格式  
    var telReg = /^1[3|4|5|7|8][0-9]{9}$/; //验证手机正则
    var telVal = $.trim($('#tel').val()).replace(/\s/g, '');
    if (!telReg.test(telVal)) {
      showMessage('请输入正确的手机号');
      return;
    } else {
      // console.log('success')
      $(this).hide().siblings().show();
      timer(60);
      sendcheckcode(telVal);
    }
  });

  // 点击到设置密码页面验证登录setting-password
  $('#login').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    // 验证手机格式  
    var telReg = /^1[3|4|5|7|8][0-9]{9}$/; //验证手机正则
    var telVal = $.trim($('#tel').val()).replace(/\s/g, '');

    var verifyVal = $.trim($('#verify').val()).replace(/\s/g, '');

    if (!telReg.test(telVal)) {
      showMessage('请输入正确的手机号');
      return;
    } else if (verifyVal == '' || verifyVal.length !== 4) {
      showMessage('请输入4位验证码');
      return;
    } else {
      console.log('success');
      var listParams = {
        checkcode: verifyVal,
        phone: telVal,
        source: 'WAP',
      };
      checkcode(listParams);
    }
  });


  // 点击到用户登录页面user-login
  $('#userLogin-entry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    window.location = './user-login.html';
  });



  // 点击返回回到上一页
  $('#back').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
