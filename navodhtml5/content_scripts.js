;(function ($) {
    var flash = $('embed#player_fg[FlashVars]');

    if (flash.length > 0) {

        // [功能] 非手动选集时，自动播放最新一集，避免追剧时多次点击
        if (location.search.indexOf('nns_video_index') === -1)
            if ($('.movie_page_indexa').length > 0)
                window.location.href = $('.movie_page_indexa:last').attr('href');


        // 提取视频真实地址
        var movieurl = flash.attr('FlashVars').match(/play_url.*?\=([^\&]+)/)[1];

        // 替换路径为域名，方便内外网都能访问
        movieurl = decodeURIComponent(movieurl)
            .replace("172.16.31.101", "navod.scse.com.cn")
            .replace("172.16.31.102", "navod.scse.com.cn")
            .replace("172.16.31.103", "navod.scse.com.cn");

        // 提取当前视频名，移除的特殊字符如右  : / \ ? < > * ^ |
        var movietitle = $('span#OnlinePlay').text().replace('正在播放：', '').replace(/[:\/\\\?<>\*\^\|]/g, '_');

        // 配置 video 标签
        var player = $('<video>');
        player.css('width', '100%');
        player.attr({
            src: movieurl,
            autoplay: true,
            controls: true,
            preload: 'auto'
        });


        // [功能] 嘘，静悄悄的把播放器换掉，不要告诉其他人
        var wrapper = $('<div id="html5-video">');
        wrapper.css({
            'width': '960px',
            'margin': '0 auto'
        });
        wrapper.append(player);
        $('#bofang').css('height', 'auto').empty().append(wrapper);


        // [功能] 添加“辅助功能区”，方便下载和其他功能
        var helperblock = $('<div class="helper">').css({
            'overflow': 'hidden',
            'padding': '8px 34px'
        });
        var helpertitle = $('<div class="helper-title">').text('辅助功能');
        helpertitle.css({
            'display': 'inline-block',
            'font-size': '20px',
            'background-color': 'rgb(18, 161, 224)',
            'color': '#fff',
            'padding': '6px 8px'
        });
        var downloadbtn = $('<a>').attr('href', movieurl.replace('?start=0', '') + '/' + movietitle + '.mp4').addClass('button1').text('下载');
        downloadbtn.css({
            'width': '62px',
            'margin-top': '20px'
        });
        helperblock.append(helpertitle, downloadbtn); // 此处可放更多功能按钮
        // 放进侧边栏
        $('.wrap:eq(1)').prepend(helperblock);


        // [功能] 单击暂停|播放
        player.on('click', function () {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });


        // [功能] 双击全屏|退出
        player.on('dblclick', function () {
            if (document.webkitIsFullScreen) {
                document.webkitExitFullscreen();
            } else {
                this.webkitRequestFullScreen();
            }
        });


        // [功能] 音量记忆
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


        // [功能] 快捷键
        $(document.body).on('keydown', function (evt) {
            if (evt.target == $('#search_top_txt')[0]) {
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


        // [功能] 播放位置记忆功能
        insertScript('extra.js');
    }

    // [功能] 清除播放历史记录
    if ($(".history_content ul.root").html()) {
        var clearBtn = '<li><span class="root1"></span><span class="root2"></span><span class="root3"><a href="javascript:setGlobalVar(' + "'historyplay'," + "'');showHistory();" + '"' + '>清除播放历史</a></span></li>';
        $(".history_content ul.root").append(clearBtn);
    }

})(jQuery);


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


