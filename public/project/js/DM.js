/**
 * Created by roopghosh on 12/6/16.
 */

(function () {
    DM.init({
        apiKey: 'c3e957395696bed5edfa',
        status: true, // check login status
        cookie: true // enable cookies to allow the server to access the session
    });
    var handleAPIResponse = function (response) {
        alert('Name is ' + response.screenname);
    };
    if(dailymotion1==null){
        dailymotion1 = DM.player(document.getElementById("dailymotion"), {
            video: 'x3fzlp9',
            width: "300",
            height: "300",
            params: {
                autoplay: false
            }
        });
    }
})();

var dailymotion1 = DM.player(document.getElementById("dailymotion"), {
    video: 'x3fzlp9',
    width: "300",
    height: "300",
    params: {
        autoplay: false
    }
});
dailymotion1.addEventListener('video_end', function(event) {
    onPlayerStateChange('onStateChange',true);
});


function dmPlaySong(playPause){
    if(playPause!=null){
        if(playPause=='play'){
            if(dailymotion1==null){
                return;
            }
            dailymotion1.play();
        }else{
            if(playPause=='pause'){
                if(dailymotion1==null){
                    return;
                }
                dailymotion1.pause();
            }
        }
    }else{
        var dmId = videoArray[count].id;
        dailymotion1.load(dmId, {
            autoplay: true,
            params: {
                autoplay: true
            }
        });

    }


    /*//var count =-1
    function clickme() {
        count++;
        dailymotion.load(videoArray[count], {
            autoplay: true,
            params: {
                autoplay: true
            }
        });
    }*/
/*
    var pause= false;
    function playPause() {
        if(pause)
            dailymotion.play();
        else
            dailymotion.pause();
        pause = !pause;
    }*/
/*
    function search() {
        var text = $('#haha').val();
        var handleAPIResponse = function(response) {
            console.log("hello from DM");
            console.log(response);
            document.getElementById("ha").innerHTML = response.list;
        };

        console.log("read this from text box"+text);
        DM.api('/videos', {
            search:text ,
            fields: 'title,id,',
            limit:50
        }, handleAPIResponse);
    }*/

}
