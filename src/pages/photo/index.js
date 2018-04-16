require('./index.scss');
require('../../assets/js/analytics.js');

require('../../assets/js/plugins.js');
require('../../assets/plugins/jquery.photo.album.js');
var picture = require('../../assets/img/picture-loading.png');

$(function () {

  function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURI(r[2]); //处理中文乱码
    return null; //返回参数值
  }


  var id = getUrlParam('id');
  var imageIndex = getUrlParam('imageIndex'); // 总数的第几
  var typeIndex = getUrlParam('typeIndex'); // 第几个类型
  var itemIndex = getUrlParam('itemIndex'); // 类型中的第几张
  if (id) {
    $.ajax({
      url: '/mshz-app/room/queryPicsBySituationId',
      data: {
        id: id,
      },
      dataType: 'json',
      type: 'GET',
      success: function (res) {
        if (res.status === 'C0000') {
          var array = res.result;
          var totalImg = 0;
          var str =
            '<section class="photo-body">' +
            '  <div class="container">'
            ;
          for (var i = 0; i < array.length; i++) {
            str += '<ul class="types" data-length="' + totalImg + '">';
            totalImg += array[i].imageUrlList.length;
            for (var j = 0; j < array[i].imageUrlList.length; j++) {
              var item = array[i].imageUrlList[j];
              str +=
                '<li class="items" data-index="' + (j - 0 + 1) + '">' +
                '<div class="img">' +
                '  <img src=' + picture + ' data-src="' + item.replace('{size}', '750x422') + '" lazyload/>' +
                '</div>' +
                '</li>'
                ;
            }
            str += '</ul>';

          }
          str +=
            '  </div>' +
            '</section>'
            ;

          str +=
            '<section class="photo-numbers">' +
            '  <p class="title">' +
            '    <span>房源相册' +
            '    <i class="num">1/2</i>' +
            '    </span>' +
            '  </p>' +
            '</section>';

          str +=
            '<section class="photo-tabs" js-plugin="slide" id="slide">' +
            '    <div class="slide">'
            ;

          var itemNumber = 0;
          for (var i = 0; i < array.length; i++) {
            if (parseInt(typeIndex) === i) {
              str +=
                '  <li class="items current" href="javascript:;" data-number="' + itemNumber + '">' + array[i].imageType + '&nbsp;(' + array[i].imageUrlList.length + ')</li>'
                ;
            } else {
              str +=
                '  <li class="items " href="javascript:;" data-number="' + itemNumber + '">' + array[i].imageType + '&nbsp;(' + array[i].imageUrlList.length + ')</li>'
                ;
            }


            itemNumber += array[i].imageUrlList.length;
          }


          str +=
            '    </div>' +
            '</section >';
          $('#content').html(str);
          $.lazyload();
          //初始化 滑动
          $('#slide').slide();
          $('.title').html('<span>房源相册 ' + '<i class="num">' + (+imageIndex + 1) + '</i>/ ' + totalImg + '</span>');
          /* 通过图片下标设置标题 */
          //高亮居中
          var $curItem = $('.slide li:eq(' + typeIndex + ')');
          var $wrapper = $('#slide');
          $wrapper.scrollLeft($curItem.position().left - $wrapper.width() / 2 + $curItem.width() / 2);
          function getTitle(index) {
            $('.num').text(index + 1);
            var indexNum = $('.types').eq(index).data('length');
            var _txt = '';
            var _cur = 1;
            var _sum = 1;
            var _flag = false;
            for (var idx = 0; idx < $('.types').length; idx++) {
              for (var i = 0; i < $('.types').eq(idx).find('.items').length; i++) {
                if (index === i) {
                  _flag = true;
                  _cur = i + 1;
                  _sum = $('.types').eq(idx).find('.items').length;
                  _txt = $('.photo-tabs').find('.items').eq(idx).text();
                  $('.photo-tabs').find('.items').eq(idx).addClass('current').siblings().removeClass('current');
                  var $curItem = $('.slide li:eq(' + idx + ')');
                  $wrapper.scrollLeft($wrapper.scrollLeft() + $curItem.position().left - $wrapper.width() / 2 + $curItem.width() / 2);
                }
              }
              if (_flag) {
                break;
              } else {
                index = index - $('.types').eq(idx).find('.items').length;
              }
            }
          };

          /* 通过点击类型Tab获得图片下标 */
          function getSubscript(number) {
            var _index = 0;
            for (var i = 0; i < number; i++) {
              _index += $('.types').eq(i).find('.items').length;
            }
            return _index;
          }
          //当前点进去的图片 位于相册的位置的序号
          var firstIndex = +$('.types').eq(typeIndex).data('length') + +itemIndex;

          var photo = $('.photo-body').phototAlbum({
            width: $(window).width(),
            height: $(window).height(),
            pagination: false,
            index: firstIndex,
            callback: function (i) {
              getTitle(i);
            },
          });


          /* 图片类型点击事件 */
          $('.photo-tabs').find('.items').on('tap', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!$(this).hasClass('current')) {
              $(this).addClass('current').siblings().removeClass('current');
              photo.goto(getSubscript($(this).index()));
            }
            $('.num').text(($(this).data('number') - 0 + 1));

          });

        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }
  // 轮播图


  /* 按下返回按钮事件 */
  $('#back').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    history.go(-1)
  });


  $('#back').on('touchend', function (e) {
    e.preventDefault();
    e.stopPropagation();
    history.go(-1)
  });

});
