require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');

require('../../assets/js/plugins.js');
require('../../assets/vendors/iconfont/iconfont.js'); //有色图标
require('../../assets/js/navigate.js');//侧边栏
var toast = require('../../assets/js/toast.js');  //toast的事件



$(function () {

  // 最多可上传图片的张数
  var MAX_IMAGE_COUNT = 6;

  // 评价发布保存post接口
  function saveComment(params) {
    console.log(params);
    $.ajax({
      url: '/mshz-app/security/order/comment/saveComment',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          toast.show('感谢您的评论！');
          setTimeout(function () {
            history.go(-1);
          }, 1500)
        } else {
          toast.show(res.message);
        }
      },
      error: function (error) {
        console.log(error);
      }
    });

  }

  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

  var orderNo = getUrlParam('orderNo');
  var roomId = getUrlParam('roomId');

  // 点击给评分
  $('.assess-star').on('tap', '.star', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).siblings().removeClass('icon-tianchongxingji current').addClass('icon-weitianchongxingji');
    $(this).removeClass('icon-weitianchongxingji').addClass('icon-tianchongxingji current').prevAll().removeClass('icon-weitianchongxingji').addClass('icon-tianchongxingji current');

    $(this).closest('.items').data('score', $(this).index() + 1);

  });

  // 点击上传图片
  $('.assess-commiute').on('change', '.btn-upload', function (e) {
    e.stopPropagation();
    e.preventDefault();

    var uploadedCount = $('.js-uploaded-image').length;
    var fileCount = this.files.length;
    if (fileCount + uploadedCount > MAX_IMAGE_COUNT) {
      toast.show('最多只可上传 ' + MAX_IMAGE_COUNT + ' 张照片，请重新选择！');
      return;
    }

    var deferreds = [];

    for (var i = 0; i < this.files.length; i++) {
      var file = this.files[i];

      // 缓存上传图片的请求对象
      deferreds.push(uploadImage(file, i));
    }

    $.when.apply(null, deferreds).then(function () {
      console.log('upload done.');

      // 移除用过的 file 域，加入新域为下次上传作准备。
      $('#btnUpload').replaceWith('<input class="btn-upload" type="file" name="file" accept="image/*" id="btnUpload" multiple="multiple">');

      // 更新已上传的图片数量
      updateImageCount();
    }).fail(function (err) {
      console.log(err);
      toast.show(err.message);
    });

  });

  function uploadImage(file, index) {
    var dtd = $.Deferred();
    var params = new FormData();
    params.append('file', file, file.name);
    $.ajax({
      url: '/mshz-app/security/order/comment/updateLoadPicture',
      type: 'post',
      contentType: false,
      processData: false,
      data: params
    }).then(function (res) {
      if (res.status === 'C0000') {
        renderImageList(res.result.url);
      } else {
        dtd.reject(new Error(res.message));
      }
    }).done(function () {
      dtd.resolve(index);
    }).fail(function (err) {
      dtd.reject(new Error('上传失败，请检查网络。'));
    });
    return dtd.promise();
  }

  function renderImageList(url, dtd, index) {
    var str =
      '<div class="items">' +
      '<img class="js-uploaded-image" src="' + url.replace('{size}', '100x100') + '" data-url="' + url + '" alt="">' +
      '<i class="remove-image">' +
      '  <svg class="icon" aria-hidden="true">' +
      '    <use xlink:href="#icon-tupianxuanzequxiao"></use>' +
      '  </svg>' +
      '</i>' +
      '</div>';

    $('.img-list').prepend(str);

  }

  function updateImageCount() {
    var count = $('.js-uploaded-image').length;
    console.log('count=', count);
    // 当已上传的图片数量大等于最多可上传的数量时，则隐藏上传按钮。
    $('.js-upload').toggle(count < MAX_IMAGE_COUNT);
    $('.image-count-txt').text(count + '/' + MAX_IMAGE_COUNT);
  }

  // 点击删除图片
  $('.assess-commiute').on('tap', '.remove-image', function (e) {
    e.stopPropagation();
    e.preventDefault();

    $(this).closest('.items').remove();
    updateImageCount();

  });

  // 点击提交评价
  $('#saveComment-entry').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();


    var content = $('#textarea').val() || '';
    var orderNo = getUrlParam('orderNo') || '';
    var roomId = getUrlParam('roomId') || '';
    var roomEnvironment = $('#roomEnvironment').data('score') || 0;
    var serviceAttitude = $('#serviceAttitude').data('score') || 0;

    if (!roomEnvironment || !serviceAttitude) {
      toast.show('请对房屋环境和服务态度进行评分');
      return false;
    }

    var commentPictures = [];
    var images = $('.js-uploaded-image');
    for (var i = 0; i < images.length; i++) {
      commentPictures.push(images.eq(i).data('url'));
    }


    var paramsList = {
      commentPictures: commentPictures,
      content: content,
      orderNo: orderNo,
      roomEnvironment: roomEnvironment,
      roomId: roomId,
      serviceAttitude: serviceAttitude,
    }
    saveComment(paramsList);
  });


  // 点击返回回到上一页
  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });


});
