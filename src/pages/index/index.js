require('./index.scss');
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');

require('../../assets/vendors/iconfont/iconfont.js'); //有色图标

require('../../assets/js/destination.js');// 日地的
require('../../assets/js/search.js'); //搜索功能
require('../../assets/js/calendar.js');//日期插件
require('../../assets/js/appDownload.js');//全局下载APP

$(function () {

  /*  引入转换pinyin插件 */
  const pinyin = require('tiny-pinyin')



  // if ($('#firstSelect').val() === '') {

  //   var b = new Date();
  //   var ye = b.getFullYear();
  //   var mo = b.getMonth() + 1;
  //   var da = b.getDate();
  //   b = new Date(b.getTime() + 24 * 3600 * 1000);
  //   var ye1 = b.getFullYear();
  //   var mo1 = b.getMonth() + 1;
  //   var da1 = b.getDate();
  //   if (mo < 10) {
  //     mo = '0' + mo
  //   }
  //   if (da < 10) {
  //     da = '0' + da
  //   }
  //   if (mo1 < 10) {
  //     mo1 = '0' + mo1
  //   }
  //   if (da1 < 10) {
  //     da1 = '0' + da1
  //   }
  //   if ($('#startDate').length) {
  //     $('#startDate').val(ye + '-' + mo + '-' + da);
  //     $('#endDate').val(ye1 + '-' + mo1 + '-' + da1);
  //   } else {
  //     $('#firstSelect').val(ye + '-' + mo + '-' + da + '至' + ye1 + '-' + mo1 + '-' + da1);
  //   }

  // }

  // var startData, endData;
  // startData = $.trim($('#firstSelect').val().split('至')[0]);
  // endData = $.trim($('#firstSelect').val().split('至')[1]);

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
    callback: function (start, end) {
      $('#firstSelect').val(start + '至' + end);
    },   //回调函数
    comfireBtn: '.comfire',//确定按钮的class或者id
    // startData: startData,
    // endData: endData,
  });



  //获取位置的经纬度
  // function getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(showPosition);
  //   }
  //   else {
  //     // x.innerHTML = "该浏览器不支持获取地理位置。";
  //     alert('该浏览器不支持获取地理位置。');
  //   }
  // }

  // function showPosition(position) {

  //   //   x.innerHTML="纬度: " + position.coords.latitude + 
  //   // "<br>经度: " + position.coords.longitude;	
  //   alert('纬度: ' + position.coords.latitude +
  //     '经度: ' + position.coords.longitude)
  // }
  // $('#location').on('tap', function (e) {
  //   e.stopPropagation();
  //   getLocation();
  // });

  // 自动获取定位访问者当前城市
  // var str = "Hello 世界!";
  // alert(str.indexOf("世界"));   //6  
  // if (str.indexOf("Hello") != -1) {
  //   alert("包含");
  // } else {
  //   alert("不包含");
  // }
  if ($('#destination-entry').val() == '') {
    var nowCity = new BMap.LocalCity();
    nowCity.get(bdGetPosition);
  }
  function bdGetPosition(result) {
    var cityName = result.name;
    if (cityName.indexOf('市') != -1) {
      cityName = cityName.replace('市', '');
    }
    $('#destination-entry').val(cityName);
    if (pinyin.isSupported()) {
      var cityName = pinyin.convertToPinyin(cityName)
    }
    $('#destination-entry').attr('data-cityname', cityName);
    searchInfo(cityName);
  }



  function searchInfo(cityName) {
    var city = $('#destination-entry').val();
    $.ajax({
      // url: 'http://172.16.72.198:51711/mshz-render/queryCityRimInfo',
      url: 'http://192.168.0.243:51312/mshz-app/room/queryCityRimInfo',
      data: {
        'cityZW': '深圳' || cityName,
      },
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        console.log('success');
        var json = data.result;
        console.log(json);
        var str = '';
        for (var i = 0; i < json.length; i++) {
          var str1 = ''
          var arr = json[i].rimNames;
          for (var j = 0; j < arr.length; j++) {
            str1 += '<a class="items" href="javascript:;">' + arr[j].name + '</a>';
          }

          str += '<div class="theme"><div class="title">' + json[i].rimType + '</div><div class="keywords">' + str1 + '</div></div >';
        }
        $('.search-keyword').empty().append(str);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }




  // $.ajax({
  //   url: '/api/room/darkSelectRimInfo',
  //   data: {
  //     'city': 'KUNMING',
  //     'name': $(this).text()
  //   },
  //   dataType: 'json',
  //   type: 'GET',
  //   success: function (data) {
  //     console.log('success');
  //     console.log(data);
  //   },
  //   error: function (error) {
  //     console.log(error);
  //     console.log('error');

  //   }
  // });

});
