var player = $('video')[0];

// 添加播放记录
$(window).on('beforeunload', function() {

  // 开播才记录
  if(player.currentTime != 0) {

    addHistory(); // 临时补上播放历史

    var historyInfo = new Array();

    if(localStorage.playHistory) {
      historyInfo = JSON.parse(localStorage.playHistory);

      // 暴力去重，顺便搞掂了顺序问题
      $.each(historyInfo, function(i, obj){
        if(obj.vid == video_info.video_id) {
          historyInfo.splice(i, 1);
          return false; // 找到当前视频就提前结束循环，否则删掉了元素会导致数组越界
        }
      });

      // 只保留前9
      if (historyInfo.length >= 9)
        historyInfo.splice(0, 1);
    }

    historyInfo.push({
      vname : video_info.video_name,  // 影片名称
      vid : video_info.video_id,  // 影片ID
      video_index : video_info.video_index, // 集数
      currentTime : player.currentTime, // 当前播放位置
      duration : player.duration  // 总片长
    });

    localStorage.playHistory = JSON.stringify(historyInfo);
  }

});



$(document).ready(function() {

  // 跳转到播放位置
  if(localStorage.playHistory) {
      historyInfo = JSON.parse(localStorage.playHistory);

      $.each(historyInfo, function(i, obj){
        // 影片ID 和 集数 都对才跳转
        if(obj.vid == video_info.video_id && obj.video_index == video_info.video_index) {
          player.play();

          $(player).one('canplay', function() {
            player.currentTime = obj.currentTime;
          });

          return false;
        }
      });

   }

});
