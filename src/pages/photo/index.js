require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/plugins/jquery.photo.album.js');

$(function () {
  // function queryPicsBySituationId(params) {
  //   $.ajax({
  //     url: '/mshz-app/room/queryPicsBySituationId',
  //     data: params,
  //     dataType: 'json',
  //     type: 'GET',
  //     cache: false,
  //     success: function (res) {
  //       if (res.status === 'C0000') {
  //         var item = res.result;
  //         var str =
  //           '<section class="photo-body">' +
  //           '  <div class="container">'
  //           ;
  //         for (var i = 0; i < item.length; i++) {
  //           str += '<ul class="types">';
  //           for (var j = 0; j < item[i].imageUrlList.length; j++) {
  //             str +=
  //               '<li class="items">' +
  //               '  <img src="./img/pictrue-loading-banner.png" data-src="img/1.png" jslazy />' +
  //               '  <a class="back" href="javascript:;"></a>' +
  //               '</li>'
  //               ;
  //           }
  //           str += '</ul>';

  //         }
  //         str +=
  //           '  </div>' +
  //           '</section>'
  //           ;
  //         $('body').prepend(str);

  //       }
  //     },
  //     error: function (error) {
  //       console.log(error);
  //       console.log('error');
  //     }
  //   });

  // }
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
  var id = parseInt(getUrlParam('id'));
  // console.log(getUrlParam('houseId'));
  // console.log(parseInt(getUrlParam('id')));
  // 轮播图
  $.ajax({
    url: '/mshz-app/room/queryPicsBySituationId',
    data: {
      id: id,
    },
    dataType: 'json',
    type: 'GET',
    success: function (data) {
      console.log(data);
      var str =
        '<section class="photo-body">' +
        '  <div class="container">'
        ;
      for (var i = 0; i < item.length; i++) {
        str += '<ul class="types">';
        for (var j = 0; j < item[i].imageUrlList.length; j++) {
          str +=
            '<li class="items">' +
            '  <img src="./img/pictrue-loading-banner.png" data-src="img/1.png" jslazy />' +
            '  <a class="back" href="javascript:;"></a>' +
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
        '  <p class="title"><span>1/</span>2</p>' +
        '</section>';

      str +=
        '<section class="photo-tabs">' +
        '  <a class="items current" href="javascript:;">房源图&nbsp;&nbsp;(1)</a>' +
        '  <a class="items" href="javascript:;">小区图&nbsp;&nbsp;(3)</a>' +
        '</section>'
        ;

      $('#content').html(html);

      /* 通过图片下标设置标题 */
      function getTitle(index) {
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
        $('.title').html('<span>' + _cur + '/</span> ' + _sum);
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
        index: imageIndex - 1,
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
      });

      /* 按下返回按钮事件 */
      $('#back').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(11)
        history.go(-1)
      });
      // $('back').on('touchstart', function (e) {
      //   e.preventDefault();
      //   e.stopPropagation();
      // });

      $('#back').on('touchend', function (e) {
        e.preventDefault();
        e.stopPropagation();
        history.go(-1)
      });
    }
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
