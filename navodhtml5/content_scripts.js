//判断是否播放页，非播放页无<object>的
if (document.getElementsByTagName("object")[0] != undefined) {
    //提取真实地址
    var movieurl = $("object").find("param[name=FlashVars]").val().replace("&play_url=", "").replace("&play_url_hd=", "").split("&")[0];
    //url编码解码
    movieurl = unescape(movieurl);
    //如果是外网访问，就替换一下路径
    if ((window.location.href).indexOf("172.16") == -1) {
        movieurl = movieurl.replace("172.16.31.102", "navod.scse.com.cn");
    }
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
            v.volume = localStorage.volume;
        }
    }
}