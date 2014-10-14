var flash = $('embed#player_fg[FlashVars]');
if (flash.length > 0) {
  //提取真实地址
  var movieurl = flash.attr('FlashVars').match(/play_url\=([^\&]+)/)[1];

  //替换路径为域名，方便内外网都能访问
  movieurl = unescape(movieurl)
            .replace("172.16.31.101", "navod.scse.com.cn")
            .replace("172.16.31.102", "navod.scse.com.cn")
            .replace("172.16.31.103", "navod.scse.com.cn");

  var player = $('<video>');
  player.css('width', '100%');
  player.attr('src', movieurl);
  player.attr('autoplay', true);
  player.attr('controls', true);

  var wrapper = $('<div>');
  wrapper.css('width', 960);
  wrapper.css('margin', '0 auto');

  wrapper.append(player);
  $('.live_content').css('height', 'auto').empty().append(wrapper);

  // 音量记忆
  if (!isNaN(parseFloat(localStorage.volume))) {
    player.prop('volume', localStorage.volume);
  }

  player.on('volumechange', function (volume) {
    localStorage.volume = player.prop('volume');
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
        player[0].webkitRequestFullscreen();
        break;
    }
  });
}
