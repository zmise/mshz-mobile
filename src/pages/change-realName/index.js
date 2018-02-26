require('./index.scss');
require('../../assets/js/analytics.js');
require('../../assets/js/plugins.js');
var toast = require('../../assets/js/toast.js');  //toast的事件


$(function () {


  //修改个人资料post接口
  function updateUserInfo(params) {
    console.log(params);
    $.ajax({
      url: '/mshz-app/security/user/updateUserInfo',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          toast.show('修改成功');

        } else {
          toast.show('修改失败');
        }
        setTimeout(function () {
          history.go(-1);
        }, 1000);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  // 点击到完成并登录成功跳转到login
  $('#save').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var nickname = $.trim($('#nickname').val());
    // if (!reg.test(telVal)) {
    //   toast.show('请输入一个字以内的昵称');
    //   return;
    // }
    var params = {
      nickname: nickname,
    };
    updateUserInfo(params);
  });

  // 点击返回回到上一页
  $('#back').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
