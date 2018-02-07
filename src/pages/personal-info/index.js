require('../../common/session');
require('./index.scss');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/vendors/iconfont/iconfont.js'); //有色图标
require('../../assets/js/appDownload.js');//全局下载APP
var toast = require('../../assets/js/toast.js');  //toast的事件




$(function () {

  //上传本地图片转换为URL post接口
  function uploadImage(file) {
    console.log('zmise')
    var dtd = $.Deferred();
    var params = new FormData();
    params.append('file', file, file.name);
    $.ajax({
      url: '/mshz-app/security/user/updateLoadPicture',
      type: 'post',
      contentType: false,
      processData: false,
      data: params
    }).then(function (res) {
      if (res.status === 'C0000') {
        //sessionStorage更新缓存的个人信息
        $('#image').attr('src', res.result.url.replace('{size}', '88x88'));
        var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
        if (loginInfo) {
          loginInfo.headPortrait = res.result.url;
          window.sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
        }
        var params = {
          headPortrait: res.result.url,
        }
        updateUserInfo(params);
      } else {
        dtd.reject(new Error(res.message));
      }
    }).fail(function (err) {
      dtd.reject(new Error('上传失败，请检查网络。'));
    });
    return dtd.promise();
  }

  // //从本地上传图片文件(input type=file)
  // function imgPreview(fileDom) {
  //   //判断是否支持FileReader
  //   if (window.FileReader) {
  //     var reader = new FileReader();
  //   } else {
  //     alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
  //   }

  //   //获取文件
  //   // console.log(fileDom);

  //   var file = fileDom[0].files[0];
  //   // console.log(file);

  //   var imageType = /^image\//;
  //   //是否是图片
  //   if (!imageType.test(file.type)) {
  //     alert("请选择图片！");
  //     return;
  //   }
  //   //读取完成
  //   reader.onload = function (e) {
  //     //获取图片dom
  //     // console.log(e.target);
  //     // console.log(e.target.result);
  //     // var $img = $('#img');
  //     // //图片路径设置为读取的图片
  //     // $img.attr('src', e.target.result);
  //     // console.log(fileDom.next());
  //     if (e.target.result) {
  //       $('#image').attr('src', e.target.result);
  //       var params = {
  //         headPortrait: e.target.result,
  //       }
  //       updateUserInfo(params);
  //     } else {
  //       toast.show('传入的图片文件不正确');
  //     }

  //   };
  //   reader.readAsDataURL(file);
  // }

  //用户个人中心所需数据get接口
  function queryInfo() {
    $.ajax({
      url: '/mshz-app/security/user/info/query',
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        if (res.status === 'C0000') {
          console.log(res.result);
          var item = res.result;
          var sex = 'nv';
          if (item.sex === 'MALE') {
            sex = 'nan';
          }
          var str =
            '<section class="personal-info">' +
            '  <div class="items" >' +
            '    <span class="title">头像</span>' +
            '    <div class="content">' +
            '      <input class="img-file" type="file"  accept="image/*" multiple="multiple" id="img-file" style="display:none"/>' +
            '      <img class="pic" src="' + item.headPortrait.replace('{size}', '88x88') + '" id="image" />' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '  <a class="items" href="./change-nickname.html?nickname=' + item.nickname + '">' +
            '    <span class="title">用户名</span>' +
            '    <div class="content">' +
            '      <span>' + item.nickname + '</span>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </a>' +
            '  <div class="items">' +
            '    <span class="title">注册手机号</span>' +
            '    <div class="content">' +
            '      <span>' + item.phone + '</span>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '  <div class="items" id="sex">' +
            '    <span class="title">性别</span>' +
            '    <div class="content">' +
            '      <svg class="sex" aria-hidden="true">' +
            '        <use xlink: href="#icon-' + sex + '" id="sex-style"></use>' +
            '      </svg>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '  <div class="items">' +
            '    <span class="title">真实姓名</span>' +
            '    <div class="content">' +
            '      <span>' + item.realName + '</span>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '  </div>' +
            '  </div>' +
            '  <div class="items">' +
            '    <span class="title">身份证号</span>' +
            '    <div class="content">' +
            '      <span>' + item.identityCard + '</span>' +
            '      <i class="icon iconfont icon-fanhuixiangyou"></i>' +
            '    </div>' +
            '  </div>' +
            '</section >'
            ;
          $('.article-body').append(str);
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }


  //修改个人资料post接口
  function updateUserInfo(params) {
    console.log(params);
    $.ajax({
      url: '/mshz-app/security/user/updateUserInfo',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      type: 'POST',
      cache: false,
      success: function (res) {
        if (params.sex) {
          $('#overlay').hide();
          if (params.sex === 'MALE') {
            $('#sex-style').attr('href', '#icon-nan');
          } else {
            $('#sex-style').attr('href', '#icon-nv');
          }
        }

        if (res.status === 'C0000') {
          setTimeout(function () {
            toast.show('修改成功');
          }, 1000);
        } else {
          setTimeout(function () {
            toast.show('修改失败');
          }, 1000);
        }
      },
      error: function (error) {
        console.log(error);
        console.log('error');
      }
    });
  }


  queryInfo();

  // 解决Safari ( WKWebview ) 返回后页面不刷新的问题
  var browserRule = /^.*((iPhone)|(iPad)|(Safari))+.*$/;
  if (browserRule.test(navigator.userAgent)) {
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload()
      }
    };
  }

  // 点击上传图片  更换头像
  $('.article-body').on('click', '#image', function (e) {
    // e.stopPropagation();
    // e.preventDefault();
    $('#img-file').click();
  });
  $('.article-body').on('change', '#img-file', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = this.files[0];
    uploadImage(file);
  });


  // 点击更换性别
  $('.article-body').on('click', '#sex', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#overlay').css('display', 'flex');
  });
  $('#overlay .items').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var params = {
      sex: $(this).data('id'),
    }
    updateUserInfo(params);

    // $('#overlay').hide();

  });
  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});
