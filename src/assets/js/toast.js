'use strict';
(function ($, window) {
  // 动态加载animate
  // var loadStyles = function (url) {
  // 	var hasSameStyle = false;
  // 	var links = $('link');
  // 	for (var i = 0; i < links.length; i++) {
  // 		if (links.eq(i).attr('href') == url) {
  // 			hasSameStyle = true;
  // 			return
  // 		}
  // 	}

  // 	if (!hasSameStyle) {
  // 		var link = document.createElement("link");
  // 		link.type = "text/css";
  // 		link.rel = "stylesheet";
  // 		link.href = url;
  // 		document.getElementsByTagName("head")[0].appendChild(link);
  // 	}
  // }

  // loadStyles('http://www.daiwei.org/global/css/animate.css');

  //显示提示信息    toast
  $.fn.toast = function (options) {
    var $this = $(this);
    var _this = this;
    return this.each(function () {
      $(this).css({
        position: 'relative'
      });
      var top = '';		//bottom的位置
      var translateInfo = ''; 	//居中和不居中时的tarnslate

      var box = '';   //消息元素
      var defaults = {
        position: "absolute", 				//不是body的话就absolute
        animateIn: "fadeInUp-hastrans",		//进入的动画
        animateOut: "fadeOut",				//结束的动画
        padding: "10px 20px",              //padding
        background: "rgba(7,17,27,0.66)",     //背景色
        borderRadius: "6px",                    //圆角
        duration: 2000,                     //定时器时间
        animateDuration: 500, 						//执行动画时间
        fontSize: 14,                   	//字体大小
        content: "这是一个提示信息",       //提示内容
        color: "#fff",                   //文字颜色
        top: "80%",                	//bottom底部的位置    具体的数值 或者center  垂直居中
        zIndex: 1000001,                	//层级
        isCenter: true, 					//是否垂直水平居中显示
        closePrev: true, 					//在打开下一个toast的时候立即关闭上一个toast
      }

      var opt = $.extend(defaults, options || {});
      var t = '';

      // setTimeout(function(){
      //   	box.addClass('show');
      // },10);

      top = opt.isCenter === true ? '50%' : opt.top;

      defaults.isLowerIe9 = function () {
        return (!window.FormData);
      }

      // translateY(-50%)
      // translateInfo = opt.isCenter===true? 'translate3d(-50%,0,0)':'translate3d(-50%,-50%,0)';

      defaults.createMessage = function () {
        if (opt.closePrev) {
          $('.cpt-toast').remove();
        }
        console.log('top=', top);
        box = $("<div class='cpt-toast " + opt.animateIn + "'><span>" + opt.content + "</span></div>").appendTo($this);
        defaults.colseMessage();
      }

      defaults.colseMessage = function () {
        var isLowerIe9 = defaults.isLowerIe9();
        if (!isLowerIe9) {
          t = setTimeout(function () {
            $('.cpt-toast').remove();
            $('.cpt-toast').removeClass(opt.animateIn).addClass(opt.animateOut).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
              // $('.cpt-toast').remove();              
            });
          }, opt.duration);
        } else {
          t = setTimeout(function () {
            $('.cpt-toast').remove();
          }, opt.duration);
        }
      }
      defaults.createMessage();
    })
  };
})(jQuery, window);


// 初始化的弹出的toast框
function show(content, duration, isCenter, animateIn, animateOut) {
  var animateIn = animateIn || 'fadeIn';
  var animateOut = animateOut || 'fadeOut';
  if (!content.length) {
    return;
  }
  var duration = duration || 1000;
  var isCenter = isCenter || false;
  $('body').toast({
    position: 'fixed',
    animateIn: animateIn,
    animateOut: animateOut,
    content: content,
    duration: duration,
    isCenter: isCenter,
    padding: '0.1rem 0.27rem',
    background: 'rgba(181, 185, 190, 0.8)',
    borderRadius: '.31rem',
    fontSize: '.24rem',
    top: "80%",        //bottom底部的位置    具体的数值 或者center  垂直居中
  });
}

module.exports = {
  show: show
};
