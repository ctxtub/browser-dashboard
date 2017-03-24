var toolFn = {

  animate: function (obj, attr, target, duration, callback) {
    var begin = this.getcss(obj, attr);
    var value = target - begin;
    var time = +new Date();
    var timer = setInterval(function () {
      var t = (+new Date()) - time;
      if (t >= duration) {
        t = duration;
        clearInterval(timer);
      }
      obj.style[attr] = (t / duration) * (t / duration) * value + begin + 'px';
      if (t == duration) {
        callback && callback();
      }
    }, 30);
  },
  getcss: function (obj, attr) {
    return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr]);
  }
};


//天气插件JS
(function (T, h, i, n, k, P, a, g, e) {
  g = function () {
    P = h.createElement(i);
    a = h.getElementsByTagName(i)[0];
    P.src = k;
    P.charset = 'utf-8';
    P.async = 1;
    a.parentNode.insertBefore(P, a);
  };
  T['ThinkPageWeatherWidgetObject'] = n;
  T[n] || (T[n] = function () {
    (T[n].q = T[n].q || []).push(arguments);
  });
  T[n].l = +new Date();
  if (T.attachEvent) {
    T.attachEvent('onload', g);
  } else {
    T.addEventListener('load', g, false);
  }
}(window, document, 'script', 'tpwidget', '//widget.thinkpage.cn/widget/chameleon.js'));

tpwidget('init', {
  'flavor': 'bubble',
  'location': 'WX4FBXXFKE4F',
  'geolocation': 'enabled',
  'position': 'top-right',
  'margin': '10px 10px',
  'language': 'zh-chs',
  'unit': 'c',
  'theme': 'chameleon',
  'uid': 'UBD56509B7',
  'hash': '2f56a64627a714551294696bce20239a'
});

tpwidget('show');

//日历JS
(function () {

  var caltime = document.getElementsByClassName('caltime')[0];
  var caldate = document.getElementsByClassName('caldate')[0];
  var calarr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  var caldatebox = document.getElementsByClassName('caldatebox');
  var calbtns = document.getElementsByClassName('calmainTop')[0].getElementsByTagName('span');
  var calonOff = true;
  calbtns[1].addEventListener('mousemove', function (event) {
    event.preventDefault();
  });
  document.getElementsByClassName('calmainTop')[0].addEventListener('mousemove', function (event) {
    event.preventDefault();
  });
  setTime();

  function setTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();

    caldate.innerHTML = year + '年' + month + '月' + day + '日' + ' ' + calarr[now.getDay()];
    caldate.onclick = function () {
      getDays(caldatebox[1], (new Date()).getFullYear(), (new Date()).getMonth());
    };

    setInterval(function () {
      now = new Date();
      var hours = padding(now.getHours());
      var minutes = padding(now.getMinutes());
      var seconds = padding(now.getSeconds());
      caltime.innerHTML = hours + ':' + minutes + ':' + seconds;
    }, 500);
  }

  function padding(value) {
    return value < 10 ? '0' + value : '' + value;
  }

  var globalYear, globalMonth;
  getDays(caldatebox[1], (new Date()).getFullYear(), (new Date()).getMonth());

  function getDays(ele, year, month) {
    ele.innerHTML = '';
    calbtns[0].innerHTML = year + '年' + (month + 1) + '月';
    var num = 0;
    var span = ele.getElementsByTagName('span');
    //上个月
    var preview = new Date(year, month, 00);
    var currentWeek = preview.getDay();
    var previewDay = preview.getDate();
    for (var i = currentWeek; i > 0; i--) {
      ele.innerHTML += '<span class="dark">' + (previewDay - i + 1) + '</span>';
      num++;
    }
    //当月
    var current = new Date(year, month + 1, 00);
    var currentDay = current.getDate();
    for (var i = 1; i < currentDay + 1; i++) {
      ele.innerHTML += '<span>' + i + '</span>';
      num++;
    }
    if (year == (new Date()).getFullYear() && month == (new Date()).getMonth()) {
      span[currentWeek + (new Date()).getDate() - 1].id = 'current';
    }
    //下个月
    for (var i = 1; i <= 42 - num; i++) {
      ele.innerHTML += '<span class="dark">' + i + '</span>';
    }
    //span点击效果
    spanClick(ele, span);
    return globalYear = year, globalMonth = month;
  }

  calbtns[1].onclick = function () {
    if (!calonOff) return;
    calonOff = !calonOff;
    if (globalMonth == 0) {
      globalMonth = 11;
      globalYear--;
    } else {
      globalMonth--;
    }

    caldatebox[0].style.top = -252 + 'px';
    caldatebox[1].style.top = -252 + 'px';
    getDays(caldatebox[0], globalYear, globalMonth);
    toolFn.animate(caldatebox[0], 'top', 0, 500, function () {
      caldatebox[0].style.top = '';
      caldatebox[0].innerHTML = '';
    });
    toolFn.animate(caldatebox[1], 'top', 0, 500, function () {
      getDays(caldatebox[1], globalYear, globalMonth);
      caldatebox[1].style.top = '';
      calonOff = !calonOff;
    });
  };

  calbtns[2].onclick = function () {
    if (!calonOff) return;
    calonOff = !calonOff;
    if (globalMonth == 11) {
      globalMonth = 0;
      globalYear++;
    } else {
      globalMonth++;
    }

    getDays(caldatebox[2], globalYear, globalMonth);
    toolFn.animate(caldatebox[2], 'top', -252, 500, function () {
      //alert('1');
      caldatebox[2].style.top = '';
      caldatebox[2].innerHTML = '';
    });
    toolFn.animate(caldatebox[1], 'top', -252, 500, function () {
      //alert('2');
      getDays(caldatebox[1], globalYear, globalMonth);
      caldatebox[1].style.top = '';
      calonOff = !calonOff;
    });
  };

  function spanClick(ele, span) {
    //防止第一次点击清空ID因无自定义属性报错。
    ele.spanClick = span[0];
    //	console.log(ele.spanClick);
    for (var i = 0; i < span.length; i++) {
      span[i].onclick = function () {
        if (this.id) return;
        ele.spanClick.id = '';
        this.id = 'active';
        return ele.spanClick = this;
      };
    }
  }

}());