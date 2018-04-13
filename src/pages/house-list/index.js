require('./index.scss');
require('../../assets/js/analytics.js');
require('../../sass/dropload.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/search.js'); //搜索功能
require('../../assets/js/calendar.js');//日期插件
require('../../assets/js/filter.js');//筛选功能
require('../../assets/js/appDownload.js');//全局下载APP
require('../../assets/js/dropload.min');
var util = require('../../util/');
require('../../assets/js/record'); //判断无痕模式


var b = new Date();
var today = util.formatDate(b, 'yyyy-MM-dd');

b = new Date(b.getTime() + 24 * 3600 * 1000);
var tomorrow = util.formatDate(b, 'yyyy-MM-dd');

// // 解决Safari ( WKWebview ) 返回后页面不刷新的问题
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
  var params = {};
  // dropload
  var $houseList = $('.recommend-body .mrl_35'); // $('#houseList')
  var dropload = $('.recommend-body').dropload({
    scrollArea: window,
    domUp: {                                                            // 上方DOM
      domClass: 'dropload-up',
      domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
      domUpdate: '<div class="dropload-update">↑释放更新</div>',
      domLoad: '<div class="dropload-load"><span class="dropload-loading"></span>加载中...</div>'
    },
    domDown: {
      domClass: 'dropload-down',
      domRefresh: '<div class="dropload-refresh"></div>',
      domLoad: '<div class="dropload-load"><span class="dropload-loading"></span>加载中...</div>',
      domNoData: '<section class="unusual-body">' +
        '  <div class="no-house"></div>' +
        '  <span>很抱歉，没有搜索到房源</span>' +
        '</section>',
      domFinished: '', // <div class="dropload-finished">已加载所有房源</div>'
      domNetworkError: '<section class="unusual-body">' +
        '  <div class="no-network"></div>' +
        '  <span>网络请求失败，请检查网络</span>' +
        '</section>'
    },
    loadDownFn: loadingMore,
    loadUpFn: loadingMore,
  });

  /* get请求 loadingMore start*/

  function loadingMore(options) {
    var curPage = +$('#page').val();
    if (options && options.isReload) {
      console.log('reload');
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
              '<div class="index-list">' +
              '<a class="img" href="/houseDetails?id=' + item.id + '">' +
              '  <img src="' + item.mainPicture.replace('{size}', '1020x576') + '" alt="">' +
              '</a>' +
              '  <div class="item-oneline">' +
              '    <p>' + item.title + '</p>' +
              '    <p>￥' + item.price + '</p>' +
              '  </div>' +
              '  <div class="item-twoline">' +
              '    <i class="twoline-items">' + item.region + '</i>' +
              '    <i class="twoline-items">' + item.roomCount + '居' + item.area + '平</i>' +
              '    <i class="twoline-items">' + item.customerCount + '人</i>' +
              '  </div>' +
              '  <div class="item-threeline">' +
              '    <div class="three-lline">' +
              '      <div class="star-lines"><div class="star-bar-score" style="width:' + (item.rate * 1.7 / 5) + 'rem"></div><div class="star-bar"></div></div>' +
              '      <i class="score">' + item.rate.toFixed(1) + '分</i>' +
              '    </div>' +
              '    <div class="three-rline">' +
              '      <i class="twoline-items">' + item.livedCount + '人住过</i>' +
              '      <i class="twoline-items">' + item.commentCount + '条评价</i>' +
              '    </div>';
            if (item.distDesc) {
              result +=
                '    <div class="other-line">' +
                '      <span>' + (lastParams.poi ? '<i class="icon iconfont icon-xiaoweizhidingdian"></i> ' : '距我 ') + item.distDesc + '</span>' +
                '    </div>';
            }
            result += '  </div>' +
              '</div>';
          }

          $houseList.append(result);
          for (var j = 0; j < $('.index-list a').length; j++) {
            $('.index-list a:eq(' + j + ')').attr('href', $('.index-list a:eq(' + j + ')').attr('href').split('&')[0] + '&startDate=' + $('#startDate').val() + '&endDate=' + $('#endDate').val());
          }
        }
        dropload.resetload(recordCount, lastParams.page, res.result && res.result.pageCount || 1);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
        $houseList.empty();
        dropload.resetload(-1);
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
      needAllCity: $('#needAllCity').val(),
    };

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
  /* hideFilterLayer */

  function hideFilterLayer() {
    bodyScroll();
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
    stopScroll();
  });

  if (params.startDate === "") {
    params.startDate = today;
    params.endDate = tomorrow;
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
    var poi = $.trim($content.find('.two-row:eq(' + curLayerIndex + ')').find('.current').text());
    var type = $(this).data('type');
    // console.log(poi)
    if (poi == '不限') {
      poi = '';
      $(this).closest('body').find('.position').text('位置');
    } else {
      $(this).closest('body').find('.position').text(poi);
    }
    $('#poi').val(poi);

    if (type === '飞机场' || type === '汽车站' || type === '火车站') {
      $('#needAllCity').val('true');
    } else {
      $('#needAllCity').val('');
    }

    loadingMore({ isReload: true });
    console.log($(this).parents('.two-row').siblings().not('.metro').not('.one-row'));
    console.log($(this).parents('.two-row').siblings().not('.metro').not('.one-row').find('.items:first'));
    console.log($(this).parents('.two-row').siblings().not('.metro').not('.one-row').find('.items:first').find('.icon'));
    $(this).parents('.two-row').siblings().not('.one-row').find('.items').removeClass('current').find('.icon').removeClass('current');
    $(this).parents('.two-row').siblings().not('.one-row').find('.items:first').addClass('current').find('.icon').addClass('current')
  });


  $('.filter-list').on('tap', '.metro .items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $metroRow = $(this).closest('.content').find('.metro-row');
    $metroRow.show();
    $metroRow.find('div').css('display', 'none').eq($(this).index()).css('display', 'block');
  });
  $('.filter-list').on('tap', '.metro-row .items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    hideFilterLayer();
    var metro = $(this).text();
    if (metro === '不限') {
      metro = '';
      $(this).closest('body').find('.filter-body .mostjs:eq(0) .txt').text('位置');
    } else {
      $(this).closest('body').find('.filter-body .mostjs:eq(0) .txt').text(metro);
    }
    $('#poi').val('');
    $('#needAllCity').val('true');
    $('#lon').val($(this).data('lon'));
    $('#lat').val($(this).data('lat'));

    loadingMore({ isReload: true });
  });


  /* 位置筛选层的切换事件 */
  $filterLayer.find('.one-row').on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest('.content').find('.metro-row').hide();

    $(this).addClass('current').siblings().removeClass('current');
    $('.two-row').css('display', 'none').eq($(this).index()).css('display', 'block');
  });
  /* 筛选确定事件 */

  $('.filter-list').on('tap', '.ok-two', function (e) {
    e.stopPropagation();
    hideFilterLayer();

    var furniture = $.map($('.threelist .options:eq(1)').find('.more-sel-items.current'), function (el) {
      return $(el).data('furniture');
    }).join(',');

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
  });


  $('.filter-layer .threelist').on('touchstart', '.range-body', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  //点击隐藏overlay
  $('body').on('tap.navigate', '#overlay', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.navigate-body').translate({
      duration: 0.3,
      value: '100%',
      callback: function () {
        $('#overlay').hide();
      }
    });
  });
  $('.filter-layer').on('tap', function (e) {
    e.preventDefault();
    e.stopPropagation();
    // hideFilterLayer();
  });
});
