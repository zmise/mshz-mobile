require('./index.scss');
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/plugins/jquery.banner.js');//轮播图


require('../../assets/vendors/iconfont/iconfont.js'); //有色图标

require('../../assets/js/destination.js');// 日地的
require('../../assets/js/search.js'); //搜索功能
require('../../assets/js/calendar.js');//日期插件
require('../../assets/js/appDownload.js');//全局下载APP



$(function () {

  // $('.house-base-info .base-server .icon-items:gt(4)').addClass('hide');
  /* 焦点图片  */
  $('.banner-body').banner({
    'width': $(window).width(),
    'height': $(window).width() * 2 / 3,
    'paginationType': 'fraction',
    'autoPlay': true, // 是否自动播放
    'speed': 3000, // 播放速度

  });

  // /* switch header */
  // function switchHeader() {
  //   var _hig = $('.banner-body').height();
  //   if ($(document).scrollTop() > _hig) {
  //     $('.header-body').show();
  //   } else {
  //     $('.header-body').hide();
  //   }
  // };

  /* switch header   */
  var timeoutObject;
  $(document).on('scroll.header', function () {
    if (timeoutObject) {
      clearTimeout(timeoutObject);
    }
    timeoutObject = setTimeout(switchHeader, 30);
  });



  $('#firstSelect').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();

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
      window.sessionStorage.setItem('startDate', start);
      window.sessionStorage.setItem('endDate', end);

    },   //回调函数
    comfireBtn: '.comfire',//确定按钮的class或者id
  });


  //防止input被选中

  $('.select-body').on('focus', 'input', function (e) {
    e.preventDefault();
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
  }



  function searchInfo(cityName) {
    // console.log(cityName);
    // var city = $('#destination-entry').val();
    $.ajax({
      url: '/mshz-app/room/queryCityRimInfo',
      data: {
        'city': cityName,
      },
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        // console.log('success');
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

  /*  点击搜索跳转houselist */
  $("#search").click(function () {

    // if ($('#destination-entry').val() != '') {
    //   var cityName = $('#destination-entry').val();
    //   // if (pinyin.isSupported()) {
    //   //   cityName = pinyin.convertToPinyin(cityName)
    //   // }
    //   // $('#destination-entry').attr('data-cityname', cityName);
    // }
    if (!$("#destination-entry").val()) {

      return;
    }

    // var city = $("#destination-entry").data('cityname');
    var city = $("#destination-entry").val();
    var poi = $("#search-entry").val();
    var dates = $("#firstSelect").val();
    var path = "/houseList?city=" + city
    if (dates != "") {
      var split = dates.split("至");
      var str = "&startDate=" + split[0] + "&endDate=" + split[1];
      path += str;
    }
    if (poi != "") {
      path += "&poi=" + poi;
    }
    console.log(path);
    window.location = path;
  })


  /* 选定位置返回首页的事件  */
  $('.des-body .des-location .icon-fanhui').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    // console.log($(this).prev().text());
    $('#destination-entry').val($(this).prev().text());
    $(this).closest('.des-body').hide();
    $('body,html').css({ 'overflow': 'visible' });
  });
  $('.des-hot-city .items').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#destination-entry').val($(this).text());
    $('#search-entry').val('');


    // var cityName = $(this).data('cityPing');
    // if (pinyin.isSupported()) {
    //   var cityName = pinyin.convertToPinyin(cityName)
    // }
    // $('#destination-entry').attr('data-cityname', cityName);


    $(this).closest('.des-body').hide();
    $('body,html').css({ 'overflow': 'visible' });

  });
  $('.des-list .txt').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#destination-entry').val($(this).text());
    $(this).closest('.des-body').hide();
    $('body,html').css({ 'overflow': 'visible' });
  });


  /* 进入搜索页 */
  $('#search-entry').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    if ($.trim($(this).val()) == '') {
      $('.search-layer').show();
      $('.search-layer .search-keyword').show();
      $('.search-layer .search-list').hide();
      $('body,html').css({ 'overflow': 'hidden' });
      $('.search-body .text-body .text').val($(this).val());
    } else {
      $('.search-layer').show();
      $('.search-layer .search-keyword').hide();
      $('.search-layer .search-list').show();
      $('body,html').css({ 'overflow': 'hidden' });
      $('.search-body .text-body .text').val($(this).val());
    }

    searchInfo($('#destination-entry').val());
    // $('.search-layer').show();
    // $('body,html').css({ 'overflow': 'hidden' });
    // $('.search-body .text-body .text').val($(this).val());

  });
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


  /*  用sessionStorage存储startDate和endDate */



  /*  当天的日期和当他下一天的日期*/
  var startDate, endDate;
  function initTime() {
    var b = new Date();
    var ye = b.getFullYear();
    var mo = b.getMonth() + 1;
    var da = b.getDate();
    b = new Date(b.getTime() + 24 * 3600 * 1000);
    var ye1 = b.getFullYear();
    var mo1 = b.getMonth() + 1;
    var da1 = b.getDate();
    if (mo < 10) {
      mo = '0' + mo
    }
    if (da < 10) {
      da = '0' + da
    }
    if (mo1 < 10) {
      mo1 = '0' + mo1
    }
    if (da1 < 10) {
      da1 = '0' + da1
    }
    startDate = ye + '-' + mo + '-' + da;
    endDate = ye1 + '-' + mo1 + '-' + da1;

  }

  initTime();
  // console.log(startDate);
  // console.log(endDate);
  startDate = $.trim($('#firstSelect').val().split('至')[0]) || startDate;
  endData = $.trim($('#firstSelect').val().split('至')[1]) || endDate;

  window.sessionStorage.setItem('startDate', startDate);
  window.sessionStorage.setItem('endDate', endDate);



  //点击进入订单列表
  $('.navigatelist-body').on('tap', '#orderList-entry', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.location = './order-list.html';

  });
});
