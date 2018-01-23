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

  // 点击给评分
  $('.assess-start').on('tap', '.start', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).siblings().removeClass('icon-tianchongxingji current').addClass('icon-weitianchongxingji');
    $(this).removeClass('icon-weitianchongxingji').addClass('icon-tianchongxingji current').prevAll().removeClass('icon-weitianchongxingji').addClass('icon-tianchongxingji current');
    $(this).closest('.items').attr('data-score', $(this).index() + 1)
    console.log($(this).closest('.items'))
    console.log($(this).index())
  });


  // 点击上传图片
  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });
  // 点击返回回到上一页
  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
