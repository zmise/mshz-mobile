require('./index.scss');
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');

require('../../assets/vendors/iconfont/iconfont.js'); //有色图标

require('../../assets/js/destination.js');// 日地的
require('../../assets/js/search.js'); //搜索功能
require('../../assets/js/caledaner.js');//日期插件

$(function () {
  var b = new Date();
  var ye = b.getFullYear();
  var mo = b.getMonth() + 1;
  var da = b.getDate();
  b = new Date(b.getTime() + 24 * 3600 * 1000);
  var ye1 = b.getFullYear();
  var mo1 = b.getMonth() + 1;
  var da1 = b.getDate();

  if ($('#startDate').length) {
    $('#startDate').val(ye + '-' + mo + '-' + da);
    $('#endDate').val(ye1 + '-' + mo1 + '-' + da1);
  } else {
    $('#firstSelect').val(ye + '-' + mo + '-' + da + '至' + ye1 + '-' + mo1 + '-' + da1);
  }

  var startData, endData;
  if ($('#startDate').length) {
    console.log($('#startDate').val())
    startData = $.trim($('#startDate').val());
    endData = $.trim($('#endDate').val());
  } else {
    startData = $.trim($('#firstSelect').val().split('至')[0]);
    endData = $.trim($('#firstSelect').val().split('至')[1]);
  }
  $('#firstSelect').calendarSwitch({
    selectors: {
      sections: ".calendar"
    },
    index: 3,      //展示的月份个数
    animateFunction: "toggle",        //动画效果
    controlDay: false,//知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
    // daysnumber: "90",     //控制天数
    comeColor: "#44bb80",       //入住颜色
    outColor: "#44bb80",      //离店颜色
    comeoutColor: "#44bb80",        //入住和离店之间的颜色
    callback: function () {
      console.log("callback")
    },   //回调函数
    comfireBtn: '.comfire',//确定按钮的class或者id
    startData: startData,
    endData: endData,
  });

});
