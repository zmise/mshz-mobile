require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/js/appDownload.js');//全局下载APP


$(function () {


  // 订单详情页面的get接口
  function orderDetails(params) {

    // console.log(params);

    $.ajax({
      url: '/mshz-app/security/app/order/queryOrderPreview',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        // console.log('success');
        // console.log(data);
        if (data.status === 'C0000') {
          if (data && data.result && data.result !== '') {
            var json = data.result;
            console.log(json);
            var str = '';

            
          }
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
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }
  var orderNo = getUrlParam('orderNo');
  console.log(orderNo);
  if (!orderNo) {
    location.replace('error.html?code=E0001')
  } else {
    // 关闭loading
    $('#loading').remove();
  }

});
