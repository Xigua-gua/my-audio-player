
// log
var log = function() {
    console.log.apply(console, arguments);
}


// 字符串补零
var nChar = function(char, n) {
    var s = ''
    for (var i = 0; i < n; i++) {
        s += char
    }
    return s
}
var zfill = function(n, width) {
    var s = String(n)
    var len = s.length
    return nChar('0', width - len) + s
}

// 设置时间戳
var labelFromTime = function(time) {
    var minutes = zfill(Math.floor(time / 60),2)
    var seconds = zfill(Math.floor(time % 60),2)
    var t = `${minutes}:${seconds}`
    return t
}

// 设置歌曲信息列表
var titleList = function(songList) {
    var list = []
    for (var i = 0; i < songList.length; i++) {
        var len = songList[i].length
        var s = songList[i].slice(0,len -4)
        list.push(s)
    }
    // log('titleList', list)
    return list
}

// 添加播放器
var bindAppendAudio = function() {
    // log('audio')
    var audio = `<audio id=id-audio-player autoplay="autoplay" src="music/${songList[0]}"></audio>`
    $('body').append(audio)
}

// 添加播放列表
var bindAddSongList = function() {
    var playlist = $('.player-list-container')
    var list = titleList(songList)
    for (var i = 0; i < list.length; i++) {
        var s = list[i]
        var song = `<div class="song"><span>${s}</span></div>`
        playlist.append(song)
    }
}

// 随机播放
var randomplay = function() {
    var len = songList.length
    var random = Math.random() * len
    var index = Math.floor(random)
    var title = titleList(songList)[index]
    $('#id-h1-song-title').html(`<i class="fa fa-music"></i>  ${title}`)
    var randomsrc = `music/${songList[index]}`
    log('随机播放 src --->', randomsrc)
    var player = $('#id-audio-player')[0]
    player.autoplay = !player.paused
    player.src = randomsrc
}

// 切换为随机 模式
var orderSong = function (button) {
    log('切换为随机播放 模式')
    button.dataset.action = 'random'
    $(button).removeClass("fa-exchange").addClass("fa-random")
}

// 切换为顺序 模式
var randomSong = function(button) {
    log('切换为顺序播放 模式')
    button.dataset.action = 'order'
    $(button).removeClass("fa-random").addClass("fa-exchange")
}

// 上一首的src
var prevSrc = function(src) {
    var len = songList.length
    for (var i = 0; i < songList.length; i++) {
        var s = `music/${songList[i]}`
        if (src == s) {
            if (i == 0) {
                var title = titleList(songList)[len - 1]
                $('#id-h1-song-title').html(`<i class="fa fa-music"></i>  ${title}`)
                return `music/${songList[len - 1]}`
            }
            var title = titleList(songList)[i - 1]
            $('#id-h1-song-title').html(`<i class="fa fa-music"></i>  ${title}`)
            return `music/${songList[i - 1]}`
        }
    }
}

// 下一首的src
var nextSrc = function(src) {
    var len = songList.length
    for (var i = 0; i < songList.length; i++) {
        var s = `music/${songList[i]}`
        if (src == s) {
            if (i == len - 1) {
                var title = titleList(songList)[0]
                $('#id-h1-song-title').html(`<i class="fa fa-music"></i>  ${title}`)
                return `music/${songList[0]}`
            }
            var title = titleList(songList)[i + 1]
            $('#id-h1-song-title').html(`<i class="fa fa-music"></i>  ${title}`)
            return `music/${songList[i + 1]}`
        }
    }
}

// 播放上一首
var prevSong = function() {
    var activeSrc = $('#id-audio-player').attr('src')
    var type = document.querySelector('.play-mode').dataset.action
    if (type == 'order') {
        var nowsrc = prevSrc(activeSrc)
        log('顺序播放上一首--->', nowsrc)
        var player = $('#id-audio-player')[0]
        player.autoplay = !player.paused
        player.src = nowsrc
    }else {
        randomplay()
    }

}

//播放下一首
var nextSong = function() {
    var activeSrc = $('#id-audio-player').attr('src')
    var type = document.querySelector('.play-mode').dataset.action
    if (type == 'order') {
        var nowsrc = nextSrc(activeSrc)
        log('顺序播放下一首--->', nowsrc)
        var player = $('#id-audio-player')[0]
        player.autoplay = !player.paused
        player.src = nowsrc
    }else {
        randomplay()
    }
}

// 播放歌曲
var playSong = function(button) {
    log('播放')
    $('#id-audio-player')[0].play()
    button.dataset.action = 'pause'
    $(button).removeClass("fa-play").addClass("fa-pause")
    $('#id-div-img').removeClass('off')
    // log('button',button)
}

