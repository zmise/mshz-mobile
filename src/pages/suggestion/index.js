require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');

/* 侧边导航 */
require('../../assets/js/plugins.js');
var toast = require('../../assets/js/toast.js');  //toast的事件

$(function () {

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
        toast.show(res.message);
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
