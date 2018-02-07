require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/plugins/jquery.banner.js');
require('../../assets/js/toast.js');  //toast的事件
require('../../assets/js/zoomify.js'); // 查看大图




$(function () {
  // 初始化的弹出的toast框
  function showMessage(content, duration, isCenter, animateIn, animateOut) {
    var animateIn = animateIn;
    var animateOut = animateOut;
    var content = content;
    var duration = duration;
    var isCenter = isCenter;
    $('body').toast({
      position: 'fixed',
      animateIn: animateIn,
      animateOut: animateOut,
      content: content,
      duration: duration,
      isCenter: isCenter,
    });
  }

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
                '<a href="/houseDetails?id=' + item.id + '">' +
                '  <img class="items" src="' + item.mainPicture.replace('{size}', '200x100') + '">' +
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
          }
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });

  }

  // 确认房源是否被收藏get接口
  // function queryRoomIsAlready(params) {
  //   console.log(params)
  //   $.ajax({
  //     url: '/mshz-app/security/userinfo/queryRoomIsAlready',
  //     data: params,
  //     dataType: 'json',
  //     type: 'GET',
  //     cache: false,
  //     success: function (res) {
  //       if (res.status === 'C0000') {
  //         if (res.result) {
  //           $('#collect').attr('data-status', 'collect').addClass('clc-red');
  //           /* 登录过后点击切换喜欢收藏  */
  //           $('.banner-body').on('click', '#collect', function (e) {
  //             event.preventDefault();
  //             event.stopPropagation();
  //             $(this).toggleClass('clc-red');
  //             var status = $(this).data('status');
  //             var params = {
  //               situationId: $(this).data('situationId'),
  //             };
  //             if (status === 'collect') {
  //               $(this).attr('data-status', '');
  //               deleteUserCollectRoom(params);
  //             } else {
  //               $(this).attr('data-status', 'collect');
  //               addUserCollectRoom(params);
  //             }
  //           });
  //         } else {
  //           $('#collect').attr('data-status', '');
  //           $('.banner-body').on('click', '#collect', function (e) {
  //             event.preventDefault();
  //             event.stopPropagation();
  //             showMessage('后台处理没有成功收藏');
  //           });
  //         }
  //       }
  //     },
  //     error: function (error) {
  //       console.log(error);
  //       console.log('error');
  //     }
  //   });

  // }

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
          showMessage('收藏房源成功！');
          $(el).toggleClass('clc-red').data('status', 'collect');
        } else {
          showMessage(res.message);
        }
      },
      error: function (error) {
        sessionStorage.setItem('lastLocation', location.href);
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
          showMessage('取消收藏房源成功！');
          $(el).toggleClass('clc-red').data('status', '');
        } else {
          showMessage(res.message);
        }
      },
      error: function (error) {
        sessionStorage.setItem('lastLocation', location.href);
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
  var priceHigh = $('#price').val();
  var priceLow = priceHigh;
  var situationId = $('#situation').val();
  for (var i = 0; i < guessLikeArray.length; i++) {
    var item = guessLikeArray[i];
    var num = guessLikeArray[i].price;

    if (guessLike.situationId === item.situationId) {
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
    situationId: situationId
  }

  guessLikeInfo(guessLikeParams);


  // var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
  // if (loginInfo) {

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
    window.location = '/user/order-check.html?roomId=' + $('#roomId').val();
  });
  // } else {
  //   /* 没有登录点击收藏  */
  //   $('.banner-body').on('click', '#collect', function (e) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     sessionStorage.setItem('lastLocation', location.href);
  //     window.location = '/user/login.html';
  //   });

  //   $('#orderCheck-entry').on('tap', function (e) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     sessionStorage.setItem('lastLocation', location.href);
  //     window.location = '/user/login.html';
  //   });
  // }




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
