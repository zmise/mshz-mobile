require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/plugins/jquery.photo.album.js');

$(function () {

  function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURI(r[2]); //处理中文乱码
    return null; //返回参数值
  }
  // 房源图片的get请求
  // var imageIndex = parseInt(getUrlParam('imageIndex'));
  // console.log(imageIndex);
  // 向模板中导入全局变量
  // template.defaults.imports.$typeIndex = parseInt(getUrlParam('typeIndex'));
  // template.defaults.imports.$itemIndex = parseInt(getUrlParam('itemIndex')) + 1;
  // $.ajax();
  // console.log(getUrlParam('houseId'));
  // console.log(parseInt(getUrlParam('id')));
  var id = getUrlParam('id');

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
                '  <img src="' + item.replace('{size}', '750x422') + '" />' +
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

          str += '<section class="photo-tabs">';

          var itemNumber = 0;
          for (var i = 0; i < array.length; i++) {
            str +=
              '  <a class="items" href="javascript:;" data-number="' + itemNumber + '">' + array[i].imageType + '&nbsp;(' + array[i].imageUrlList.length + ')</a>'
              ;
            itemNumber += array[i].imageUrlList.length;
          }


          str += '</section>'
            ;
          $('#content').html(str);

          $('.title').html('<span>房源相册 ' + '<i class="num">1</i>/' + totalImg + '</span>');
          $('.photo-tabs .items').eq(0).addClass('current');
          /* 通过图片下标设置标题 */
          function getTitle(index) {
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
                }
              }
              if (_flag) {
                break;
              } else {
                index = index - $('.types').eq(idx).find('.items').length;
              }
            }
            console.log(indexNum)
            indexNum += _cur;
            // $('.title').html('<span>房源相册 ' + '<i class="num">' + _cur + '/' + _sum + '</i></span>');
            $('.num').text(indexNum);
          };

          /* 通过点击类型Tab获得图片下标 */
          function getSubscript(number) {
            var _index = 0;
            for (var i = 0; i < number; i++) {
              _index += $('.types').eq(i).find('.items').length;
            }
            return _index;
          }


          var photo = $('.photo-body').phototAlbum({
            width: $(window).width(),
            height: $(window).height(),
            pagination: false,
            index: 0,
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


          // $('back').on('touchstart', function (e) {
          //   e.preventDefault();
          //   e.stopPropagation();
          // });

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
    console.log(11)
    history.go(-1)
  });


  $('#back').on('touchend', function (e) {
    e.preventDefault();
    e.stopPropagation();
    history.go(-1)
  });
  // var data = {
  //   // 'typeIndex': typeIndex,
  //   // 'itemIndex': itemIndex + 1,
  //   'status': 0,
  //   'data': [{
  //       'imageType': '房源图',
  //       'imageUrlList': ['img/1.png', 'img/2.png']
  //     },
  //     {
  //       'imageType': '小区图',
  //       'imageUrlList': ['img/3.png', 'img/4.png', 'img/5.png']
  //     }
  //   ]
  // };
  // var html = template('tpl-data', data);
  // $('#content').html(html);

});
