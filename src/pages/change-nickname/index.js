require('./index.scss');
require('../../assets/js/analytics.js');
require('../../assets/js/plugins.js');
var toast = require('../../assets/js/toast.js');  //toast的事件
var record = require('../../assets/js/record'); //判断无痕模式

var Cookie = require('js-cookie');
$(function () {


  function getUserInfo() {
    var dtd = $.Deferred();
    // var loginInfo = JSON.parse(record.getSessionRecord('loginInfo'));
    var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
    if (loginInfo) {
      dtd.resolve(loginInfo);
    } else if (Cookie.get('sid') || $('body').data('logined')) {
      $.ajax({
        url: '/mshz-app/security/user/info/query',
        type: 'get',
        dataType: 'JSON'
      }).then(function (res) {
        if (res.status === 'C0000') {
          dtd.resolve(res.result);
        } else {
          dtd.reject(new Error('查询用户信息失败！'));
        }
      });
    }
    return dtd;
  }

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
          getUserInfo().then(function (loginInfo) {
            loginInfo.nickname = params.nickname;
            record.setSessionRecord('loginInfo', JSON.stringify(loginInfo));
            setTimeout(function () {
              history.go(-1);
            }, 1000);
          }).fail(function () {
            // 查询失败后或考虑跳转到登录页
            // location.replace('./login.html');
          });
        } else {
          toast.show('修改失败');
        }

      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return null; //返回参数值
  }
  var nickname = getUrlParam('nickname');

  if (!nickname) {
    location.replace('error.html?code=E0001')
  } else {
    // 关闭loading
    $('#loading').remove();
    $('#nickname').val(nickname);
  }

  // 点击到完成并登录成功跳转到login /^\d+$/
  $('#save').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();

    var nickname = $.trim($('#nickname').val());
    var nameReg = /^\d+$/; //纯数字

    if (nickname.length === 0 || nameReg.test(nickname)) {
      toast.show('请输入正确的姓名');
      return;
    }
    var params = {
      nickname: nickname
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
