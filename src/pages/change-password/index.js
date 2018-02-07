require('../../common/session');
require('./index.scss');

var toast = require('../../assets/js/toast.js');  //toast的事件

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
          toast.show(res.message);
          setTimeout(function () {
            history.go(-1);
          }, 1000);
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
    $(this).find('.icon').addClass('current');
    $(this).siblings().find('.icon').removeClass('current');
  });

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

  // 点击到完成并登录成功跳转到login
  $('#index-entry').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var oldPswVal = $('#oldPsw').val();
    var pswVal = $('#psw').val();
    var pswReg = /[\u4e00-\u9fa5_\s]/g;
    if (oldPswVal.length > 12 || oldPswVal.length < 6 || pswReg.test(oldPswVal)) {
      showMessage('请输入真确的密码');
      $('#oldPsw').val('');
      $('#psw').val('');
      return;
    } else if (pswVal.length > 12 || pswVal.length < 6 || pswReg.test(pswVal)) {
      showMessage('请输入6-12位密码');
      $('#oldPsw').val('');
      $('#psw').val('');
      return;
    } else {
      var listParams = {
        oldPassword: oldPswVal,
        newPassword: pswVal,
        passwordStatus: 'HAS_SET',
      };
      modPassword(listParams);
    }
  });

  // 点击返回回到上一页
  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
