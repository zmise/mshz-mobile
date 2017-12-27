$(function () {
  /* 阻止滚动条事件  */
  $('.search-layer').on('touchmove', function (e) {
    e.preventDefault();
  });

  /* 进入搜索页 */
  $('#search-entry').on('tap', function (e) {
    $('.search-layer').show();
  });

  /* 取消搜索  */
  $('#search-cancel').on('tap', function (e) {
    e.stopPropagation();
    $(this).closest('.search-layer').hide();
  });

  /* 当搜索框内容不为空时显示清空按钮 */
  $('.search-body .text').on('input', function (e) {
    if ($.trim($(this).val()) == '') {
      $(this).next('.clear-text').hide();
    } else {
      $(this).next('.clear-text').show();
    }
  });

  /* 清空搜索框内容 */
  $('.search-body .clear-text').on('tap', function (e) {
    e.stopPropagation();
    $(this).prev('.text').val('');
    $(this).hide();
  });

  /* 打开下拉类型列表  */
  $('.search-body .type').on('tap', function (e) {
    e.stopPropagation();
    if ($(this).next('.select').css('display') === 'none') {
      $(this).next('.select').show();
    } else {
      $(this).next('.select').hide();
    }
  });

  /* 关闭下拉类型列表  */
  $(document).on('tap.searchType', function (e) {
    $('.search-body .select').hide();
  });

  /* 切换类型  */
  $('.search-body .option').on('tap', function (e) {
    e.stopPropagation();
    $(this).closest('.search-body').find('.type .txt').text($(this).text());
    $('.search-body .select').hide();
  });

});
