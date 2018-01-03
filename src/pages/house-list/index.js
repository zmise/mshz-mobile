require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');

require('../../assets/js/search.js'); //搜索功能
require('../../assets/js/caledaner.js');//日期插件

require('../../assets/js/filter.js');//筛选功能
require('../../assets/js/appDownload.js');//全局下载APP



$(function () {
  var startData, endData, sourceData;
  startData = '2018-01-02';
  endData = '2018-01-03';
  $('#firstSelect').on('tap', function (e) {
    e.stopPropagation();
    $('body,html').css({ 'overflow': 'hidden' }); //阻止首页滚动条事件
  });
  $('#firstSelect').calendarSwitch({
    selectors: {
      sections: ".calendar"
    },
    index: 3,      //展示的月份个数
    animateFunction: "slideToggle",        //动画效果
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
    sourceData: sourceData,
  });

});