// 暂停歌曲
var pauseSong = function(button) {
    log('暂停')
    $('#id-audio-player')[0].pause()
    button.dataset.action = 'play'
    $(button).removeClass("fa-pause").addClass("fa-play")
    $('#id-div-img').addClass('off')
    // log('button',button)
}

var toggleList = function() {
    log('切换显示 歌曲列表')
    $('.player-list-container').toggleClass('show-list')
}

// 播放按钮事件
var bindPlayEvents = function() {
    $('.player-play').on('click', '.player-button', function(event) {
        var button = event.target
        var type = button.dataset.action
        var actions = {
            random: randomSong,
            order: orderSong,
            prev: prevSong,
            next: nextSong,
            play: playSong,
            pause: pauseSong,
            list: toggleList,
        }
        var action = actions[type]
        action(button)
    })
}

// 播放器调节事件
var bindAudioEvents = function() {
    // 调节 歌曲时间进度
    $('#id-audio-player').on('timeupdate', function(e){
        var player = e.target
        // 设置 播放比例
        var value = player.currentTime / player.duration
        // 设置滑块 时间进度
        $('#id-input-slider').val(value * 100)
        $('.prog').width((value * 100) / 100 * $('range').width())
        var time = labelFromTime(player.currentTime)
        $('#id-time-current').text(time)
    })
    // 动态调节 歌曲进度
    $('#id-input-slider').on('change', function() {
        log('change')
        var player = $('#id-audio-player')[0]
                // 获取滑动条滑动到哪里的值
        var value = $('#id-input-slider').val()
        // 设置这个值给播放时间
        // 首先返回当前播放文件的总时长
        var currentDuration = player.duration
        var setTime = value / 100 * currentDuration
        player.currentTime = setTime
    })
    // 音乐播放完了之后的事件
    $("#id-audio-player").on('ended', function(e){
        // 确定当前 播放模式
        var player = $('#id-audio-player')[0]
        nextSong()
        player.play()
    })
    // 加载音乐后的事件
    $('#id-audio-player').on('canplay', function(e){
        var player = e.target
        // log('can play', player.duration)
        var time = labelFromTime(player.duration)
        // 滑条归位， 时间重置
        $('#id-input-slider').val(0)
        $('#id-time-current').text('00:00')
        $('#id-time-duration').text(time)
    })
    // 动态调节音量
    $('#id-input-volume').on('change', function(event){
        // log('input-volume',event.target)
        var volume = event.target.value / 100
        $('#id-audio-player')[0].volume = volume
        log(`音量为 ${$('#id-audio-player')[0].volume}`)
    })
    // 切换静音设置
    $('.fa.fa-volume-up').on('click', function(event){
        var icon = $(event.target)
        toggleVolumeIcon(icon)
        log(`音量为 ${$('#id-audio-player')[0].volume}`)
    })
}

// 静音设置
var toggleVolumeIcon= function(e) {
    if (e.hasClass("fa-volume-up")) {
        e.removeClass("fa-volume-up").addClass("fa-volume-off")
        $('#id-audio-player')[0].volume = 0
    }else {
        e.removeClass("fa-volume-off").addClass("fa-volume-up")
        $('#id-audio-player')[0].volume = $('#id-input-volume').val() / 100
    }
}

// 选择曲目播放
var bindSwitch = function() {
    var player = $('#id-audio-player')[0]
    // 点击切换歌曲
    $('.song>span').on('click', function(e){
        var self = $(e.target)
        var song = self.text()
        // log('click', song)
        // 根据当前播放状态设置 autoplay
        player.autoplay = !player.paused
        // log('player.autoplay',!player.paused)
        // 切换歌曲
        player.src = `music/${song}.mp3`
        // log('duration', player.duration)
        // 设置当前歌曲名称
        $('#id-h1-song-title').html(`<i class="fa fa-music"></i>  ${song}`)
    })
}

// music url
var songList = ["漫步 - 许巍.mp3",
                "时光 - 许巍.mp3",
                "蓝莲花 - 许巍.mp3",
                "完美生活 - 许巍.mp3",
                "曾经的你 - 许巍.mp3",
                '空白格 - 杨宗纬.mp3',
                '其实都没有 - 杨宗纬.mp3',
                'If You - bigBang.mp3',]

var bindEvents = function() {
    bindAddSongList()
    bindAppendAudio()
    bindAudioEvents()
    bindPlayEvents()
    bindSwitch()
}

bindEvents()




/*


*/
