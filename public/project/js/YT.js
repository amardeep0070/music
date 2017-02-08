
var videoArray = [];
var forced = false;
var previous = false;
var nextButton=false;
var count=0;
// create youtube player
var youtube;
var uid;

function initYT(userId) {
    if(!uid){
        uid  = userId;
    }
}
function reloadFunc(type,videoId,userId) {
   // videoID[1]= 'N21u1bMhHyQ';
    videoArray.unshift({type:type,id:videoId});
    forced = true;
    pausePlayer();
    onPlayerStateChange('onStateChange');
}

function ytNextSong() {
    pausePlayer();
    nextButton=true;
    if(videoArray[count].type=='youtube'){
        youtube.pauseVideo();
    }else{
        dmPlaySong('pause');
    }
    onPlayerStateChange('onStateChange');
}

function ytPrevSong() {
    pausePlayer();
    previous = true;
    if(videoArray[count].type=='youtube'){
        youtube.pauseVideo();
    }else{
        dmPlaySong('pause');
    }
    onPlayerStateChange('onStateChange');
}

function pausePlayer() {
    if(youtube==null || youtube.pauseVideo==null){
        return;
    }
    /*if(videoArray[count].type=='youtube'){
        youtube.pauseVideo();
    }else{
        dmPlaySong('pause');
    }*/
    youtube.pauseVideo();
    dmPlaySong('pause');
}

function cueFromUser(song){
    var service = 'youtube'
    videoArray.push({type:service,id:song});
}


function pushtoQueue(obj) {
    videoArray.push({type:obj.service,id:obj.song});
    count++;
}

function playPlayer() {
    if(videoArray[count].type=='youtube') {
        youtube.playVideo();
    }else{
        dmPlaySong('play');
    }
}

function onYouTubePlayerAPIReady() {
    youtube = new YT.Player('youtube', {
        height: '0',
        width: '0',
        videoId: '',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }

    });
}

// autoplay video
function onPlayerReady(event) {
    event.target.playVideo();
}



////main resource function with DM
////main resource function with DM
////main resource function with DM

function onPlayerStateChange(event,fromDM) {
    if((fromDM==true||event.data === 0 || forced ||nextButton|| previous)&&(previous||count<videoArray.length)) {
        //this is the wrapper for youtube player.
        if(fromDM==true||event.data === 0 || forced ||nextButton){
            count++;
        }

        if(previous){
            if(count<2){
                count=0;
            }else{
                count--;
            }
        }

        if(forced){
            count = 0;
        }
            nextAutoPlay(event,fromDM);
}
////main resource function with DM
////main resource function with DM
////main resource function with DM

// when video ends`
function nextAutoPlay(event,fromDM) {
    if((fromDM==true|| event.data === 0 || forced ||nextButton|| previous)&&(previous||count<videoArray.length)){
        resetLikes();
        if (videoArray[count].type == 'dailymotion') {
            //playnext song at dailymotion
            console.log("I was here in on player stat for dailymotion");
            dmPlaySong();
        }else {
            youtube.stopVideo();
            youtube.loadVideoById(videoArray[count].id, 0, "large");
            youtube.playVideo();
        }
            nextButton= false;
            forced=false;
            previous= false;
        }
        updateThumbnails(count)
            .done(
                function (response) {
                    console.log("done updating thumbnail")
                    if(videoArray[count].type=='youtube') {
                        var recent = {
                            title: response.items[0].snippet.title,
                            url: response.items[0].snippet.thumbnails.default.url,
                            videoId: response.items[0].id
                        }
                    }else{
                        var recent = {
                            title: response.title,
                            url: response.thumbnail_url,
                            videoId: response.id
                        }
                    }
                    isLike(recent.title);
                    angular.injector(['ng', 'MusicUnity']).invoke(function (UserService) {
                        UserService.addSong2Recent(recent,uid);
                    });
                }
            );
        $('#like').attr('fa fa-thumbs-o-up');

        if(count<videoArray.length-1) {
            updateNextThumbnails(count + 1);
        }
    }


    function resetLikes() {
        $('#like').attr('class','fa fa-thumbs-o-up whiteColor');
        $('#dislike').attr('class','fa fa-thumbs-o-down whiteColor');
    }
}


