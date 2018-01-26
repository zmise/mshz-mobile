require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/vendors/iconfont/iconfont.js'); //有色图标
require('../../assets/js/navigate.js');//侧边栏
require('../../assets/js/toast.js');  //toast的事件



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
          showMessage(res.message, 1000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
          setTimeout(function () {
            history.go(-1);
          }, 1500)

        } else {
          showMessage(res.message, 1000, true, 'bounceInUp-hastrans', 'bounceOutDown-hastrans');
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
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
  $('.assess-start').on('tap', '.start', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).siblings().removeClass('icon-tianchongxingji current').addClass('icon-weitianchongxingji');
    $(this).removeClass('icon-weitianchongxingji').addClass('icon-tianchongxingji current').prevAll().removeClass('icon-weitianchongxingji').addClass('icon-tianchongxingji current');
    $(this).closest('.items').attr('data-score', $(this).index() + 1)
    console.log($(this).closest('.items'))
    console.log($(this).index())
  });


  // 点击上传图片
  $('.assess-commiute').on('change', '#img-file', function (e) {
    // e.stopPropagation();
    // e.preventDefault();

    imgPreview($(this));
  });

  function imgPreview(fileDom) {
    //判断是否支持FileReader
    if (window.FileReader) {
      var reader = new FileReader();

    } else {
      alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
    }

    //获取文件
    // console.log(fileDom);

    var file = fileDom[0].files[0];
    // console.log(file);

    var imageType = /^image\//;
    //是否是图片
    if (!imageType.test(file.type)) {
      alert("请选择图片！");
      return;
    }
    //读取完成
    reader.onload = function (e) {
      //获取图片dom
      // console.log(e.target);
      // console.log(e.target.result);
      // var $img = $('#img');
      // //图片路径设置为读取的图片
      // $img.attr('src', e.target.result);
      // console.log(fileDom.next());

      var str =
        '<div class="items">' +
        '<img src="' + e.target.result + '" alt="">' +
        '<i class="closeImg">' +
        '<svg class="icon" aria-hidden="true">' +
        '<use xlink:href="#icon-tupianxuanzequxiao"></use>' +
        '</svg>' +
        '</i>' +
        '</div>'
        ;

      $('.img-list').prepend(str);
      var index = $('.img-list').find('.items').length - 1;
      if (index >= 7) {
        fileDom.closest('.items').remove();
      }
      fileDom.next().text(index + '/6');

    };
    reader.readAsDataURL(file);
  }
  // $.ajxa
  //   .post
  //   .then(res => {
  //     if (res.data.status === 'C0000') {
  //       console.log('上传成功');
  //     } else {
  //       console.log('上传失败');
  //     }
  //   });


  // 点击删除图片
  $('.assess-commiute').on('tap', '.closeImg', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var index = $('.img-list').find('.items').length - 1;
    if (index === 6) {
      var str =
        '<div class="items">' +
        '<input class="iconImg iconfont icon-xuanzexiangpian" type="file" accept="image/*" id="img-file"  multiple="multiple" >' +
        '<span class="txt">5/6</span>' +
        '</div>'
        ;
      $('.img-list').append(str);

    }
    $(this).closest('.items').remove();
    $(this).index();

  });

  // 点击提交评价
  $('#saveComment-entry').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    console.log($('.img-list img'))
    console.log($('.img-list img').length)
    var commentPictures = [];
    for (var i = 0; i < $('.img-list img').length; i++) {
      commentPictures[i] = $('.img-list img').eq(i).attr('src');
    }
    var content = $('#textarea').val() || '';
    var orderNo = getUrlParam('orderNo') || '';
    var roomId = getUrlParam('roomId') || '';
    var roomEnvironment = $('#roomEnvironment').data('score') || 0;
    var serviceAttitude = $('#serviceAttitude').data('score') || 0;

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
