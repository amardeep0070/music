(function () {
    angular
        .module("MusicUnity")
        .controller("Home2Controller",Home2Controller)

    function Home2Controller($routeParams,YouTubeService,UserService,LikeService,PlaylistService,DailyMotionService) {
        var vm = this;
        vm.userId=$routeParams['uid'];
        vm.search = search;
        vm.getSongName=getSongName;
        vm.selectedSong="Please Select a Song";
        vm.clear=clear;
        vm.setArtWork="http://bobjames.com/wp-content/themes/soundcheck/images/default-album-artwork.png";
        vm.videoId="";
        vm.playPause = playPause;
        vm.changeLikeState=changeLikeState;
        vm.add2Queue = add2Queue;
        vm.queue=""
        vm.getQueue=getQueue;
        var playing = true;
        qObj = ['bBhUcCCqkBo','vXcFGgwP1J4'];
        vm.save2Playlist= save2Playlist;
        vm.shareVideoId=shareVideoId;
        vm.nextSong = nextSong;
        vm.prevSong = prevSong;
        vm.playPlayList = playPlayList;
        vm.detail=""
        vm.getVideoIdforDetail=getVideoIdforDetail;
        var getQueueLoadedStatus = false;
        vm.deleteSongQueue= deleteSongQueue
        vm.logout=logout;

        function logout() {
            UserService.logout()
            // .success(function(){
            //     $location.url("/home");
            // });
                .then(function (response) {
                    $rootScope.currentUser=null;
                    $location.url("/home");
                })
        }
        function deleteSongQueue(videoId) {
               UserService.deleteSongFromQueue(vm.userId,videoId)
                   .success(
                          function (response) {
                                   getQueue();
                                }
                      )
                   .error(
                          function (error) {
                                  console.log("error while deleting song from queue");
                               }
                     )

           }
        function getVideoIdforDetail(type,obj) {
            vm.detail=obj;
                if(type=='youtube'){
                var temp=vm.detail.snippet.description;
                vm.title = vm.detail.snippet.title;
                vm.description=temp.substring(0,temp.length-3);
                vm.publishTime=vm.detail.snippet.publishedAt.split('T')[0];
                vm.url=vm.detail.snippet.thumbnails.default.url;
                vm.channelTitle=vm.detail.snippet.channelTitle;
            }else{
                DailyMotionService.snippetData(obj)
                    .success(
                        function (response) {
                            vm.title= response.title;
                            vm.description=response.description;
                            vm.publishTime=response["channel.updated_time"];// wtf dailymotion? who uses dot in name?
                            vm.url=response.thumbnail_url;
                            vm.channelTitle=response["owner.username"];
                        },
                        function (error) {
                            console.log("something wel wrong while fetching details from DM");
                        }
                    )
            }
            setTimeout(function(){
                $('#detailsModal').modal('show');
            }, 230);
        }
        function playPlayList() {
            //onYouTubePlayerAPIReady();
            var list = [];
            if(!getQueueLoadedStatus) {
                UserService.getUserQueue(vm.userId)
                    .then(function (userQueue) {
                        var queue = userQueue.data.queue;
                        for (item in queue) {
                            pushtoQueue(queue[item]);
                        }
                        count=0;
                    });
                getQueueLoadedStatus = true;
            }
        }

        function nextSong() {
            if(vm.userId=='guest'){
                $("#forwardHome2").notify("Login to use this feature",
                    {   className:'warn',
                        style: 'bootstrap',
                        autoHideDelay: 2000,
                        autoHide: true,
                        position:"top left",
                        hideAnimation: 'slideUp'});
                return;
            }
            $('#play').attr('class','fa fa-pause whiteColor');
            ytNextSong();
        }

        function prevSong() {
            if(vm.userId=='guest'){
                $("#previousHome2").notify("Login to use this feature",
                    {   className:'warn',
                        autoHideDelay: 2000,
                        autoHide: true,
                        position:"top",
                        hideAnimation: 'slideUp'});
                return;
            }
            $('#play').attr('class','fa fa-pause whiteColor');
            ytPrevSong();
        }

        function shareVideoId(type,videoId) {
            if(type=='youtube'){
                vm.shareVideoLink= "https://www.youtube.com/watch?v="+videoId;
            }else{
                vm.shareVideoLink= "www.dailymotion.com/video/"+videoId;
            }
        }


        function save2Playlist(private,name) {
            vm.queue=[];
            UserService.getUserQueue(vm.userId)
                .then(function (userQueue) {
                    var queue=userQueue.data.queue;
                    PlaylistService.createPlaylist(queue,vm.userId,private,name)
                        .success(function (response) {
                            console.log(response);
                        })
                        .error(function (error) {
                            console.log("while creating playlsit");
                        })
                })
            $.notify("Playlist created",
                {   className:'info',
                    style: 'bootstrap',
                    globalPosition: 'top left',
                    autoHideDelay: 5000,
                    autoHide: true,
                    hideAnimation: 'slideUp'});
        }

        function getQueue() {
            vm.queue=[];
            UserService.getUserQueue(vm.userId)
                .success(function (Userqueue) {
                    var queue = Userqueue.queue;
                    for(item in queue){
                        if(queue[item].service=='youtube'){
                        YouTubeService.snippetData(queue[item].song)
                            .success(function (response) {
                                var obj = {
                                    thumbnail : response.items[0].snippet.thumbnails.default.url,
                                    title : response.items[0].snippet.title,
                                    videoId:response.items[0].id
                                }
                                vm.queue.push(obj);
                            })
                            .error(function (error) {
                                console.log("while retriving snippet data for queue");
                            })
                    }else{
                            DailyMotionService.snippetData(queue[item].song)
                                .success(function (response) {
                                    var obj = {
                                        thumbnail : response.thumbnail_url,
                                        title : response.title,
                                        videoId:response.id
                                    }
                                    vm.queue.push(obj);
                                })
                                .error(function (error) {
                                    console.log("while retriving snippet data for queue");
                                })
                        }
                    }

                })
                .error(
                    function (error) {
                        console.log("something bad happened");
                    }
                )
        }

        function add2Queue(service,song) {
            if(vm.userId=='guest'){
                $.notify("Please login. Queues are registered user only feature.",
                    {   className:'warn',
                        style: 'bootstrap',
                        autoHideDelay: 5000,
                        autoHide: true,
                        hideAnimation: 'slideUp'});
                return;
            }
            var uid = $routeParams['uid'];
            UserService.addSong2UserQueue(uid,{service:service,song:song})
                .success(
                    function (response) {
                        vm.queue = response;//response;
                        console.log("added to db")
                    }
                )
                .error(function (error) {
                    //todo
                    //vm.queue = qObj;
                    console.log(error);

                })
            $.notify("Your song added to queue",
                {   className:'info',
                    style: 'bootstrap',
                    globalPosition: 'top left',
                    autoHideDelay: 5000,
                    autoHide: true,
                    hideAnimation: 'slideUp'});
            cueFromUser(song);
        }
        function playPause() {
            console.log("I hit the play button");
            if(playing){
                $('#play').attr('class','fa fa-play whiteColor');
                pausePlayer();
            }else{
                $('#play').attr('class','fa fa-pause whiteColor');
                playPlayer();
            }
            playing = !playing;
        }
        function changeLikeState(state) {
            if(state==='like'){
                //add or update the like collection
                if($('#like').attr('class')==='fa fa-thumbs-up whiteColor'){
                    return
                }
                else{
                    $('#like').attr('class','fa fa-thumbs-up whiteColor');
                    $('#dislike').attr('class','fa fa-thumbs-o-down whiteColor');
                    //add to the db
                    if(vm.selectedSong!= 'Please Select a Song'){
                        LikeService.updateLikebyUserAndSong(vm.userId,vm.selectedSong,true)
                            .success(
                                function (response) {
                                    console.log("like updated");
                                }
                            )
                            .error(
                                function (error) {
                                    console.error("like update failed");
                                }
                            )
                    }
                }

            }
            else if(state==='dislike'){
                if($('#dislike').attr('class')==='fa fa-thumbs-down whiteColor'){
                    return
                }
                else{
                    $('#like').attr('class','fa fa-thumbs-o-up whiteColor');
                    $('#dislike').attr('class','fa fa-thumbs-down whiteColor');
                    //if present in DB remove it(like schema) else do nothing
                    if(vm.selectedSong!= 'Please Select a Song'){
                        LikeService.updateLikebyUserAndSong(vm.userId,vm.selectedSong,false)
                            .success(
                                function (response) {
                                    console.log("like removed");
                                }
                            )
                            .error(
                                function (error) {
                                    console.error("like update failed");
                                }
                            )
                    }
                }
            }
        }
        function clear() {
            // var element= document.getElementById('searchResults')
            // element.style.visibility="hidden";
            $('#searchResults').css('visibility','hidden');
            $('#searchtext').val(null);
        }
        function getSongName (type,songName,artWork,videoId) {
            if(type=='generate'){
                if(videoId.charAt(0)=='x'){
                    type='dailymotion';
                }else{
                    type = 'youtube';
                }
            }
            vm.selectedSong=songName
            vm.setArtWork=artWork;
            vm.videoId=videoId;
            $('#play').attr('class','fa fa-pause whiteColor');
            reloadFunc(type,videoId,vm.userId);
        }
        function init() {
            $("#backButtonParentDiv").css("display","block");
            if(vm.userId=='guest'){
                //hiding UI STUFF
                $("#queueHome2").hide();
                $("#like").hide();
                $("#dislike").hide();
                $("#addPlaylistHome2").hide();
                $("#menu-toggle").hide();
                return;
            }
            //YouTubeService.initService();
            playPlayList();
            var searchText = $routeParams.search;
            if(searchText!="" && searchText!="undefined" && searchText!=null){
                console.log("searched for "+searchText);
                search(searchText);
                vm.searchText = searchText;
            }
            initYT(vm.userId);
        }
        init();



        function search(searchText) {
            searchTextInHistory = searchText;
            $('#searchResults').css('visibility','visible')

            ////////DM related

            vm.dailymotionResults=[];
            DailyMotionService.searchResult(searchText)
                .success(
                    function (response) {
                        for(i in response.list){
                            vm.dailymotionResults.push({type:'Dailymotion',obj:response.list[i]});
                        }
                    }
                )
                .error(
                    function (error) {
                        console.log("while retriving from dailymotion");
                    }
                );
            //youtube response.
            YouTubeService.searchResult(searchText)
                .success(function (response){
                    $('#searchResults').show();
                    vm.youtubeResults = []
                    for(i in response.items){
                        if(response.items[i].id.kind=="youtube#video"){
                            vm.youtubeResults.push({type:'Youtube',obj:response.items[i]});
                        }
                    }
                    console.log(vm.youtubeResults.length);
                })
                .error(function (error) {
                    console.log(error);
                });


        }
    }
})();