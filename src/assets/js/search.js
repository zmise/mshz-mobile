$(function () {
  /* 阻止滚动条事件  */
  $('.search-layer').on('touchmove', function (e) {
    e.preventDefault();
  });



  /* 返回首页  */
  $('#search-cancel').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).closest('.search-layer').hide();
    $('body,html').css({ 'overflow': 'visible' });
    // $('#search-entry').val($('.text-body .text').val());
  });

  /* 点击search-keyword给input输入文本并切换 search-list */
  $('.search-layer').on('tap', '.keywords .items', function (e) {
    e.stopPropagation();
    e.preventDefault();
    // console.log($(this).closest('.search-layer').html());
    $(this).closest('.search-layer').find('.search-body .text-body .text').val($(this).text());

    $(this).closest('.search-layer').hide();
    $('body,html').css({ 'overflow': 'visible' });

    $('#search-entry').val($(this).text());

    // $('.search-layer .search-keyword').hide();
    // var newListHTML = search();
    // $('.search-list .slide').empty().append(newListHTML)
    // $('.search-layer .search-list').show();
  });

  /* 点击search-list给input输入文本 */
  // $('.search-list').on('tap', '.slide .items', function (e) {
  //   e.stopPropagation();
  //   // $(this).closest('.search-layer').find('.search-body .text-body .text').val($(this).find('.txt').text());

  // });

  /* 当搜索框内容不为空时显示清空按钮 */
  $('.search-body').on('input', '.text-body .text', function (e) {
    if ($.trim($(this).val()) == '') {
      $('.search-layer .search-keyword').show();
      $('.search-layer .search-list').hide();
    } else {
      $('.search-layer .search-keyword').hide();
      $('.search-layer .search-list').show();
    }
  });


  /* 当搜索框的模糊查询 */

  $('.search-body').on('input', '.text-body .text', function () {
    var keyword = $.trim($(this).val());//去除空格
    if (keyword.length > 0) {
      search(keyword);
    } else {
      $(".sea").html('');
    }
  })

  /* 模糊查询列表的ajax */

  //todo
  function search(keyword) {
    var city = $('#destination-entry').val();
    // console.log(city);
    $.ajax({
      url: '/mshz-app/room/darkSelectRimInfo',
      data: {
        'city': $('#destination-entry').val(),
        'name': keyword,
      },
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        // console.log('success');
        var json = data.result;
        // console.log(json);
        var str = '';
        for (var i = 0; i < json.length; i++) {
          str += '<a class="items" href="javascript:;" data-keyword="' + json[i].name + '"><div class="txt-icon"><i class="icon iconfont icon-sousuoliebiao"></i><span class="txt">' + json[i].name + '</span></div><span class="icon-goto">' + json[i].pointTypeName + '</span></a>';
        }
        $('.search-list .slide').empty().append(str);
      },
      error: function (error) {
        console.log(error);
        console.log('error');

      }
    });
  }
  /* ???? */

  $('.search-list').on('tap', '.slide .items', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).closest('.search-layer').hide();
    $('body,html').css({ 'overflow': 'visible' });
    $('#search-entry').val($(this).data('keyword'));
    var searchHistroy = JSON.parse(window.localStorage.getItem('searchHistroy')) || [];
    for (var i = 0; i < searchHistroy.length; i++) {
      var item = searchHistroy[i];
      if (item == $(this).text()) {
        searchHistroy.splice(i, 1);
      }
    }
    searchHistroy.push($(this).text());
    window.localStorage.setItem('searchHistroy', JSON.stringify(searchHistroy));
  });

  /* ??? */
  $('.search-body ').on('tap', '.text-body .search-close ', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).closest('.text-body').find('.text').val('');
    $('.search-layer .search-keyword').show();
    $('.search-layer .search-list').hide();
  });


});
