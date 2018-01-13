require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏


$(function () {
  var t_min = 60;
  var $min = $('#minute');
  var $sec = $("#seconds");
  $min.text('30');
  $sec.text('00');
  var interval = setInterval(function () {
    var t_result = ($min.text() - 0) * 60 + ($sec.text() - 0) - 1;
    var t_result_min = Math.floor(t_result / t_min);
    var t_result_sec = Math.floor(t_result % t_min);
    // 将时间小于10的,在值前面加入0; 
    if (t_result_min < 10) {
      t_result_min = "0" + t_result_min;
    }

    if (t_result_sec < 10) {
      t_result_sec = "0" + t_result_sec;
    }

    //显示到页面上
    $min.text(t_result_min);
    $sec.text(t_result_sec);

    //清除定时器并执行释放房源的操作和刷新页面
    if (t_result <= 0) {
      clearInterval(interval);
    }
  }, 1000);
});
