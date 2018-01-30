require('./index.scss');
// require('../../assets/js/plugins.js');

require('../../assets/js/toast.js');  //toast的事件


$(function () {
  //发送图形验证码get接口
  function getImageVerify() {
    $.ajax({
      url: '/mshz-app/verify/image',
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        console.log(res);
        if (res.status === 'C0000') {
          showMessage('发送中，请耐心等待');
        }
      },
      error: function (error) {
        // console.log(error.responseText);

        // console.log(encodeURI(error.responseText))
        // $('#verifyimg').attr('src', 'data:image/png;base64,' + encodeURI(error.responseText))
        // console.log('error');
      }
    });
  }
  // 验证图形验证码的get接口
  function verifyValidate(params) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/verify/validate',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        console.log(res);
        if (res.status === 'C0000' && res.result) {
          showMessage(res.message);
          $('#overlay').hide();
          $('#send-verify').hide().siblings().show();
          timer(60);
          sendcheckcode($.trim($('#tel').val()).replace(/\s/g, ''));
        } else {
          showMessage('验证错误，请重新输入');
          var verifyDom = document.getElementById('verifyimg');
          var src = verifyDom.src.substring(0, verifyDom.src.indexOf('?') + 1);
          verifyDom.src = src + Math.random();
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');

      }
    });
  }

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
          //sessionStorage缓存个人信息
          var item = res.result;
          if (item && item !== '') {
            window.sessionStorage.setItem('loginInfo', JSON.stringify(item));
          }
          // window.sessionStorage.setItem('headPortrait', item); //头像
          // window.sessionStorage.setItem('nickname', item); //昵称
          // window.sessionStorage.setItem('hasSetPassword', item); //是否已设置密码
          // window.sessionStorage.setItem('phone', item); //手机号码

          if (res.result.hasSetPassword) {
            var lastLocation = window.sessionStorage.getItem('lastLocation');
            if (lastLocation) {
              window.sessionStorage.removeItem('lastLocation');
              location.replace(lastLocation);
            } else {
              location.replace('/');
            }
          } else {
            location.replace('./setting-password.html');
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


  // 点击send-verify的发送图形验证码
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
      $('#overlay').show();

      if ($('#verifyimg').attr('src') !== '') {
        var verifyDom = document.getElementById('verifyimg');
        var src = verifyDom.src.substring(0, verifyDom.src.indexOf('?') + 1);
        verifyDom.src = src + Math.random();
      } else {
        $('#verifyimg').attr('src', '/mshz-app/verify/image?');
      }

      $('.textList .items').eq(0).focus();
      // $(this).hide().siblings().show();
      // timer(60);
      // sendcheckcode(telVal);
    }
  });

  // 点击验证图更换
  $('#verifyimg').on('click', function () {
    // src的变化会导致请求 
    var src = this.src.substring(0, this.src.indexOf('?') + 1);
    this.src = src + Math.random();
  });

  // 跳文本框
  $('.textList .items').on('input propertychange', function () {
    if ($(this).val().length === 1) {
      $(this).next().focus();
    } else {
      $(this).prev().focus();
    }
  });

  // 点击cancel的发送短信验证码
  $('#cancel').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var code = '';
    var $textList = $('.textList .items')
    for (var i = 0; i < $textList.length; i++) {
      code += $textList.eq(i).val();
    }
    $textList.blur();
    var params = {
      code: code,
    }
    verifyValidate(params);
  });

  // 点击noCancel的取消验证
  $('#noCancel').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#overlay').hide();

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
