require('../../common/session');
require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/toast.js');  //toast的事件

$(function () {

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


  $('#pushSuggest').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    if ($('#textarea').val() === '') {
      return
    }
    var params = {
      content: $('#textarea').val(),
    }
    $.ajax({
      url: '/mshz-app/security/userFeedBack/addUserFeedBack',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          setTimeout(function () {
            history.go(-1);
          }, 1000);
        }
        showMessage(res.message);
        $('#textarea').val('')
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  });

  // 点击返回回到上一页
  $('#back').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
