require('./index.scss');
require('../../assets/js/analytics.js');

require('../../assets/js/plugins.js');
require('../../assets/plugins/jquery.banner.js');
var toast = require('../../assets/js/toast.js');  //toast的事件
require('../../assets/js/zoomify.js'); // 查看大图
require('../../assets/js/record'); //判断无痕模式
var picture = require('../../assets/img/picture-loading.png');
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
  // 猜你喜欢get接口
  function guessLikeInfo(params) {
    $.ajax({
      url: '/mshz-app/room/maybeLike',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          var data = res.result.items;

          if (data.length > 0) {
            var listHTML = '<div class="title">你可能喜欢</div>' +
              '  <div class="slide-body" js-plugin="slide" id="guessLike">' +
              '    <div class="slide">';

            for (var i = 0; i < data.length; i++) {
              var item = data[i];
              listHTML +=
                '<a class="items" href="/houseDetails?id=' + item.id + '">' +
                '  <img src="' + picture + '" data-src="' + item.mainPicture.replace('{size}', '200x100') + '" lazyload />' +
                '  <div class="oneline">' +
                '    <p>' + item.title + '</p>' +
                '    <p>¥' + item.price + '</p>' +
                '  </div>' +
                '  <div class="twoline">' +
                '    <i class="twoline-items">' + item.region + '</i>' +
                '    <i class="twoline-items">' + item.roomCount + '居 ' + item.area + '平</i>' +
                '    <i class="twoline-items">' + item.customerCount + '人</i>' +
                '  </div>' +
                '</a>';
            }

            listHTML += '</div></div>';
            $('#guessLikeWrapper').empty().append(listHTML);
            $('#guessLike').slide();
            $.lazyload();
          }
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }

  //增加用户收藏房源post接口
  function addUserCollectRoom(params, el) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/security/userinfo/addUserCollectRoom',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          toast.show('收藏房源成功！');
          $(el).removeClass('icon-weitianchongaixin').addClass('icon-dianzan');
          $(el).toggleClass('clc-red').data('status', 'collect');
        } else {
          toast.show(res.message);
        }
      },
      error: function (error) {
        window.sessionStorage.setItem('lastLocation', location.href);
        location.replace('/user/login.html');
      }
    });
  }

  //删除用户收藏房源post接口
  function deleteUserCollectRoom(params, el) {
    console.log(params)
    $.ajax({
      url: '/mshz-app/security/userinfo/deleteUserCollectRoom',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          toast.show('取消收藏房源成功！');
          $(el).removeClass('icon-dianzan').addClass('icon-weitianchongaixin');
          $(el).toggleClass('clc-red').data('status', '');
        } else {
          toast.show(res.message);
        }
      },
      error: function (error) {
        window.sessionStorage.setItem('lastLocation', location.href);
        location.replace('/user/login.html');
      }
    });
  }


  // /* switch header */
  // function switchHeader() {
  //   var _hig = $('.banner-body').height();
  //   if ($(document).scrollTop() > _hig) {
  //     $('.header-body').show();
  //   } else {
  //     $('.header-body').hide();
  //   }
  // };
  // /* switch header   */
  // var timeoutObject;
  // $(document).on('scroll.header', function () {
  //   if (timeoutObject) {
  //     clearTimeout(timeoutObject);
  //   }
  //   timeoutObject = setTimeout(switchHeader, 30);
  // });


  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }
  var startDate = getUrlParam('startDate');
  var endDate = getUrlParam('endDate');

  //猜你喜欢的渲染数据
  var guessLikeArray = [];
  if (typeof window.localStorage.getItem('guessLike') === 'string') {
    guessLikeArray = JSON.parse(window.localStorage.getItem('guessLike')) || [];
  }

  var guessLike = {
    price: $('#price').val(),
    situationId: $('#situation').val(),
  }

  var flag = 0;
  var priceHigh = $('#price').val() || 0;
  var priceLow = priceHigh;
  var situationId = $('#situation').val();
  for (var i = 0; i < guessLikeArray.length; i++) {
    var item = guessLikeArray[i];
    var num = 0;
    if (!isNaN(guessLikeArray[i].price)) {
      num = guessLikeArray[i].price;
    }

    if (guessLike.situationId === item.situationId) {
      guessLikeArray.splice(i, 1);
    }

    priceHigh = Math.max(num, priceHigh); // 取最大值
    priceLow = Math.min(num, priceLow); // 取最小值
  }
  guessLikeArray.push(guessLike);

  if (guessLikeArray.length > 20) {
    guessLikeArray.shift();
  }
  window.localStorage.setItem('guessLike', JSON.stringify(guessLikeArray), true);
  var guessLikeParams = {
    city: $('#city').val(),
    region: $('#area').val(),
    priceHigh: priceHigh,
    priceLow: priceLow,
    situationId: situationId
  }

  guessLikeInfo(guessLikeParams);



  $('.banner-body').on('click', '#collect', function (e) {
    event.preventDefault();
    event.stopPropagation();
    var status = $(this).data('status');
    var params = {
      situationId: $('#situation').val(),
    };
    if (status === 'collect') {
      // $(this).attr('data-status', '');
      deleteUserCollectRoom(params, this);
    } else {
      // $(this).attr('data-status', 'collect');
      addUserCollectRoom(params, this);
    }
  });

  $('#orderCheck-entry').on('tap', function (e) {
    event.preventDefault();
    event.stopPropagation();
    if (startDate !== '' && endDate !== '') {
      window.location = '/user/order-check.html?roomId=' + $('#roomId').val() + '&startDate=' + startDate + '&endDate=' + endDate;
    } else {
      window.location = '/user/order-check.html?roomId=' + $('#roomId').val();
    }
  });




  $('.house-base-info .base-server .icon-items:gt(4)').addClass('hide');
  /* 焦点图片  */
  $('.banner-body').banner({
    'width': $(window).width(),
    'height': $(window).width() * 2 / 3,
    'paginationType': 'fraction'
  });


  /* 判断详情内容是否大于100  */

  if ($.trim($('#houseDes').text()).length > 100) {
    $('#more').removeClass('hide');
    $('#houseDes').addClass('zmise');
  }
  /* 点击展开全部  */
  $('.house-base-info .house-des').on('tap', '.more', function (e) {
    event.preventDefault();
    event.stopPropagation();
    $('#houseDes').toggleClass('zmise');
    if ($(this).find('span').text() === '展开全部') {
      $(this).find('span').text('收起');
      $(this).find('i').css('transform', 'rotate(180deg)')
    } else {
      $(this).find('span').text('展开全部');
      $(this).find('i').css('transform', 'rotate(0)')
    }
  });

  /* 点击展开全部  */
  $('.house-base-info .base-server').on('tap', '.more', function (e) {
    event.preventDefault();
    event.stopPropagation();
    $('.house-base-info .base-server .icon-items:gt(4)').toggleClass('hide');
    if ($(this).find('span').text() === '展开全部') {
      $(this).find('span').text('收起');
      $(this).find('i').css('transform', 'rotate(180deg)')
    } else {
      $(this).find('span').text('展开全部');
      $(this).find('i').css('transform', 'rotate(0)')
    }
  });




  /* 点击联系管家  */
  $('#tel-major').on('click', function (e) {
    event.preventDefault();
    event.stopPropagation();
    $('#overlay').css('display', 'flex');
  });

  $('#overlay').on('tap', '.items', function (e) {
    event.stopPropagation();
    event.preventDefault();
    window.location = 'tel:' + $(this).find('.tel').text();
    $('#overlay').hide();
  });
  $('#overlay').on('tap', function (e) {
    event.stopPropagation();
    event.preventDefault();
    $('#overlay').hide();

  });


  $('.img-list img').zoomify();

  // 查看大图阻止冒泡
  $('.img-list').on('tap', '.zoomify', function (e) {
    e.stopPropagation();
  });
});
