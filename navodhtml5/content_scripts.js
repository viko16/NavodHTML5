//判断是否播放页，非播放页无<object>的
if (document.getElementsByTagName("object")[0] != undefined) {
    //提取真实地址
    var movieurl = $("object").find("param[name=FlashVars]").val().replace("&play_url=", "").replace("&play_url_hd=", "").split("&")[0];
    //url编码解码
    movieurl = unescape(movieurl);
    //如果是外网访问，就替换一下路径
    if ((window.location.href).indexOf("172.16") == -1)
        movieurl = movieurl.replace("172.16.31.102", "navod.scse.com.cn");
    //移除旧播放器
    $('object').remove();
    //插入播放器
    var v = $("<video id='hehevideo' class='video-js vjs-default-skin' controls preload='none' width='960' height='540' data-setup='{}'></video>");
    $('.live_player').append(v);
    //然后就是插真实地址咯
    var r = ("<source src='" + movieurl + "' type='video/mp4' />");
    $('#hehevideo').append(r);


    //增加音量记忆功能
    if (window.localStorage) {
        if (localStorage.volume) {
            var v = document.getElementsByTagName("video")[0];
            v.volume = localStorage.volume; //设置音量
        }
    }


    //插入一段css，调用字体图标
    var c = document.createElement('style');
    var font_css = "@font-face {font-family: 'VideoJS';";
    font_css += "src: url('" + chrome.runtime.getURL("videojs/font/vjs.eot") + "');";
    font_css += "src: url('" + chrome.runtime.getURL("videojs/font/vjs.eot") + "?#iefix') format('embedded-opentype'), ";
    font_css += "url('" + chrome.runtime.getURL("videojs/font/vjs.woff") + "') format('woff'), ";
    font_css += "url('" + chrome.runtime.getURL("videojs/font/vjs.ttf") + "') format('truetype');";
    font_css += "font-weight: normal;font-style: normal;}";
    c.innerHTML = font_css;
    document.head.appendChild(c);



    //淫荡的插入一段代码，注释中间才是正式代码
    Function.prototype.getMultiLine = function() {
        var lines = new String(this);
        lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
        return lines;
    }
    var inject=function(){
    /*
        //先获取video对象
        var v = document.getElementsByTagName("video")[0];
        //在页面关闭时保存进度
        window.onbeforeunload = dealHistoryDetail;
        function dealHistoryDetail() {
        if (!v.ended)  //影片没结束才把播放时长记下来，不然记录个最后没意思~
            video_info.played_time = v.currentTime;
        if(v.currentTime != 0) //没有播的就不用记录了
            addHistory();
        }
        //监听按键，全屏时，左右键控制前进后退，上下键控制音量
        document.onkeyup = keyUp;
        function keyUp(e) {
            if (document.webkitIsFullScreen) {  //只是全屏才生效
                var currKeyNum = e.which;
                if (currKeyNum == 37) { //左键
                    v.currentTime -= 10;
                } else if(currKeyNum == 39) { //右键
                    v.currentTime += 10;
                } else if(currKeyNum == 38) { //上键
                    if(v.volume + 0.2 <= 1) v.volume += 0.2;
                    else v.volume = 1;
                } else if(currKeyNum == 40) { //下键
                    if(v.volume - 0.2 >= 0) v.volume -= 0.2;
                    else v.volume = 0;
                }
            }　
        }
    */}.getMultiLine();

    var x=document.createElement("script");
    x.type="text/javascript";
    var y=document.createTextNode(inject);
    x.appendChild(y);
    document.body.appendChild(x);
}