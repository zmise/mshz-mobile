$(function () {
  /* 阻止滚动条事件  */
  $('.search-layer').on('touchmove', function (e) {
    e.preventDefault();
  });

  /* 进入搜索页 */
  $('#search-entry').on('tap', function (e) {
    $('.search-layer').show();
    $('body,html').css({ 'overflow': 'hidden' });

  });

  /* 返回首页  */
  $('#search-cancel').on('tap', function (e) {
    e.stopPropagation();
    $(this).closest('.search-layer').hide();
    $('body,html').css({ 'overflow': 'visible' });
    $('#search-entry').val($(this).closest('.search-body').find('.text-body .text').val());
  });

  /* 点击search-keyword给input输入文本并切换 search-list */
  $('.search-layer .keywords .items').on('tap', function (e) {
    e.stopPropagation();
    // console.log($(this).closest('.search-layer').html());
    $(this).closest('.search-layer').find('.search-body .text-body .text').val($(this).text());
    $('.search-layer .search-keyword').hide();
    $('.search-layer .search-list').show();
  });
  /* 点击search-list给input输入文本 */
  $('.search-list .slide .items').on('tap', function (e) {
    e.stopPropagation();
    $(this).closest('.search-layer').find('.search-body .text-body .text').val($(this).find('.txt').text());
  });

  /* 当搜索框内容不为空时显示清空按钮 */
  $('.text-body .text').on('input', function (e) {
    if ($.trim($(this).val()) == '') {
      $('.search-layer .search-keyword').show();
      $('.search-layer .search-list').hide();
    } else {
      $('.search-layer .search-keyword').hide();
      $('.search-layer .search-list').show();
    }
  });


  /* 当搜索框的模糊查询 */

  $(".text-body .text").bind("input", function () {
    console.log($(this).val());

    if ($(this).val().length > 0) {
      var newListHTML = search();
      $('.search-list .slide').empty().append(newListHTML);
    } else {
      $(".sea").html('');
    }
  })

  function search() {
    console.log($(".text-body .text").val());
    $.ajax({
      url: '/api/room/darkSelectRimInfo',
      data: {
        'city': 'KUNMING',
        'name': $(".text-body .text").val()
      },
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        //转换成json对象  
        console.log(data)
        // eval("var json=" + data);
        // //console.log(json)  
        // var str = "";
        // for (var i = 0; i < json.length; i++) {
        //   str += "<li>" + json[i].sea + "</li>";
        // }
        // $(".sea").html(str);
      }
    })
  }


  // /* 清空搜索框内容 */
  // $('.search-body .clear-text').on('tap', function (e) {
  //   e.stopPropagation();
  //   $(this).prev('.text').val('');
  //   $(this).hide();
  // });

  // /* 打开下拉类型列表  */
  // $('.search-body .type').on('tap', function (e) {
  //   e.stopPropagation();
  //   if ($(this).next('.select').css('display') === 'none') {
  //     $(this).next('.select').show();
  //   } else {
  //     $(this).next('.select').hide();
  //   }
  // });

  // /* 关闭下拉类型列表  */
  // $(document).on('tap.searchType', function (e) {
  //   $('.search-body .select').hide();
  // });

  // /* 切换类型  */
  // $('.search-body .option').on('tap', function (e) {
  //   e.stopPropagation();
  //   $(this).closest('.search-body').find('.type .txt').text($(this).text());
  //   $('.search-body .select').hide();
  // });

});
