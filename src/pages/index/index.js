require('./index.scss');
require('../../assets/js/analytics.js');
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/plugins/jquery.banner.js');//轮播图

require('../../assets/vendors/iconfont/iconfont.js'); //有色图标

require('../../assets/js/destination.js');// 日地的
require('../../assets/js/search.js'); //搜索功能
require('../../assets/js/calendar.js');//日期插件
require('../../assets/js/appDownload.js');//全局下载APP
var toast = require('../../assets/js/toast.js');  //toast的事件
require('../../assets/js/record.js'); //判断无痕模式

var geo = require('../../common/geo');
// 记录用户所在经纬度
var coords = {};


// 解决Safari ( WKWebview ) 返回后页面不刷新的问题
// var browserRule = /^.*((iPhone)|(iPad)|(Safari))+.*$/;
// if (browserRule.test(navigator.userAgent)) {
//   window.onpageshow = function (event) {
//     if (event.persisted) {
//       window.location.reload()
//     }
//   };
// }

$(function () {
  window.sessionStorage.setItem('lastLocation', location.href);

  //searchInfo
  function searchInfo(cityName) {
    $.ajax({
      url: '/mshz-app/room/queryCityRimInfo',
      data: {
        'city': cityName,
      },
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {

        var json = data.result || [];
        //取localStorage中搜索历史的值
        var city = $.trim($('#destination-entry').val());
        var searchHistroy;
        if (window.localStorage.getItem('searchHistroy')) {
          searchHistroy = JSON.parse(window.localStorage.getItem('searchHistroy'))
        } else {
          searchHistroy = {};
        }
        var item = searchHistroy[city] || [];
        var str = '';
        if (item.length > 0) {
          str =
            '<div class="theme"><div class="title">搜索历史</div><div class="keywords">';
          for (var i = 0; i < item.length; i++) {

            str += '<a class="items" href="javascript:;" data-type="' + item[i].type + '" data-lat="' + item[i].lat + '" data-lon="' + item[i].lon + '">' + item[i].destination + '</a>';
          }

          str += '</div></div>';
        }
        for (var i = 0; i < json.length; i++) {
          var str1 = ''
          var arr = json[i].rimNames;
          for (var j = 0; j < arr.length; j++) {
            str1 += '<a class="items" href="javascript:;" data-type="' + json[i].rimType + '" data-lat="' + arr[i].lat + '" data-lon="' + arr[i].lon + '">' + arr[j].name + '</a>';
          }

          str += '<div class="theme"><div class="title">' + json[i].rimType + '</div><div class="keywords">' + str1 + '</div></div>';
        }
        $('.search-keyword').empty().append(str);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }


  function bdGetPosition(result) {
    console.log(result);
    var cityName = result.address.city;
    if (cityName.indexOf('市') != -1) {
      cityName = cityName.replace('市', '');
    }
    if ($('#destination-entry').val() == '') {
      $('#destination-entry').val(cityName);
    }

    coords.latitude = result.point.lat;
    coords.longitude = result.point.lng;
    if (!coords.latitude || !coords.longitude) {
      window.onload = function () {
        geo.getLocation(function (position) {
          coords = position.coords;
        });
      }
    }
  }


  var startDate, endDate;
  var timeoutObject;
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

  //阻止首页滚动条事件
  function stopScroll() {
    $('body').css({
      position: 'fixed',
      top: -document.body.scrollTop + 'px'
    });
  }

  //恢复首页滚动条事件
  function bodyScroll() {
    var top = -document.body.style.top.replace('px');
    $('body').css({
      position: 'static'
    });
    window.scrollTo(0, top);
  }
  // 百度接口的定位获取信息（cityName，lat，lon）
  var nowCity = new BMap.Geolocation();
  nowCity.getCurrentPosition(bdGetPosition);

  initTime();

  startDate = $.trim($('#firstSelect').val().split('至')[0]) || startDate;
  endDate = $.trim($('#firstSelect').val().split('至')[1]) || endDate;

  window.sessionStorage.setItem('startDate', startDate);
  window.sessionStorage.setItem('startDate', startDate);
  window.sessionStorage.setItem('endDate', endDate);

  /* 焦点图片  */
  if ($('.banner img').length > 1) {
    $('.banner-body').banner({
      width: $(window).width(),
      height: $(window).width() * 2 / 3,
      autoPlay: true, // 是否自动播放
      speed: 3000, // 播放速度
      pagination: 'pagination', // 分页器的className
      paginationType: 'bullets', // 分页器的类型   bullets (小点) | fraction (x/y)
    });
  }


  // 判断#handleSearch是否有值，来是否显示handleSearch-input-right
  if ($('#search-entry').val() !== '') {
    $('.select-body .input-text .handleSearch-input-right').css('display', 'flex');
  }
  $('.select-body .input-text ').on('tap', '.handleSearch-input-right', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#search-entry').val('');
    $('.select-body .input-text .handleSearch-input-right').hide();
  });


  $('#handleCalendar').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    stopScroll();
  });

  $('#handleCalendar').calendarSwitch({
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
      // window.sessionStorage.setItem('startDate', start);
      // window.sessionStorage.setItem('endDate', end);
      window.sessionStorage.setItem('startDate', startDate);
      window.sessionStorage.setItem('endDate', endDate);
      for (var i = 0; i < $('.index-list a').length; i++) {
        $('.index-list a:eq(' + i + ')').attr('href', $('.index-list a:eq(' + i + ')').attr('href') + '&startDate=' + start + '&endDate=' + end);
      }
    },   //回调函数
    comfireBtn: '.comfire',//确定按钮的class或者id
  });


  //防止input被选中

  $('.select-body').on('focus', 'input', function (e) {
    e.preventDefault();
  });


  /*  点击搜索跳转houselist.html */
  $('#search').click(function () {
    if (!$('#destination-entry').val()) {
      toast.show('请选择目的地');
      return;
    }

    var $searchEntry = $('#search-entry');

    var city = $('#destination-entry').val();
    var poi = $searchEntry.val();
    var dates = $('#firstSelect').val();
    var path = '/houseList?city=' + city;
    var type = $searchEntry.data('type');
    var lon = $searchEntry.data('lon');
    var lat = $searchEntry.data('lat');

    var searchHistroy;
    if (window.localStorage.getItem('searchHistroy')) {
      searchHistroy = JSON.parse(window.localStorage.getItem('searchHistroy'))
    } else {
      searchHistroy = {};
    }
    var cityType = searchHistroy[city] || [];
    var typeItem;
    for (var i = 0; i < cityType.length; i++) {
      var item = cityType[i].destination;
      if (item === poi) {
        typeItem = cityType[i].type;
      }
    }
    console.log(typeItem);
    if (dates != '') {
      var split = dates.split('至');
      var str = '&startDate=' + split[0] + '&endDate=' + split[1];
      path += str;
    }
    if (poi != '') {
      path += '&poi=' + poi;
    }
    if (lat !== '' && lon !== '' && lat && lon) {
      path += '&lat=' + lat + '&lon=' + lon;
    } else {
      path += '&lat=' + coords.latitude + '&lon=' + coords.longitude;
    }

    if (type === '机场车站' || type === '飞机场' || type === '汽车站' || type === '火车站' || typeItem === '机场车站' || typeItem === '飞机场' || typeItem === '汽车站' || typeItem === '火车站') {
      path += '&needAllCity=true&sortBy=A1'
    }
    console.log(path);

    location.href = path;
  })


  /* 选定位置返回首页的事件  */
  $('.des-body .des-location .icon-fanhui').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#destination-entry').val($(this).prev().text());
    $(this).closest('.des-body').hide();
    bodyScroll();
  });
  /* 切换目的地时的事件 */
  $('.des-hot-city .items').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#destination-entry').val($(this).text());
    $('#search-entry').val('');

    $(this).closest('.des-body').hide();

    bodyScroll();
  });
  $('.des-list .txt').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#destination-entry').val($(this).text());
    $(this).closest('.des-body').hide();
    bodyScroll();
  });


  /* 进入搜索列表 */
  $('#handleSearch').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    stopScroll();
    if ($.trim($(this).val()) == '') {
      $('.search-layer').show();
      $('.search-layer .search-keyword').show();
      $('.search-layer .search-list').hide();
      $('.search-body .text-body .text').val($(this).val());
    } else {
      $('.search-layer').show();
      $('.search-layer .search-keyword').hide();
      $('.search-layer .search-list').show();
      $('.search-body .text-body .text').val($(this).val());
    }
    searchInfo($('#destination-entry').val());

    $('.search-body .text-body .text').val($('#search-entry').val());

  });

});
