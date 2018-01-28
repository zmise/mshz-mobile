require('./index.scss');
require('../../assets/js/plugins.js');
require('../../assets/js/toast.js');  //toast的事件


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
          showMessage('修改成功');

        } else {
          showMessage('修改失败');
        }
        setTimeout(() => {
          history.go(-1);
        }, 1000);
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






  // 点击到完成并登录成功跳转到login
  $('#save').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var nickname = $.trim($('#nickname').val());
    // if (!reg.test(telVal)) {
    //   showMessage('请输入一个字以内的昵称');
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
