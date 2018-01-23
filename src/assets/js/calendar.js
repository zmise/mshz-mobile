(function ($) {
    "use strict";
    var calendarSwitch = (function () {
        function calendarSwitch(element, options) {
            this.settings = $.extend(true, $.fn.calendarSwitch.defaults, options || {});
            this.element = element;
            this.init();
        }
        var totalDay;  //总天数
        var totalPrice;  //总价格
        calendarSwitch.prototype = { /*说明：初始化插件*/
            /*实现：初始化dom结构，布局，分页及绑定事件*/
            init: function () {
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.selectors.sections;
                me.index = me.settings.index;
                me.comfire = me.settings.comfireBtn;
                me.startData = me.settings.startData;
                me.endData = me.settings.endData;
                me.sourceData = me.settings.sourceData; // 后台数据
                me.comeoutColor = me.settings.comeoutColor;


                // console.log(me.sourceData);
                var html = " <div class='fixBox'><div class='headerWrapper'>" + "<a class='back' id='cale-cancel'></a>" + "<div class='headerTip'>请选择入住退房日期</div><div class='comfire'>确定</div></div><table class='dateZone'><tr><td class='colo'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td class='colo'>六</td></tr></table></div>" + "<div class='tbody'></div>";
                $(me.sections).append(html);
                $(me.sections).find('.fixBox').css({
                    "height": "1.76rem",
                    "width": "100%",
                    "backgroundColor": "#fff",
                    "zIndex": "99",
                    "position": "fixed"
                });
                $(me.sections).find('.headerWrapper').css({
                    "height": ".88rem",
                    "line-height": ".88rem",
                    "position": "relative"
                });
                $(me.sections).find('.headerTip').css({
                    "text-align": "center",
                    "line-height": ".88rem",
                });
                $(me.sections).find('.dateZone').css({
                    "height": ".88rem",
                    "backgroundColor": "#fff",

                });
                $(me.sections).find('.tbody').css({
                    "marginTop": "1.77rem"
                });
                $(me.sections).find(me.comfire).css({
                    "color": "#fff",
                    "position": "absolute",
                    "right": ".35rem",
                    "text-align": "center",
                    "font-size": ".36rem",
                    "cursor": "pointer",
                    "top": "0",

                });

                // debugger
                for (var q = 0; q < me.index; q++) {
                    var select = q;
                    $(me.sections).find(".tbody").append("<p class='ny1'></p><table class='dateTable'></table>")
                    var currentDate = new Date();
                    currentDate.setMonth(currentDate.getMonth() + select);
                    var currentYear = currentDate.getFullYear();
                    var currentMonth = currentDate.getMonth();
                    var setcurrentDate = new Date(currentYear, currentMonth, 1);
                    var firstDay = setcurrentDate.getDay();
                    var yf = currentMonth + 1;
                    if (yf < 10) {
                        yf = '0' + yf
                    }
                    $(me.sections).find('.ny1').eq(select).text(currentYear + '年' + yf + '月');

                    var DaysInMonth = [];
                    if (me._isLeapYear(currentYear)) {
                        DaysInMonth = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                    } else {
                        DaysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                    }
                    var Ntd = firstDay + DaysInMonth[currentMonth];

                    var Ntr = Math.ceil(Ntd / 7);
                    for (var i = 0; i < Ntr; i++) {
                        $(me.sections).find('.dateTable').eq(select).append('<tr></tr>');
                    };
                    var createTd = $(me.sections).find('.dateTable').eq(select).find('tr');
                    createTd.each(function (index, element) {

                        // console.log(me.settings.sourceData);

                        //判断后台有没有数据
                        if (me.sourceData && me.sourceData !== '') {
                            // console.log(13)
                            for (var j = 0; j < 7; j++) {
                                $(this).append('<td><span></span><span></span></td>')
                            }
                        } else {
                            for (var j = 0; j < 7; j++) {
                                $(this).append('<td><span></span></td>');
                            }

                        }

                    });
                    if (me.sourceData && me.sourceData !== '') {
                        var arryTd = $(me.sections).find('.dateTable').eq(select).find('span:even');
                        // var arryOdd = $(me.sections).find('.dateTable').eq(select).find('span:odd');

                    } else {
                        var arryTd = $(me.sections).find('.dateTable').eq(select).find('span');
                    }

                    for (var m = 0; m < DaysInMonth[currentMonth]; m++) {
                        // arryTd.eq(firstDay).addClass('odd');
                        // arryOdd.eq(firstDay).addClass('even');
                        if (m < 9) {
                            arryTd.eq(firstDay++).text(m + 1).attr('data-day', m + 1).attr('data-year-month-day', currentYear + '-' + yf + '-0' + (m - 0 + 1));
                        } else {
                            arryTd.eq(firstDay++).text(m + 1).attr('data-day', m + 1).attr('data-year-month-day', currentYear + '-' + yf + '-' + (m - 0 + 1));
                        }




                        // var firstDay = setcurrentDate.getDay();
                        // var arryTd = $(me.sections).find('.dateTable').eq(select).find('span:odd');
                        // for (var m = 0; m < DaysInMonth[currentMonth]; m++) {
                        //     arryTd.eq(firstDay++).text('￥200');
                        //     // arryTd.eq(firstDay++).text(m + 1);
                        // }
                        // arryTd.eq(firstDay++).text(m + 1);
                    }

                }
                me._initselected();

                me.element.on('tap', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me._slider(me.sections)
                });
                $(me.comfire).on('tap', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('body,html').css({ 'overflow': 'visible' });//恢复首页滚动条
                    var st = me.startData;
                    var en = me.endData;
                    var day = totalDay;
                    var price = totalPrice;
                    // console.log(day)
                    // console.log(price)

                    // debugger
                    if (st) {
                        me._slider(me.sections)
                        me._callback(st, en, day, price);
                        var end = en;
                        end = end.split('-');
                        end = end[1] + '.' + end[2];
                        $('.calendar .headerTip').text($('.calendar .headerTip').text().split('-')[0] + '-' + end);

                    } else {
                        var b = new Date();
                        var ye = b.getFullYear();
                        var mo = b.getMonth() + 1;
                        var da = b.getDate();
                        b = new Date(b.getTime() + 24 * 3600 * 1000);
                        var ye1 = b.getFullYear();
                        var mo1 = b.getMonth() + 1;
                        var da1 = b.getDate();
                        var st = ye + '-' + mo + '-' + da;
                        var en = ye1 + '-' + mo1 + '-' + da1;

                        me._slider(me.sections);
                        me._callback(st, en, day, price);
                    }

                });

                $('#cale-cancel').on('tap', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('body,html').css({ 'overflow': 'visible' });//恢复首页滚动条
                    me._slider(me.sections);
                    // me._callback()
                });
            },
            _isLeapYear: function (year) {
                return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
            },
            _slider: function (id) {
                var me = this;
                me.animateFunction = me.settings.animateFunction;

                if (me.animateFunction == "fadeToggle") {
                    $(id).fadeToggle();
                } else if (me.animateFunction == "slideToggle") {
                    $(id).slideToggle();
                } else if (me.animateFunction == "toggle") {
                    $(id).toggle();
                }

            },
            _initselected: function () {
                var me = this;
                me.comeColor = me.settings.comeColor;
                me.outColor = me.settings.outColor;
                me.startData = me.settings.startData;
                me.endData = me.settings.endData;
                // console.log(me.startData);
                // console.log(me.endData);
                me.daysnumber = me.settings.daysnumber;
                // $(me.sections).find('.ny1').eq(select).text();
                // var strMonth = new Date().getMonth();
                // console.log(strMonth);
                me.sourceData = me.settings.sourceData; // 后台数据

                var strDays = new Date().getDate();
                var arry = [];
                var arry1 = [];
                /*  初始化选择的日期区间 */
                // debugger
                var tds = $(me.sections).find('.tbody').find('td');
                if (me.startData && me.endData && (me.startData !== '') && (me.endData !== '')) {
                    tds.each(function (index, element) {
                        // if ($(this).data('year-month-day') == strDays) {
                        //     var r = index;
                        //     $(this).find('span:first').text('入住').addClass('rz');
                        //     if ($(this).next().text() != "") {
                        //         $(this).next().find('span:first').text('退房').addClass('rz');

                        //     } else {
                        //         $(".dateTable").eq(1).find("td").each(function (index, el) {
                        //             if ($(this).text() != "") {
                        //                 $(this).find('span:first').text('退房').addClass('rz');
                        //                 return false;
                        //             }
                        //         });
                        //     }
                        //     me._checkColor(me.comeColor, me.outColor)

                        // }
                        // console.log($(this).find('span:first').data('year-month-day'));
                        var datayyr = $(this).find('span:first').data('year-month-day');

                        if (datayyr === me.startData) {
                            $(this).find('span:first').text('入住').addClass('rz').attr('flay', '1');
                            $(this).find('span').addClass('color');

                        }
                        if (datayyr === me.endData) {
                            $(this).find('span:first').text('退房').addClass('rz tf');
                            $(this).find('span').addClass('color');
                        }

                    });
                    var start = me.startData.split('-');
                    start = start[1] + '.' + start[2];
                    var end = me.endData.split('-');
                    end = end[1] + '.' + end[2];
                    $('.calendar .headerTip').text(start + '-' + end);
                }
                me._checkColor(me.comeColor, me.outColor)

                $(me.sections).find('.tbody').find('td').each(function (index, element) {
                    if ($(this).text() != '') {
                        arry.push(element);
                    }
                });
                for (var i = 0; i < strDays - 1; i++) {
                    $(arry[i]).css('color', '#ccc');
                }
                // if (me.daysnumber) {
                //     //可以在这里添加90天的条件
                //     for (var i = strDays - 1; i < strDays + 60; i++) {
                //         arry1.push(arry[i])
                //     }
                //     for (var i = strDays + 60; i < $(arry).length; i++) {
                //         $(arry[i]).css('color', '#ccc')
                //     }
                // } else {

                // }


                for (var i = strDays - 1; i < $(arry).length; i++) {
                    arry1.push(arry[i])
                }


                /*  开始到结束的的dom对象 */
                var $arryodd = $(arry1).find('span:odd');
                var $arryeven = $(arry1).find('span:even');
                // console.log($arryodd)
                $arryeven.eq(0).text('今天');
                $arryeven.eq(0).attr('data-txt', '今天');
                $arryeven.addClass('even');  //入住 等 文字
                $arryodd.addClass('odd'); //价格 200
                console.log(me.sourceData);
                if (me.sourceData && me.sourceData.length !== 0) {
                    // console.log($arryodd.length);
                    console.log(13)
                    for (var i = 0; i < $arryodd.length; i++) {
                        // console.log(me.sourceData[i])
                        // if (me.sourceData[i] == undefined) {
                        //     continue;
                        // }
                        if (me.sourceData[i].status != null) {
                            $arryodd.eq(i).attr('data-status', me.sourceData[i].status);
                        }
                        if (me.sourceData[i].status == 'BOOKED') {

                            $arryodd.eq(i).text('无房');
                            $arryeven.eq(i).removeClass('even');
                        } else {
                            $arryodd.eq(i).text('￥' + me.sourceData[i].price);

                        }


                    }
                }


                /*  开始到结束的的dom对象 */

                /*  初始化渲染选中日期 */

                // var $arryodd = $(arry1).find('span:odd');
                // var $arryeven = $(arry1).find('span:even');

                // var $listItem = ;
                // var first = $arryodd.index($listItem);
                var first = $arryeven.index($('.rz'));
                var second = $arryeven.index($('.tf'));
                // var second = $(arry1).index($(arry1).find('span:first').text('退房'));
                // console.log(first);
                // console.log(first);
                // console.log(second);
                first = first + 1;
                for (first; first < second; first++) {
                    $(arry1[first]).find('span').addClass('color');

                    $(arry1[first]).css({
                        'background': me.comeoutColor,
                        'color': '#fff'
                    });
                }

                me._selectDate(arry1)

            },
            _checkColor: function (comeColor, outColor) {
                var me = this;
                var rz = $(me.sections).find('.rz');
                // console.log(rz);
                for (var i = 0; i < rz.length; i++) {
                    if (rz.eq(i).text() == "入住") {
                        rz.eq(i).closest('td').css({
                            'background': comeColor,
                            'color': '#fff',
                        });
                    } else {
                        rz.eq(i).closest('td').css({
                            'background': outColor,
                            'color': '#fff'
                        });
                    }
                }

            },
            _callback: function (st, en, day, price) {
                var me = this;
                if (me.settings.callback && $.type(me.settings.callback) === "function") {
                    me.settings.callback(st, en, day, price);
                }
            },

            _selectDate: function (arry1) {

                var me = this;
                me.comeColor = me.settings.comeColor;
                me.outColor = me.settings.outColor;
                me.comeoutColor = me.settings.comeoutColor;
                me.sections = me.selectors.sections;
                me.startData = me.settings.startData;
                me.endData = me.settings.endData;
                me.sourceData = me.settings.sourceData; // 后台数据

                var flag = 0;
                var first;
                var second;
                $(arry1).on('click', function (index) {
                    if ($(this).find('.even').length == 0) {
                        return;
                    }
                    var $arryodd = $(arry1).find('span:odd');
                    var $arryeven = $(arry1).find('span:even');


                    //判断中间有没有无房的 有的话 不给它选给他直接显示入住 
                    if ((flag == 1) && me.sourceData && me.sourceData !== '') {
                        // console.log(flag);
                        var four = first;
                        var three = $(arry1).index($(this));
                        if (first < three) {
                            for (four; four < three; four++) {
                                if ($(arry1[four]).find('.odd').data('status') == 'BOOKED') {
                                    flag = 0;
                                    break
                                }
                            }
                        } else {
                            for (three; three < four; three++) {
                                if ($(arry1[three]).find('.odd').data('status') == 'BOOKED') {
                                    flag = 0;
                                    break
                                }
                            }
                        }


                    }

                    //第一次点击
                    if (flag == 0) {
                        var arr = $(me.sections).find('.tbody').find('.rz');

                        for (var m = 0; m < arr.length; m++) {
                            arr.eq(m).text(arr.eq(m).data('day'));
                            if (arr.eq(m).data('txt')) {
                                arr.eq(m).text(arr.eq(m).data('txt'));
                            }
                        }

                        // $(me.sections).find('.tbody').find('span').removeClass('rz').removeClass('Val-price');

                        //移除点击无房的高亮
                        for (var n = 0; n < arry1.length; n++) {
                            if ($(arry1[n]).find('.odd').data('status') == 'BOOKED') {
                                $(arry1[n]).find('span:first').removeClass('even');
                            }
                        }


                        $(me.sections).find('.tbody').find('span').removeClass('rz');
                        $(me.sections).find('.tbody').find('span').removeClass('color');

                        $(arry1).css({
                            'background': '#fff',
                            'color': '#000'
                        });
                        // if($(this).data('now')=='1'){

                        // }
                        // var flag1 = $arryeven.index($('.rz'));
                        $(this).find('span:first').text('入住').addClass('rz');
                        $(this).find('span').addClass('color');


                        //点击查找第一个无房使它 高亮
                        if (me.sourceData && me.sourceData !== '') {
                            var i = $(arry1).index($(this)) + 1;

                            for (i; i < arry1.length; i++) {
                                if ($(arry1[i]).find('.odd').data('status') == 'BOOKED') {
                                    $(arry1[i]).find('span:first').addClass('even');
                                    break
                                }
                            }

                            totalDay = 1;
                            totalPrice = +$(this).find('.odd').text().replace('￥', '');
                        }



                        first = $(arry1).index($(this));
                        me._checkColor(me.comeColor, me.outColor)
                        flag = 1;
                        var start = $(this).find('span:first').data('year-month-day');
                        start = start.split('-');
                        start = start[1] + '.' + start[2];
                        $('.calendar .headerTip').text(start + '-');

                    } else if (flag == 1) {
                        second = $(arry1).index($(this))

                        //第二次点击
                        if (me.sourceData && me.sourceData !== '') {
                            //计算总共多少天totalDay
                            totalDay = Math.abs(second - first);
                            if (totalDay == 0) {
                                totalDay = 1;
                            }
                        }




                        if (first < second) {
                            first = first;

                            // $(me.sections).find('.rz').text('退房');

                            $(this).find('span:first').text('退房').addClass('rz');
                            $(this).find('span').addClass('color');

                            for (first; first < second; first++) {
                                $(arry1[first]).find('span').addClass('color');

                                $(arry1[first]).css({
                                    'background': me.comeoutColor,
                                    'color': '#fff'
                                });
                                if (me.sourceData && me.sourceData !== '') {
                                    totalPrice = totalPrice + +$(arry1[first]).find('.odd').text().replace('￥', '');

                                }
                            }
                            flag = 0;

                        } else if (first > second) {

                            $(me.sections).find('.rz').text('退房');
                            // $(this).append('<p class="rz">入住</p>')
                            $(this).find('span:first').text('入住').addClass('rz');
                            $(this).find('span').addClass('color');

                            second = second;
                            for (second; second < first; second++) {
                                $(arry1[second]).find('span').addClass('color');

                                $(arry1[second]).css({
                                    'background': me.comeoutColor,
                                    'color': '#fff'
                                });
                                if (me.sourceData && me.sourceData !== '') {

                                    totalPrice = totalPrice + +$(arry1[first]).find('.odd').text().replace('￥', '');
                                }
                            }
                            flag = 0;

                        }
                        // $(me.sections).find('.rz').each(function (index, element) {
                        //     if ($(this).text() == '退房') {
                        //         $(this).parent('td').append('<span class="hover">' + totalDay + '天</span>')
                        //         $(this).parent('td').css('position', 'relative');
                        //     }

                        // });
                        var end = $(this).find('span:first').data('year-month-day');
                        end = end.split('-');
                        end = end[1] + '.' + end[2];
                        $('.calendar .headerTip').text($('.calendar .headerTip').text().split('-')[0] + '-' + end);
                        // $('.hover').css({
                        //     'position': 'absolute',
                        //     'left': '-17px',
                        //     'top': '0px'
                        // })
                        me._slider('firstSelect')



                    }
                    //第二次点击结束
                    //点击的日期存入input
                    var startData1, endData1;

                    $(me.sections).find('.tbody .rz').each(function (index, element) {
                        if ($(this).text() == '入住') {
                            // var day = parseInt($(this).parent().find('span:first').text().replace(/[^0-9]/ig, "")) //截取字符串中的数字 
                            var day = parseInt($(this).data('day')); //截取字符串中的数字 
                            // console.log($(this).parent().find('span:first').text())
                            var startDayArrays = $(this).parents('table').prev('p').text().split('');
                            var startDayArrayYear = [];
                            var startDayArrayMonth = [];
                            var startDayYear = "";
                            var startDayMonth = "";
                            for (var i = 0; i < 4; i++) {
                                var select = i;
                                startDayArrayYear.push(startDayArrays[select])
                            }
                            startDayYear = startDayArrayYear.join('');
                            for (var i = 5; i < 7; i++) {
                                startDayArrayMonth.push(startDayArrays[i])
                            }
                            startDayMonth = startDayArrayMonth.join('');
                            if ((day - 0) < 10) {
                                day = '0' + day;
                            }
                            me.startData = startDayYear + '-' + startDayMonth + '-' + day;
                            startData1 = startDayMonth + '.' + day;
                        }
                        if ($(this).text() == '退房') {
                            // var day = parseInt($(this).parent().find('span:first').text().replace(/[^0-9]/ig, "").substring(0, 2));
                            var day = parseInt($(this).data('day'));
                            //day=$(this).parent().text().split('离')[0];

                            var endDayArrays = $(this).parents('table').prev('p').text().split('');
                            var endDayArrayYear = [];
                            var endDayArrayMonth = [];
                            var endDayYear = "";
                            var endDayMonth = "";
                            for (var i = 0; i < 4; i++) {
                                endDayArrayYear.push(endDayArrays[i])
                            }
                            endDayYear = endDayArrayYear.join('');
                            for (var i = 5; i < 7; i++) {
                                endDayArrayMonth.push(endDayArrays[i])
                            }
                            endDayMonth = endDayArrayMonth.join('');
                            if ((day - 0) < 10) {
                                day = '0' + day;
                            }
                            me.endData = endDayYear + '-' + endDayMonth + '-' + day;
                            endData1 = endDayMonth + '.' + day;

                        } else {
                            var x = me.startData;
                            var a = new Date(x.replace(/-/g, "/"));
                            var b = new Date();
                            b = new Date(a.getTime() + 24 * 3600 * 1000);
                            var ye = b.getFullYear();
                            var mo = b.getMonth() + 1;
                            var da = b.getDate();
                            if ((mo - 0) < 10) {
                                mo = '0' + mo;
                            }
                            if ((da - 0) < 10) {
                                da = '0' + da;
                            }
                            me.endData = ye + '-' + mo + '-' + da;
                            endData1 = mo + '.' + da;

                        }
                        startDayArrayYear = [];
                        startDayArrayMonth = [];
                        endDayArrayYear = [];
                        endDayArrayMonth = [];

                    });
                    var myweek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                    var st = new Date(me.startData);
                    var en = new Date(me.endData);
                    $('.week').text(myweek[st.getDay()])
                    $('.week1').text(myweek[en.getDay()])
                    me._checkColor(me.comeColor, me.outColor)

                })
            },



        }
        return calendarSwitch;
    })();
    $.fn.calendarSwitch = function (options) {
        return this.each(function () {
            var me = $(this),
                instance = me.data("calendarSwitch");

            if (!instance) {
                me.data("calendarSwitch", (instance = new calendarSwitch(me, options)));
            }

            if ($.type(options) === "string") return instance[options]();
        });
    };
    $.fn.calendarSwitch.defaults = {
        selectors: {
            sections: "#calendar"
        },
        index: 3,
        //展示的月份个数
        animateFunction: "toggle",
        //动画效果
        controlDay: false,
        //知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
        // daysnumber: "90",
        //控制天数
        comeColor: "blue",
        //入住颜色
        outColor: "red",
        //退房颜色
        comeoutColor: "#0cf",
        //入住和退房之间的颜色
        callback: "",
        //回调函数
        comfireBtn: '.comfire' //确定按钮的class或者id

    };
})(jQuery);
