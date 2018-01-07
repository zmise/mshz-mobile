require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');

require('../../assets/js/search.js'); //搜索功能
require('../../assets/js/caledaner.js');//日期插件

require('../../assets/js/filter.js');//筛选功能
require('../../assets/js/appDownload.js');//全局下载APP

var params = {};
$(function () {

  function initParams() {
    params = {
      city: $('#city').val(),
      keyword: $('#search-entry').val(),
      startDate: $('#startDate').val(),
      endDate: $('#endDate').val(),
      poi: $('#poi').val(),
      sortBy: $('#sortBy').val(),
      prices: $('#prices').val(),
      roomCount: $('#roomCount').val(),
      furniture: +$('#furniture').val(),
      page: $('#page').val()
    };
  }

  initParams();


  var sourceData;
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
      $('#firstSelect').val(start + '-' + end);
      params.startDate = start;
      params.endDate = end;
      params.page = 1;
      loadingMore();
    },   //回调函数
    comfireBtn: '.comfire',//确定按钮的class或者id
    startData: params.startDate,
    endData: params.endDate,
    sourceData: sourceData,
  });

  var $filterLayer = $('.filter-layer');
  var $filterList = $('.filter-list');
  var $overlay = $('#overlay');
  function hideFilterLayer() {
    $('body,html').css({ 'overflow': 'visible' });
    $filterLayer.hide();
    $filterList.hide();
    $overlay.hide();
  };
  /* 位置和筛选确定事件 */
  $('.filter-list').on('tap', '.ok', function (e) {
    e.stopPropagation();
    hideFilterLayer();
    var $content = $(this).closest('.filter-list').find('.content');
    var curLayerIndex = $content.find('.one-row .current').index();
    var pText = $content.find('.two-row:eq(' + curLayerIndex + ')').find('.current').text();
    if (pText) {
      $(this).closest('body').find('.filter-body .mostjs:eq(0) .txt').text(pText);
      $('#poi').val(pText);
    } else {
      params.prices = '' || '';
      params.roomCount = $(this).data('sortBy') || '';
      params.furniture = $(this).data('sortBy') || '';
    }
    params.page = 1;
    // params.prices = $(this).data('sortBy') || '';
    // params.roomCount = $(this).data('sortBy') || '';
    // params.poi = $(this).data('sortBy') || '';
    // params.furniture = $(this).data('sortBy') || '';
    //  city: $('#city').val(),
    //     keyword: $('#search-entry').val(),
    //     startDate: $('#startDate').val(),
    //     endDate: $('#endDate').val(),
    //     poi: $('#poi').val(),
    //     sortBy: $('#sortBy').val(),
    //     prices: $('#prices').val(),
    //     roomCount: $('#roomCount').val(),
    //     furniture: +$('#furniture').val(),
    //     page: $('#page').val()

    loadingMore();
  });

  $('.filter-list').on('tap', '.cancel-one', function (e) {
    e.stopPropagation();
    $('.onelist .items').removeClass('current');
    // params.page = 1;
    $('#page').val(1);
    $('#poi').val('');


    // params.poi = '';

  });
  $('.filter-list').on('tap', '.cancel-two', function (e) {
    e.stopPropagation();
    $('.threelist .items').removeClass('current');
    var $mitems = $('.threelist .more-sel-items');

    $mitems.removeClass('current');
    $mitems.find('.icon').removeClass('current');
    // params.page = 1;
    // params.prices = '';
    // params.roomCount = '';
    // params.furniture = '';   
    $('#page').val(1);
    $('#prices').val('');
    $('#roomCount').val('');
    $('#furniture').val('');

  });

  /* 排序层的切换确定事件 */
  $('.filter-layer .twolist').on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    hideFilterLayer();
    $(this).closest('body').find('.filter-body .mostjs:eq(1) .txt').text($(this).text());
    // params.page = 1;
    $('#page').val(1);
    var sortBy = $(this).data('sortBy') || '';
    // console.log(sortBy)
    $('#sortBy').val(sortBy);

    //ajax
    loadingMore();
    // freachloading($(this).text());
  });

  /* loadinging start*/

  var _html = require('../../assets/svg/loading.html');

  $(document).on('scroll.loading', function (e) {
    var _footerHeight = $('.footer-body').outerHeight(true) || 0;
    var _heg = $(document).height() - _footerHeight;

    if ($(this).scrollTop() + $(window).height() < _heg) {
      return;
    }
    if (!$('.loading').length) {
      $('.article-body').append(_html);

      //加载更多请求
      // params.page++;
      var page = $('#page').val() - 0 + 1;
      $('#page').val(page);

      loadingMore();
    }
    $('.loading').show();
    /*setTimeout(function() {
      $('.loading').hide();
    }, 3000);*/
  });

  /* loadinging end*/


  /* loadingMore start*/

  function loadingMore() {
    initParams();
    console.log(params);
    $.ajax({
      // url: 'http://192.168.0.243:51313/mshz-mgr/security/oms/recommend/selectRoom',
      url: 'http://192.168.0.243:51312/mshz-app/room/queryRoom',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        console.log('success');
        var json = data.result.items;
        console.log(json);
        var str = '';
        for (var i = 0; i < json.length; i++) {
          str += '<div class="index-list"><img src="' + json[0].mainPicture + '" alt=""><div class="item-oneline"><p>' + json[0].title + '</p><p>￥' + json[0].price + '</p></div><div class="item-twoline"><i class="twoline-items" href="javascript:;">' + json[0].cityName + '</i><i class="twoline-items" href="javascript:;">' + json[0].houseType + '</i><i class="twoline-items" href="javascript:;">' + json[0].customerCount + '人</i></div><div class="item-threeline"><div class="three-lline"><div class="star-lines"></div><i class="score">' + json[0].rateServer + '分</i></div><div class="three-rline"><i class="twoline-items" href="javascript:;">' + json[0].area + '住过</i><i class="twoline-items" href="javascript:;">' + json[0].commentCount + '条评价</i></div></div></div>';
        }
        $('.recommend-body .mrl_35').append(str);
        $('.loading').remove();

      },
      error: function (error) {
        console.log(error);
        console.log('error');

      }
    });

  }


  /* loadingMore end*/


});
