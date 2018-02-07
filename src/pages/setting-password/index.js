require('./index.scss');
// require('../../assets/js/plugins.js');

var toast = require('../../assets/js/toast.js');  //toast的事件


$(function () {

  // 跳转逻辑
  function windowLocation() {
    var lastLocation = window.sessionStorage.getItem('lastLocation');
    var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
    if (loginInfo) {
      history.go(-1);
    } else if (lastLocation) {
      window.sessionStorage.removeItem('lastLocation');
      location.replace(lastLocation);
    } else {
      location.replace('/');
    }
  }
  //设置密码post接口
  function modPassword(params) {
    $.ajax({
      url: '/mshz-app/security/user/modPassword',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          toast.show('密码设置完成，请牢记密码！');
          var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
          loginInfo.hasSetPassword = false;
          window.sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
          setTimeout(function () {
            // window.location = '/';
            windowLocation();
          }, 2000);
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
  // [\u4e00-\u9fa5_\s/g]{6,12}
  // 点击到完成并登录成功跳转到login /\s/g  /[\u4e00-\u9fa5_\s/g]/ /[^\x00-\xff]/if (!telReg.test(telVal)) {
  $('#indexEntry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var pswVal = $('#psw').val();
    var pswReg = /[\u4e00-\u9fa5_\s]/g;; //验证密码正则
    if (pswVal.length > 12 || pswVal.length < 6 || pswReg.test(pswVal)) {
      showMessage('请输入6-12位密码');
      $('#psw').val('');
      return;
    } else {
      var listParams = {
        newPassword: pswVal,
        passwordStatus: 'NOT_SET',
      };
      modPassword(listParams);
    }
  });

  // 点击跳过的跳转
  $('#passing').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var lastLocation = window.sessionStorage.getItem('lastLocation');
    if (lastLocation) {
      window.sessionStorage.removeItem('lastLocation');
      location.replace(lastLocation);
    } else {
      location.replace('/');
    }
  });

  // 点击返回回到上一页
  $('#back').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