function isLike(videoId) {
    angular.injector(['ng', 'MusicUnity']).invoke(function (LikeService) {
        LikeService.getLikeBySong(videoId)
            .then(
                function (response) {
                    for(var i in response.data){
                        if(response.data[i]._user==uid){
                            $('#like').attr('class','fa fa-thumbs-up whiteColor');
                            return;
                        }
                    }
                },
                function (error) {
                    console.log(error);
                }
            );
    });
}

function updateThumbnails(count) {
    var currentVideoId = videoArray[count].id;
    if(videoArray[count].type=='youtube'){
        var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=VIDEOID&key=AIzaSyAqvaj33Z1ZRdiWP6vJ9IQ3EswflLRqqbA";
        url = url.replace("VIDEOID",currentVideoId);
        var title;
        return $.getJSON(url,{async: false})
            .done(
                function (snippet) {
                    if(snippet.items[0].snippet.thumbnails.default.url) {
                        var image = snippet.items[0].snippet.thumbnails.default.url;
                        document.getElementById("prev").innerHTML =
                            '<img id="prev" src=' + image + ' alt="..." class="heightPlayerImage noBorder">';
                    }
                    if(snippet.items[0].snippet.title){
                        title  = snippet.items[0].snippet.title;
                        document.getElementById("currentTrack").innerHTML = '<h4 id="currentTrack" class="ng-binding">' + title + '</h4>';
                        $.notify("Playing "+title,
                            {   className:'info',
                                style: 'bootstrap',
                                globalPosition: 'top left',
                                autoHideDelay: 5000,
                                autoHide: true,
                                hideAnimation: 'slideUp'});
                    }
                }
            );
        }else{
        var url = "https://api.dailymotion.com/video/VIDEOID?fields=id,title,thumbnail_url";
        url = url.replace("VIDEOID",currentVideoId);
        var title;
        return $.getJSON(url)
            .done(
                function (snippet) {
                    if(snippet.thumbnail_url) {
                        var image = snippet.thumbnail_url;
                        document.getElementById("prev").innerHTML =
                            '<img id="prev" src=' + image + ' alt="..." class="heightPlayerImage noBorder">';
                    }
                    if(snippet.title){
                        title  = snippet.title;
                        document.getElementById("currentTrack").innerHTML = '<h4 id="currentTrack" class="ng-binding">' + title + '</h4>';
                        $.notify("Playing "+title,
                            {   className:'info',
                                style: 'bootstrap',
                                globalPosition: 'top left',
                                autoHideDelay: 5000,
                                autoHide: true,
                                hideAnimation: 'slideUp'});
                    }
                }
            );
    }
}
function updateNextThumbnails(count) {
    var currentVideoId = videoArray[count].id;
    if(videoArray[count].type=='youtube') {
        var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=VIDEOID&key=AIzaSyAqvaj33Z1ZRdiWP6vJ9IQ3EswflLRqqbA";
        url = url.replace("VIDEOID", currentVideoId);
        var title;
        $.getJSON(url, {async: false})
            .done(
                function (snippet) {
                    if (snippet.items[0].snippet.thumbnails.default.url) {
                        var image = snippet.items[0].snippet.thumbnails.default.url;
                        document.getElementById("next").innerHTML =
                            '<img id="next" src=' + image + ' alt="..." class="heightPlayerImage noBorder">';
                    }
                }
            );
        return;
    }else{
        var url = "https://api.dailymotion.com/video/VIDEOID?fields=id,title,thumbnail_url";
        url = url.replace("VIDEOID", currentVideoId);
        var title;
        $.getJSON(url)
            .done(
                function (snippet) {
                    if (snippet.thumbnail_url) {
                        var image = snippet.thumbnail_url;
                        document.getElementById("next").innerHTML =
                            '<img id="next" src=' + image + ' alt="..." class="heightPlayerImage noBorder">';
                    }
                }
            );
        return;
    }

}
