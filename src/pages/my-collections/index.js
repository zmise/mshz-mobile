require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');
require('../../sass/dropload.scss');


/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');

require('../../assets/js/appDownload.js');//全局下载APP
require('../../assets/js/dropload.min'); // 分页插件


window.onpageshow = function (event) {
  if (event.persisted) {
    location.reload();
  }
};
$(function () {
  // dropload
  var $collectionsList = $('.article-body .list'); // $('#collectionsList')

  var dropload = $('.article-body').dropload({
    scrollArea: window,
    domDown: {
      domClass: 'dropload-down',
      domRefresh: '<div class="dropload-refresh"> </div>',
      domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
      domNoData: '<section class="unusual-body">' +
        '  <div class="no-house"></div>' +
        '  <span>请赶紧去收藏房源吧</span>' +
        '</section>',
      domFinished: '',// <div class="dropload-finished">已加载所有房源</div>'
      domNetworkError: '<section class="unusual-body">' +
        '  <div class="no-network"></div>' +
        '  <span>网络请求失败，请检查网络</span>' +
        '</section>'
    },
    loadDownFn: loadingMore
  });


  function loadingMore(options) {
    var curPage = +$('#page').val();
    if (options && options.isReload) {
      $('#page').val(1);
      dropload.unlock();
      curPage = 1;
    } else {
      $('#page').val(curPage + 1);
      curPage += 1;
    }
    var params = {
      currentPage: curPage,
      pageSize: 10,
    }
    console.log(params)
    $.ajax({
      url: '/mshz-app/security/userinfo/queryUserCollectRoom',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        var recordCount = res.result && res.result.recordCount || 0;
        if (params.page === 1) {
          $collectionsList.empty();
        }
        console.log(res)

        if (res.status === 'C0000'
          && res.result
          && res.result.items
          && res.result.items.length > 0) {
          var array = res.result.items;
          var str = '';
          for (var i = 0; i < array.length; i++) {
            var item = array[i];
            str +=
              '<div class="listItems">' +
              '  <a href="/houseDetails?id=' + item.id + '">' +
              '    <div class="index-list">' +
              '      <img src="' + item.mainPicture.replace('{size}', '680x384') + '" alt="">' +
              '        <div class="item-oneline">' +
              '          <p>' + item.title + '</p>' +
              '          <p>￥' + item.price + '</p>' +
              '        </div>' +
              '        <div class="item-twoline">' +
              '          <i class="twoline-items">' + item.region + '</i>' +
              '          <i class="twoline-items">' + item.houseType + '</i>' +
              '          <i class="twoline-items">' + item.customerCount + '人</i>' +
              '        </div>' +
              '        <div class="item-threeline">' +
              '    <div class="three-lline">' +
              '      <div class="star-lines"><div class="star-bar-score" style="width:' + (item.rate * 1.7 / 5) + 'rem"></div><div class="star-bar"></div></div>' +
              '      <i class="score">' + item.rate.toFixed(1) + '分</i>' +
              '    </div>' +
              '          <div class="three-rline">' +
              '            <i class="twoline-items">' + item.livedCount + '人住过</i>' +
              '            <i class="twoline-items">' + item.commentCount + '条评价</i>' +
              '          </div>' +
              '        </div>' +
              '      </div>' +
              '    </a>' +
              '</div>'
              ;
          }
          $collectionsList.append(str);
        }

        dropload.resetload(recordCount, params.page, res.result && res.result.pageCount || 1);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
        $collectionsList.empty();
        dropload.resetload(-1);
      }
    });
  }
  loadingMore({ isReload: true })

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});


