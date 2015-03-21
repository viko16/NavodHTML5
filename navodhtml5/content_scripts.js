var flash = $('embed#player_fg[FlashVars]');

if (flash.length > 0) {

    // 自动播放最新一集
    var Request = {};
    Request = IsLatest();
    if (Request['nns_video_index'] > -1) {
        // 手动选择的集数
    } else {
        // 从最新一集开始播放，避免追剧时的多次选择
        if ($('.movie_page_index').length > 0) {
            var urls = $("div[class='movie_page_index']:last").html().match(/href\="(.*?)"/)[1];
            urls = urls.replace(/&amp;/gi, "&");
            window.location.href = urls;
        }
    }

    // 提取真实地址
    var movieurl = flash.attr('FlashVars').match(/play_url\=([^\&]+)/)[1];

    // 替换路径为域名，方便内外网都能访问
    movieurl = decodeURIComponent(movieurl)
        .replace("172.16.31.101", "navod.scse.com.cn")
        .replace("172.16.31.102", "navod.scse.com.cn")
        .replace("172.16.31.103", "navod.scse.com.cn");

    // 提取当前视频名
    var movietitle = $('.daohang_content_nowaddress div:eq(1) b').text();
    movietitle = movietitle.replace(':', "_")
                            .replace('/', "_")
                            .replace('\\' ,"_")
                            .replace('?', "_")
                            .replace('<', "_")
                            .replace('>', "_")
                            .replace('*', "_")
                            .replace('|', "_");

    // 配置 video 标签
    var player = $('<video>');
    player.css('width', '100%');
    player.attr({
        src: movieurl,
        autoplay: true,
        controls: true,
        preload: 'auto'
    });

    // 嘘，静悄悄的把播放器换掉，不要告诉其他人
    var wrapper = $('<div>');
    wrapper.css('width', 960);
    wrapper.css('margin', '0 auto');
    wrapper.append(player);
    $('.live_content').css('height', 'auto').empty().append(wrapper);


    // 添加“辅助功能区”，方便下载和其他功能
    var helperblock = $('<div class="same_movie">').css('overflow', 'hidden');
    var helpertitle = $('<div class="same_movie_title">').text('辅助功能');
    var downloadbutton = $('<a>').attr('href', movieurl.replace('?start=0', '') + '/' + movietitle + '.mp4').text('点击下载');
    downloadbutton.css({
        'background': '#70A3F7',
        'color': '#fff',
        'width': '100px',
        'border-radius': '3px',
        'margin': '10px auto',
        'padding': '10px',
        'text-align': 'center'
    });
    helperblock.append(helpertitle, downloadbutton); // 此处可放更多功能按钮
    // 放进侧边栏
    $('.player_msgs_right').prepend(helperblock);


    // 单击暂停|播放
    player.on('click', function () {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    });


    // 双击全屏|退出
    player.on('dblclick', function () {
        if (document.webkitIsFullScreen) {
            document.webkitExitFullscreen();
        } else {
            this.webkitRequestFullScreen();
        }
    });


    // 音量记忆
    if (!isNaN(parseFloat(localStorage.volume))) {
        player.prop('volume', localStorage.volume);
    }
    player.on('volumechange', function (volume) {
        localStorage.volume = player.prop('volume');
        this.play();
    });


    // 版本 37.0.2062.102 m 拖动BUG 修复
    player.on('seeked', function () {
        this.play();
    });


    // 快捷键
    $(document.body).on('keydown', function (evt) {
        if(evt.target == $('#search_top_txt')[0]) { 
            return; 
        }
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


    // 播放位置记忆功能
    insertScript('extra.js');


    // 优化剧集列表显示位置
    if ($('.movie_page_index').length > 0) {
        $("#title_btn_two").css({'display': 'none'});
        var selects = $("<div style='width:100%;overflow: hidden;margin-top: 20px;'>");
        $('.movie_page_index').each(function () {
            selects.append($(this));
        });
        $('.movie_remarks').before(selects);
    }

} // end main


/**
 * 读取值对信息，判断是否播放最新一集
 * @returns {Object}
 * @constructor
 */
function IsLatest() {
    var url = location.search; // 获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

/**
 * 往原页面插 JavaScript
 * @param path 文件路径
 */
function insertScript(path) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL(path);
    document.body.appendChild(script);
}

/**
 * 往原页面插 CSS
 * @param path 文件路径
 */
function insertCss(path) {
    var node = document.createElement("link");
    node.setAttribute("rel", "stylesheet");
    node.setAttribute("type", "text/css");
    node.setAttribute("href", chrome.extension.getURL(path));
    document.body.appendChild(node);
}


