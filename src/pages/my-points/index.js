require('../../common/session');
require('./index.scss');
require('../../assets/js/analytics.js');

/* 侧边导航 */
require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/appDownload.js');//全局下载APP
require('../../assets/js/dropload.min'); // 分页插件
$(function () {
  var $collectionsList = $('.article-body .list');

  var dropload = $('.article-body').dropload({
    scrollArea: window,
    domUp: {                                                            // 上方DOM
      domClass: 'dropload-up',
      domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
      domUpdate: '<div class="dropload-update">↑释放更新</div>',
      domLoad: '<div class="dropload-load"><span class="dropload-loading"></span>加载中...</div>'
    },
    domDown: {
      domClass: 'dropload-down',
      domRefresh: '<div class="dropload-refresh"> </div>',
      domLoad: '<div class="dropload-load"><span class="dropload-loading"></span>加载中...</div>',
      domNoData: '',
      domFinished: '',//
      domNetworkError: '<section class="unusual-body">' +
        '  <div class="no-network"></div>' +
        '  <span>网络请求失败，请检查网络</span>' +
        '</section>'
    },
    loadDownFn: loadingMore,
    loadUpFn: loadingMore,

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
      url: '/mshz-app/security/user/queryUserPointsRecord',
      data: params,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function (res) {
        var recordCount = res.result.list && res.result.list.recordCount || 0;
        if (params.page === 1) {
          $collectionsList.empty();
        }
        console.log(res)

        if (res.status === 'C0000'
          && res.result
          && res.result.list) {
          var item = res.result.list.items;
          var str = '';
          if (res.result.list && res.result.list.currentPage === 1) {
            $('#score').text(res.result.total || 0);
          }
          for (var i = 0; i < item.length; i++) {
            str +=
              '<div class="items">' +
              '  <div class="txt">' +
              '    <span class="theme">' + item[i].title + '</span>' +
              '    <span class="time">' + item[i].usage + ' ' + item[i].createTimeDesc
              + '</span>' +
              '  </div>' +
              '  <span class="score">+' + item[i].points + '</span>' +
              '</div>'
              ;
            score += parseInt(item[i].points);
          }
          $collectionsList.append(str);
        }

        dropload.resetload(recordCount, params.currentPage, res.result.list && res.result.list.pageCount || 1);
      },
      error: function (error) {
        console.log(error);
        console.log('error');
        $collectionsList.empty();
        dropload.resetload(-1);
      }
    });
  }

  // 点击返回回到上一页
  $('#back').on('tap', function (e) {
    e.stopPropagation();
    e.preventDefault();
    history.go(-1)
  });
});




