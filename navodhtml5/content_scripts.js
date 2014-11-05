var flash = $('embed#player_fg[FlashVars]');
//读取值对信息，判断是否播放最新一集
function GetRequest() {
   var url = location.search; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

if (flash.length > 0) {
  var Request = new Object();
  Request = GetRequest();
  var namelast ="";
  if(Request['nns_video_index']>-1){
  		//手动选择的集数
  }else{
  		//从最新一集开始播放，避免追剧时的多次选择
		if($('.movie_page_index').length>0){
			var urls = $("div[class='movie_page_index']:last").html().match(/href\="(.*?)"/)[1];
			urls = urls.replace(/&amp;/gi, "&");
			window.location.href=urls;
		}
  }

  // 提取真实地址
  var movieurl = flash.attr('FlashVars').match(/play_url\=([^\&]+)/)[1];

  // 替换路径为域名，方便内外网都能访问
  movieurl = unescape(movieurl)
            .replace("172.16.31.101", "navod.scse.com.cn")
            .replace("172.16.31.102", "navod.scse.com.cn")
            .replace("172.16.31.103", "navod.scse.com.cn");
	
  var player = $('<video>');
  player.css('width', '100%');
  player.attr('src', movieurl);
  player.attr('autoplay', true);
  player.attr('controls', true);
  player.attr('preload', 'auto');
  
  var ss = $('.player_msgs_right');
  var ch = $('.same_movie');
  var download = $('<div>');
  var theater = $('<div>');
  
  var wrapper = $('<div id="zx">');
  wrapper.css('width', 960);
  wrapper.css('margin', '0 auto');
  //增加侧边栏，方便下载和其他功能
  download.html('<div class="same_movie" style="overflow: hidden;"><div class="same_movie_title">下载视频</div><a style="float:left;background: #70A3F7;color: #fff;width: 100px;border-radius: 3px;margin: 10px;padding: 10px;text-align: center;" href="'+movieurl+'">点击下载</a><a style="float:left;background: #FF3F1E;color: #fff;width: 100px;border-radius: 3px;margin: 10px;padding: 10px;text-align: center;" href="javascript:void(0);" id="showthe" >剧场模式</a></div>');
  ss.empty().append(download);
  ss.append(ch);
  
  var nameaddress = $('.daohang_content_nowaddress');
  var movename = nameaddress.html().match(/<b.*?>(.*?)<\/b>/)[1].split("（");
  //电影名字突出显示
  nameaddress.css({'display':'none'});

  var titlediv = $('<div>');
  titlediv.css({'font-family':'微软雅黑','width': '960px','overflow': 'hidden','margin': '0 auto','font-size': '20px','height': '40px'});
  titlediv.html(movename[0]+" "+namelast);
  
  wrapper.append(player);
  $('.live_content').empty();
  $('.live_content').append(titlediv);
  $('.live_content').css({'height':'auto','background':'#FEFAF7'}).append(wrapper);
  
  // 音量记忆
  if (!isNaN(parseFloat(localStorage.volume))) {
    player.prop('volume', localStorage.volume);
  }

  player.on('click', function () {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  });
  //版本 37.0.2062.102 m 拖动BUG 修复
  player.on('volumechange', function (volume) {
    localStorage.volume = player.prop('volume');
	this.play();
  });
  
  //版本 37.0.2062.102 m 拖动BUG 修复
  player.on('seeked', function () {
    this.play();
  });

  player.on('dblclick', function () {
    if (document.webkitIsFullScreen) {
      document.webkitExitFullscreen();
    } else {
      this.webkitRequestFullScreen();
    }
  });
 
  // 快捷键
  $(document.body).on('keydown', function (evt) {
    var time = player.prop('currentTime');
    var volume = player.prop('volume');

    switch (evt.keyCode) {
      case 37: // 左
        evt.preventDefault();
        player.prop('currentTime', time < 10 ? 0 : time - 10);
        break;
      case 39: // 右
        evt.preventDefault();
        player.prop('currentTime', time + 10);
        break;
      case 38: // 上
        evt.preventDefault();
        player.prop('volume', volume > 0.9 ? 1.0 : volume + 0.1);
        break;
      case 40: // 下
        evt.preventDefault();
        player.prop('volume', volume < 0.1 ? 0.0 : volume - 0.1);
        break;
      case 32: // 空格
        evt.preventDefault();
        if (player.prop('paused')) {
          player[0].play();
        } else {
          player[0].pause();
        }
        break;
      case 13: // 回车
        evt.preventDefault();
        player[0].webkitRequestFullScreen();
        break;
    }
  });


  
  // 往原页面插 script
  function insertScript (path) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL(path);
    document.body.appendChild(script);
  }
   

  // 播放位置记忆功能
  insertScript('extra.js');
  //剧场模式
	var state = 0;
   $("#showthe").click(function(){
   if(state==0){
	$("#zx").animate({'width':'100%','left':'0px','top':'20%'});
	$('body').animate({scrollTop:$("#zx").position().top+"px"}, 100);
	state=1;
	}else{
	$("#zx").animate({'width':'960px','margin':'0 auto'});
	$('body').animate({scrollTop:$(".top").position().top+"px"}, 100);
	state=0;
	}
  });
  

}
//读取新css
function insertCss (path) {
	var node = document.createElement("link");
    node.setAttribute("rel","stylesheet");
    node.setAttribute("type","text/css");
    node.setAttribute("href",chrome.extension.getURL(path));
    document.body.appendChild(node);
  }
var selectbutton = $('.select_btn');
selectbutton.attr('value', '搜索'); 
insertCss('newcss.css');
