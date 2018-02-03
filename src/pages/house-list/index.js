require('./index.scss');
require('../../sass/dropload.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/search.js'); //搜索功能
require('../../assets/js/calendar.js');//日期插件
require('../../assets/js/filter.js');//筛选功能
require('../../assets/js/appDownload.js');//全局下载APP
var util = require('../../util/');

var b = new Date();
var today = util.formatDate(b, 'yyyy-MM-dd');

b = new Date(b.getTime() + 24 * 3600 * 1000);
var tomorrow = util.formatDate(b, 'yyyy-MM-dd');



require('../../assets/js/dropload.min');

$(function () {

  var params = {};
  // var _html = require('../../assets/svg/loading.html');

  // houseList


  // dropload
  var $houseList = $('.recommend-body .mrl_35'); // $('#houseList')
  var dropload = $('.recommend-body').dropload({
    scrollArea: window,
    domDown: {
      domClass: 'dropload-down',
      domRefresh: '<div class="dropload-refresh"> </div>',
      domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
      domNoData: '<section class="unusual-body">' +
        '  <div class="no-house"></div>' +
        '  <span>很抱歉，没有搜索到房源</span>' +
        '</section>',
      domFinished: '<div class="dropload-finished">已加载所有房源</div>'
    },
    loadDownFn: loadingMore
  });

  /* get请求 loadingMore start*/

  function loadingMore(options) {
    var curPage = +$('#page').val();
    if (options && options.isReload) {
      console.log('reload')
      $('#page').val(1);
      dropload.unlock();
    } else {
      $('#page').val(curPage + 1);
    }
    var params = initParams();
    var lastParams = {};
    for (var prop in params) {
      if (params[prop] && params[prop] !== '') {
        lastParams[prop] = params[prop];
      }
    }
    $.ajax({
      url: '/mshz-app/room/queryRoom',
      data: lastParams,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {

        var recordCount = res.result && res.result.recordCount || 0;

        if (lastParams.page === 1) {
          $houseList.empty();
        }

        if (res.status === 'C0000'
          && res.result
          && res.result.items
          && res.result.items.length > 0) {
          var data = res.result.items;

          var result = '';
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            result +=
              '<a class="index-list" href="/houseDetails?id=' + item.id + '">' +
              '  <img src="' + item.mainPicture.replace('{size}', '680x384') + '" alt="">' +
              '  <div class="item-oneline">' +
              '    <p>' + item.title + '</p>' +
              '    <p>￥' + item.price + '</p>' +
              '  </div>' +
              '  <div class="item-twoline">' +
              '    <i class="twoline-items">' + item.cityName + '</i>' +
              '    <i class="twoline-items">' + item.houseType + '</i>' +
              '    <i class="twoline-items">' + item.customerCount + '人</i>' +
              '  </div>' +
              '  <div class="item-threeline">' +
              '    <div class="three-lline">' +
              '      <div class="star-lines"></div>' +
              '      <i class="score">' + item.rateServer + '分</i>' +
              '    </div>' +
              '    <div class="three-rline">' +
              '      <i class="twoline-items">' + item.livedCount + '人住过</i>' +
              '      <i class="twoline-items">' + item.commentCount + '条评价</i>' +
              '    </div>';
            if (item.distDesc > 0) {
              result +=
                '    <div class="other-line">' +
                '      <span>' + (lastParams.poi ? '距景点 ' : '距我 ') + item.distDesc + '</span>' +
                '    </div>';
            }
            result += '  </div>' +
              '</a>';
          }

          $houseList.append(result);

        }
        //dropload.noMoreData = lastParams.page >= res.result.pageCount;
        dropload.resetload(recordCount, lastParams.page, res.result && res.result.pageCount || 1);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
        var result =
          '<section class="unusual-body">' +
          '  <div class="no-network"></div>' +
          '  <span>网络请求失败，请检查网络</span>' +
          '</section>';
        $houseList.empty().append(result);
        dropload.lock();
      }
    });
  }
  /* loadingMore end*/

  // loadingMore();

  /* initParams */

  function initParams() {
    return {
      page: + $('#page').val(),
      city: $('#city').val(),
      keyword: $('#search-entry').val(),
      startDate: $('#startDate').val(),
      endDate: $('#endDate').val(),
      poi: $('#poi').val(),
      sortBy: $('#sortBy').val(),
      prices: $('#prices').val(),
      roomCount: $('#roomCount').val() === '' ? '' : +$('#roomCount').val(),
      furniture: $('#furniture').val(),
      currentPage: $('#page').val(),
      pageSize: 10,
      lon: $('#lon').val(),
      lat: $('#lat').val(),
    };

  }

  /* hideFilterLayer */

  function hideFilterLayer() {
    $('body,html').css({ 'overflow': 'visible' });
    $filterLayer.hide();
    $filterList.hide();
    $overlay.hide();
  };


  var sourceData;
  $('.cale-entry').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    hideFilterLayer();
    $('.calendar').slideToggle('fast');
    $('body,html').css({ 'overflow': 'hidden' }); //阻止首页滚动条事件
  });

  if (params.startDate === "") {
    params.startDate = today;
    params.endData = tomorrow;
  }
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
      $('#firstSelect').attr("data-startdata", start);
      $('#firstSelect').attr("data-enddata", end);
      $('#startDate').val(start);
      $('#endDate').val(end);
      window.sessionStorage.setItem('startDate', start);
      window.sessionStorage.setItem('endDate', end);
      // console.log($('#firstSelect').data())
      start = start.split('-');
      start = start[1] + '.' + start[2];
      end = end.split('-');
      end = end[1] + '.' + end[2];
      $('#firstSelect').text(start + '-' + end);

      loadingMore({ isReload: true });
    },   //回调函数
    comfireBtn: '.comfire',//确定按钮的class或者id
    startData: $('#startDate').val(),
    endDate: $('#endDate').val(),
    sourceData: sourceData,
  });

  var $filterLayer = $('.filter-layer');
  var $filterList = $('.filter-list');
  var $overlay = $('#overlay');
  /* 位置确定事件 */
  $('.filter-list').on('tap', '.two-row:not(.metro) .items', function (e) {
    e.stopPropagation();
    hideFilterLayer();

    $('#page').val(1);
    var $content = $(this).closest('.filter-list').find('.content');
    var curLayerIndex = $content.find('.one-row .current').index();
    var poi = $content.find('.two-row:eq(' + curLayerIndex + ')').find('.current').text();
    console.log(poi)
    if (poi == '不限') {
      poi = '';
      $(this).closest('body').find('.position').text('位置');
    } else {
      // console.log('zmise')
      $(this).closest('body').find('.position').text(poi);
    }
    $('#poi').val(poi);

    loadingMore({ isReload: true });
  });


  $('.filter-list').on('tap', '.metro .items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $metroRow = $(this).closest('.content').find('.metro-row');
    // console.log($metroRow)
    $metroRow.show();
    // console.log($metroRow.find('.silde:eq(' + $(this).index() + ')'));
    // $metroRow.find('.silde:eq(' + $(this).index() + ')').show().siblings().hide();
    $metroRow.find('div').css('display', 'none').eq($(this).index()).css('display', 'block');
  });
  $('.filter-list').on('tap', '.metro-row .items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    hideFilterLayer();
    var metro = $(this).text();
    //   // console.log(poi)
    if (metro === '不限') {
      metro = '';
      $(this).closest('body').find('.filter-body .mostjs:eq(0) .txt').text('位置');
    } else {
      $(this).closest('body').find('.filter-body .mostjs:eq(0) .txt').text(metro);
    }
    $('#poi').val(metro);

    loadingMore({ isReload: true });
  });


  /* 位置筛选层的切换事件 */
  $filterLayer.find('.one-row').on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest('.content').find('.metro-row').hide();

    $(this).addClass('current').siblings().removeClass('current');
    $('.two-row').css('display', 'none').eq($(this).index()).css('display', 'block');
    var $closest = $(this).closest('.content').find('.slide-body:not(.one-row)');
    $closest.find('.items').removeClass('current');
    // console.log($closest.find('.items:firstchild'))
    // $closest.eq(0).addClass('current');
  });
  /* 筛选确定事件 */

  $('.filter-list').on('tap', '.ok-two', function (e) {
    e.stopPropagation();
    hideFilterLayer();

    var furniture = $.map($('.threelist .options:eq(1)').find('.more-sel-items.current'), function (el) {
      return $(el).data('furniture');
    }).join(',');

    // var $roomCount = $('.threelist .options:eq(0) .items');
    // var roomCount = $roomCount.find('.current');
    $('#furniture').val(furniture);
    var prices = $('.first-slider .text-value').text().replace('￥', '') + '-' + $('.last-slider .text-value').text().replace('￥', '').replace('不限', '*');
    $('#prices').val(prices);
    // $('#poi').val(poi);

    var roomCount = $('.threelist .options:eq(0)').find('.current').data('roomcount');
    if (roomCount) { // 排除未选房间数的情况
      $('#roomCount').val(roomCount);
    }

    loadingMore({ isReload: true });
  });


  $('.filter-list').on('tap', '.cancel-one', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.onelist .items').removeClass('current');
    $('#page').val(1);
    $('#poi').val('');

  });
  $('.filter-list').on('tap', '.cancel-two', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.threelist .items').removeClass('current');
    var $mitems = $('.threelist .more-sel-items');

    $mitems.removeClass('current');
    $mitems.find('.icon').removeClass('current');

    $filterList.find('.checkbox-body .range .first-slider').css({ 'left': '-20px' });
    $filterList.find('.checkbox-body .range .first-slider .text-value').text('0');
    $filterList.find('.checkbox-body .range .last-slider').css({ 'right': '-20px' });
    $filterList.find('.checkbox-body .range .last-slider .text-value').text('不限');

    $filterList.find('.checkbox-body .range .range-value').css({ 'left': 0, 'right': 0 });
    $('#page').val(1);
    $('#prices').val('0-*');
    $('#roomCount').val('');
    $('#furniture').val('');

  });

  /* 排序层的切换确定事件 */
  $('.filter-layer .twolist').on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    hideFilterLayer();
    $(this).closest('body').find('.rule').text($(this).text());

    var sortBy = $(this).data('sortBy');
    console.log(sortBy)
    $('#sortBy').val(sortBy);

    //ajax
    loadingMore({ isReload: true });
    // freachloading($(this).text());
  });

  // /* 登录判断 */
  // var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
  // if (loginInfo) {
  //   $('#login').hide();
  //   $('#menu').css('display', 'flex');
  // }

  // // login入口
  // $('#login').on('tap', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   window.location = '/user/login.html';
  // });

});
