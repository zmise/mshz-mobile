require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/calendar.js');//日期插件
$(function () {

  // $.ajax('/mshz-app/security/app/order/queryOrderList?orderQueryType=VALIDATED');
  /* ajax请求模板 */
  var obj = {
    "2018-01": [
      {
        "date": "2018-01-12",
        "dateDay": "12",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-13",
        "dateDay": "13",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-14",
        "dateDay": "14",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-15",
        "dateDay": "15",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-16",
        "dateDay": "16",
        "holiday": "",
        "price": 200,
        "status": "BOOKED",
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-17",
        "dateDay": "17",
        "holiday": "",
        "price": 200,
        "status": "BOOKED",
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-18",
        "dateDay": "18",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-19",
        "dateDay": "19",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-20",
        "dateDay": "20",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-21",
        "dateDay": "21",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-22",
        "dateDay": "22",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-23",
        "dateDay": "23",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-24",
        "dateDay": "24",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-25",
        "dateDay": "25",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-26",
        "dateDay": "26",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-27",
        "dateDay": "27",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-28",
        "dateDay": "28",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-29",
        "dateDay": "29",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-30",
        "dateDay": "30",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-01-31",
        "dateDay": "31",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      }
    ],
    "2018-02": [
      {
        "date": "2018-02-01",
        "dateDay": "01",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-02",
        "dateDay": "02",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-03",
        "dateDay": "03",
        "holiday": "",
        "price": 300,
        "status": "BOOKED",
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-04",
        "dateDay": "04",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-05",
        "dateDay": "05",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-06",
        "dateDay": "06",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-07",
        "dateDay": "07",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-08",
        "dateDay": "08",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-09",
        "dateDay": "09",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-10",
        "dateDay": "10",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-11",
        "dateDay": "11",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-12",
        "dateDay": "12",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-13",
        "dateDay": "13",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-14",
        "dateDay": "14",
        "holiday": "情人节",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-15",
        "dateDay": "15",
        "holiday": "除夕",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-16",
        "dateDay": "16",
        "holiday": "春节",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-17",
        "dateDay": "17",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-18",
        "dateDay": "18",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-19",
        "dateDay": "19",
        "holiday": "元宵",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-20",
        "dateDay": "20",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-21",
        "dateDay": "21",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-22",
        "dateDay": "22",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-23",
        "dateDay": "23",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-24",
        "dateDay": "24",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-25",
        "dateDay": "25",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-26",
        "dateDay": "26",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-27",
        "dateDay": "27",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-02-28",
        "dateDay": "28",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      }
    ],
    "2018-03": [
      {
        "date": "2018-03-01",
        "dateDay": "01",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-02",
        "dateDay": "02",
        "holiday": "元宵",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-03",
        "dateDay": "03",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-04",
        "dateDay": "04",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-05",
        "dateDay": "05",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-06",
        "dateDay": "06",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-07",
        "dateDay": "07",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-08",
        "dateDay": "08",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-09",
        "dateDay": "09",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-10",
        "dateDay": "10",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-11",
        "dateDay": "11",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-12",
        "dateDay": "12",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-13",
        "dateDay": "13",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-14",
        "dateDay": "14",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-15",
        "dateDay": "15",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-16",
        "dateDay": "16",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-17",
        "dateDay": "17",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-18",
        "dateDay": "18",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-19",
        "dateDay": "19",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-20",
        "dateDay": "20",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-21",
        "dateDay": "21",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-22",
        "dateDay": "22",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-23",
        "dateDay": "23",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-24",
        "dateDay": "24",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-25",
        "dateDay": "25",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-26",
        "dateDay": "26",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-27",
        "dateDay": "27",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-28",
        "dateDay": "28",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-29",
        "dateDay": "29",
        "holiday": "",
        "price": 200,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-30",
        "dateDay": "30",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      },
      {
        "date": "2018-03-31",
        "dateDay": "31",
        "holiday": "",
        "price": 300,
        "status": null,
        "statusDesc": "",
        "statusLongDesc": ""
      }
    ]
  }


  var sourceDate = [];
  Object.keys(obj).forEach(function (key) {

    return sourceDate = sourceDate.concat(obj[key]);

  });

  var startDate = $('#startDate').val();
  var endDate = $('#endDate').val();
  // console.log(startDate);
  // console.log(endDate);
  /*   日历控件的生成 */
  $('#firstSelect').calendarSwitch({
    selectors: {
      sections: ".calendar"
    },
    index: 3,      //展示的月份个数
    animateFunction: "slideToggle",        //动画效果
    controlDay: false,//知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
    // daysnumber: "90",     //控制天数
    comeColor: "#44bb80",       //入住颜色
    outColor: "#44bb80",      //离店颜色
    comeoutColor: "#44bb80",        //入住和离店之间的颜色
    callback: function (start, end) {
      // $('#firstSelect').data("startdata", start);
      // $('#firstSelect').data("enddata", end);
      // console.log($('#firstSelect').data())
      $('#startDate').val(start);
      $('#endDate').val(end);
      // loadingMore();
    },   //回调函数
    comfireBtn: '.comfire',//确定按钮的class或者id
    startData: startDate,
    endData: endDate,
    sourceData: sourceDate,
  });

  /*   页面的生成时一些盒子的隐藏判断 */
  var $liveNum = $('.userInfo-body .input-layout .liveNum');
  var $inputLayout = $('.userInfo-body .input-layout');

  if ($liveNum.find('.peo-num').text() - 0 <= 1) {
    $liveNum.find('.reduce').hide();
  }

  /* 一些input框的正则判断  */
  // $inputLayout.find('.name')
  // $inputLayout.find('.IDcard')
  // $inputLayout.find('.tel')
  // $inputLayout.on('keydown', '.name', function (e) {
  //   e.preventDefault();
  //   $(this).val($(this).val().replace(/[^\u4E00-\u9FA5]/g, ''));
  // });
  // $inputLayout.on('keydown', '.IDcard', function (e) {
  //   e.preventDefault();

  //   $(this).val($(this).val().replace(/\D+/g, ''));

  // });
  // $inputLayout.on('keydown', '.tel', function (e) {
  //   e.preventDefault();
  //   $(this).val($(this).val().replace(/\D+/g, ''));

  // });


  /*   显示日历的控件的点击事件 */
  $('.userInfo-body').on('tap', '.calc-entry', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('.calendar').slideToggle();
    $('body,html').css({ 'overflow': 'hidden' }); //阻止首页滚动条事件
  });
  /*   显示日历的控件的点击事件 */

  $('.userInfo-body').on('tap', '.reduce', function (e) {
    if ($liveNum.find('.peo-num').text() === '2') {
      $liveNum.find('.reduce').hide();
    }
    $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 1);

  });

  /*   显示日历的控件的点击事件 */

  $('.userInfo-body').on('tap', '.add', function (e) {
    console.log(123);
    console.log($liveNum);

    console.log($liveNum.find('.peo-num').text());

    if ($liveNum.find('.peo-num').text() === '1') {
      $liveNum.find('.reduce').show();
    }
    if ($liveNum.find('.peo-num').text() - 0 < $('.address-body .def-pnum').text().replace('人', '') - 0) {
      $liveNum.find('.peo-num').text($liveNum.find('.peo-num').text() - 0 + 1);
    }
  });



});
