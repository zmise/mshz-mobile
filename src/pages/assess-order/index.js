require('./index.scss');


require('../../assets/js/plugins.js');

require('../../assets/js/navigate.js');//侧边栏


$(function () {
  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

  var code = getUrlParam('code');

  var message = {
    E0001: '上一个页面传过来的参数错误！！！',
    E0002: '订单预览接口返回的数据不正确',
    E0003: '价格日历接口返回的数据不正确'
  }
  $('#content').text('错误参数 ' + code + ': ' + message[code]);


  // 点击返回回到上一页
  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
