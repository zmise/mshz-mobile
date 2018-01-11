require('../plugins/jquery.double.range.js');

$(function () {
  var timeoutObject = null;
  var $filterLayer = $('.filter-layer');
  var $filterBody = $('.filter-body');
  var $filterList = $('.filter-list');
  var $overlay = $('#overlay');
  var $range = $('.range');

  /* 双向滑块 */
  var _range = null;

  /* 显示筛选层   */
  function showFilterLayer(index) {
    $('body,html').css({ 'overflow': 'hidden' });
    $overlay.show();
    $filterLayer.slideDown(200);
    $filterList.hide().eq(index).show();
    $filterLayer.find('.filter-body .mostjs:eq(' + index + ')').addClass('current').siblings().removeClass('current');
    if (index === 0) {
      // $filterLayer.find('.filter-list .two-row').css('display', 'none').eq(0).css('display', 'block');
    }
    if (index === 2) {
      _range = $range.doubleRange({
        minValue: 0,
        maxValue: 21,
        unitValue: 50,
        firstValue: 0,
        lastValue: 21
      });
    }
  };

  /* 隐藏筛选层   */
  function hideFilterLayer() {
    $('body,html').css({ 'overflow': 'visible' });
    $filterLayer.hide();
    $filterList.hide();
    $overlay.hide();
  };

  /* 滚动筛选居顶    */
  function filterScrollTop() {
    var _headerHeight = $('.header-body').outerHeight(true) || 0;
    var _searchHeight = $('.search-body').outerHeight(true) || 0;
    var _filterTopSize = _headerHeight + _searchHeight;
    var _filterHeight = $filterBody.outerHeight(true);
    if ($(document).scrollTop() >= _filterTopSize) {
      $('.filter-body:first').css('position', 'fixed');
      $('.article-body').css('margin-top', _filterHeight);
    } else {
      $('.filter-body:first').css('position', 'relative');
      $('.article-body').css('margin-top', 0);
    }
  };

  /* scroll.filter  */
  $(document).on('scroll.filter', function () {
    if (timeoutObject) {
      clearTimeout(timeoutObject);
    }
    timeoutObject = setTimeout(function () {
      filterScrollTop();
    }, 30);
  });

  /* 阻止滚动条事件  */
  $overlay.on('touchmove.filter', function (e) {
    e.stopPropagation();
    e.preventDefault();

  });

  /* 阻止滚动条事件  */
  $filterLayer.on('touchmove.filter', function (e) {
    e.preventDefault();
    e.stopPropagation();

  });



  /* close的tap事件  */
  $('#close').on('tap', function (e) {
    e.stopPropagation();
    hideFilterLayer();
  });

  /* overlay的tap事件  */
  $overlay.on('tap', function (e) {
    e.stopPropagation();
    hideFilterLayer();
  });


  /* 切换筛选项   */
  $filterBody.on('tap', '.mostjs', function (e) {
    e.stopPropagation();
    // $('.filter-body .items').eq($(this).index()).addClass('current').siblings().removeClass('current');

    if ($(this).hasClass('current') && $filterLayer.css('display') !== 'none') {
      hideFilterLayer();
    } else {
      // debugger
      showFilterLayer($(this).index() - 1);
    }
  });
  /* 单选事件 */
  $filterList.on('tap', '.items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('current').siblings().removeClass('current');

  });

  /* 多选事件 */
  $filterList.on('tap', '.more-sel-items', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).toggleClass('current');
    $(this).find('.icon').toggleClass('current');
    $(this).closest('.items-box').find('.current').text();

  });



  // params.page = 1;

  /* 排序事件 */
  // $('.twolist .items').on('tap', function (e) {
  //   e.stopPropagation();
  //   hideFilterLayer();
  // });


  /* 条件搜索的ajax事件 */
});
