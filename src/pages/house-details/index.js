require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/plugins/jquery.banner.js');




$(function () {
  $('.house-base-info .base-server .icon-items:gt(4)').addClass('hide');
  /* 焦点图片  */
  $('.banner-body').banner({
    'width': $(window).width(),
    'height': $(window).width() * 2 / 3,
    'paginationType': 'fraction'
  });

  /* switch header */
  function switchHeader() {
    var _hig = $('.banner-body').height();
    if ($(document).scrollTop() > _hig) {
      $('.header-body').show();
    } else {
      $('.header-body').hide();
    }
  };



  // 猜你喜欢get接口
  function guessLikeInfo(params) {

    console.log(params);
    $.ajax({
      url: '/mshz-app/room/maybeLike',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (data) {
        console.log('success');
        console.log(data);
        if (data.status === 'C0000') {
          var json = data.result.items;
          console.log(json);
          var str = '';
          for (var i = 0; i < json.length - 1; i++) {
            str +=
              '<a href="/houseDetails?id=' + json.id + '">' +
              '<img class="items " src="' + json.mainPicture.replace('{size}', '600x350') + '">' +
              '<div class="oneline">' +
              '<p>' + json.title + '</p>' +
              '<p>¥' + json.price + '</p>' +
              '</div>' +
              '<div class="twoline">' +
              '<i class="twoline-items" href="javascript:;">$' + json.cityName + '</i>' +
              '<i class="twoline-items" href="javascript:;">' + json.houseType + '' + json.area + '平</i>' +
              '<i class="twoline-items" href="javascript:;">' + json.customerCount + '人</i>' +
              '</div>' +
              '</a>'
              ;
          }
          $('#guessLike').empty().append(str);

        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }



  /* switch header   */
  var timeoutObject;
  $(document).on('scroll.header', function () {
    if (timeoutObject) {
      clearTimeout(timeoutObject);
    }
    timeoutObject = setTimeout(switchHeader, 30);
  });


  /* 点击展开全部  */
  $('.house-base-info .base-server').on('tap', '.more', function (e) {
    e.stopPropagation();
    $('.house-base-info .base-server .icon-items:gt(4)').toggleClass('hide');
  });

  /* 点击切换喜欢收藏  */
  $('.banner-body').on('tap', '.collect', function (e) {
    e.stopPropagation();
    $(this).toggleClass('clc-red');
  });

  //猜你喜欢的渲染数据
  var guessLikeArray = JSON.parse(window.localStorage.getItem('guessLike')) || [];

  var guessLike = {
    price: $('#price').val(),
    situation: $('#situation').val(),
  }

  var flag = 0;
  var priceHigh = $('#price').val();
  var priceLow = priceHigh;
  var situationId = $('#situation').val();
  for (var i = 0; i < guessLikeArray.length; i++) {
    var item = guessLikeArray[i];
    var num = guessLikeArray[i].price;

    if (guessLike.situation === item.situation) {
      guessLikeArray.splice(i, 1);
    }

    priceHigh = Math.max(num, priceHigh); // 取最大值
    priceLow = Math.min(num, priceLow); // 取最小值


  }
  guessLikeArray.push(guessLike);

  if (guessLikeArray.length > 50) {
    guessLikeArray.shift();
  }
  window.localStorage.setItem('guessLike', JSON.stringify(guessLikeArray));
  var guessLikeParams = {
    city: $('#city').val(),
    region: $('#area').val(),
    priceHigh: priceHigh,
    priceLow: priceLow,
    situationId: situationId,
  }
  guessLikeInfo()

  // window.localStorage.setItem('guessLike', guessLike);
});
