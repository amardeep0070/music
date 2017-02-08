(function () {
    angular
        .module("MusicUnity")
        .controller("Home1Controller", Home1Controller)

    function Home1Controller($routeParams,UserService,LikeService,$http,$location,CommentService) {
        var vm = this;
        vm.userid = $routeParams['uid'];
        vm.FollowerStatus=[];//{username,comment,imageSrc}
        vm.search = search;
        vm.followUser=followUser;
        vm.unfollowUser=unfollowUser;
        vm.feeds="";
        vm.allUser=[];
        vm.FollowerrecentSong = []; //[{song,username]{song:title,url}
        vm.user; // this is the current user object
        vm.followingProfile=followingProfile;
        //merge mystatus and followers status

        vm.createMyComment = createMyComment;
        vm.logout=logout;
        function logout() {
            UserService.logout()
            // .success(function(){
            //     $location.url("/home");
            // });
                .then(function (response) {
                  //  $rootScope.currentUser=null;
                    $location.url("/home");
                })
        }
        function followingProfile(followingUser) {
            $location.url("/user/"+vm.userid+"/profile?followingProfile="+followingUser);
        }

        function createMyComment (text) {
            vm.searchText="";
            CommentService.createComment(vm.userid,text)
                .success(
                    function (response) {
                        $.notify("Your status was saved",
                            {   className:'info',
                                style: 'bootstrap',
                                globalPosition: 'top left',
                                autoHideDelay: 5000,
                                autoHide: true,
                                hideAnimation: 'slideUp'});
                    }
                )
                .error(
                    function (error) {
                        console.log("something bad happened when saving your comment");
                    }
                )
            var item = {
                status:text,
                url : vm.user.url,
                username:vm.user.username
            }
            vm.FollowerStatus.push(item);
        }

        function followUser(followUser,index) {  //userId i need
            // followUser.following=false;
            var follow='#follow'+ index;
            $(follow).attr('class','hide followIconHeight');
            var follow1='#follow1'+ index;
            $(follow1).attr('class','hide followIconHeight');
            var unfollow='#unfollow'+index
            $(unfollow).attr('class','show followIconHeight')
            var unfollow1='#unfollow1'+index
            $(unfollow1).attr('class','show followIconHeight')
            vm.user.following.push(followUser.user._id);

            var found = vm.user.following.indexOf(vm.user._id);
            if(found!=-1){
                vm.user.following.splice(found,1);
            }

            UserService.updateUser(vm.user._id,vm.user)
                .success(function (response) {
                    console.log("updated Successfully");
                })
                .error(
                    function (error) {
                        console.log("something failed while adding followers");
                    }
                )
        }

        function unfollowUser (followUser,index) {
            // followUser.following=true;
            var follow1='#follow1'+ index;
            $(follow1).attr('class','show followIconHeight');
            var follow='#follow'+ index;
            $(follow).attr('class','show followIconHeight');
            var unfollow='#unfollow'+index;
            $(unfollow).attr('class','hide followIconHeight');
            var unfollow1='#unfollow1'+index
            $(unfollow1).attr('class','hide followIconHeight')
            var found = vm.user.following.indexOf(vm.user._id);
            if(found!=-1){
                vm.user.following.splice(found,1);
            }
            var found = vm.user.following.indexOf(followUser.user._id);
            if(found!=-1){
                vm.user.following.splice(found,1);
            }
            UserService.updateUser(vm.user._id,vm.user);
        }
        function init() {
            if(searchTextInHistory!=null || searchTextInHistory!=""){
                vm.searchText = searchTextInHistory;
            }
            UserService.findUserById(vm.userid)
                .success(function (user) {
                    vm.user = user;
                    getFollowerCommentsAndRecentSongList();
                    getUserList();
                })
                .error(function (error) {
                console.error("error while retriving user from userservice");
                })
            $("body").removeClass("modal-open");
            $("body").css("background-color","#222");
            $("#backButtonParentDiv").css("display","block");
            if(youtube!=null) {
                pausePlayer();
            }

        }
        init();

        function getUserList() {
            UserService.allUser()
                .success(
                    function (response) {
                        //vm.allUser = response; //response = [{_id,name}]
                        vm.allUser = createUserFollowList(response,vm.user.following);
                    }
                )
        }

        function createUserFollowList(allUsers,followingUser) {
            var usersWithFollowing = [];
            var item;
            for(i in allUsers)
            {
                var found = followingUser.indexOf(allUsers[i]._id);
                if(found!=-1){
                    item = {
                        user:allUsers[i],
                        following:true
                    }
                }else{
                    item = {
                        user:allUsers[i],
                        following:false
                    }
                }
                usersWithFollowing.push(item)
            }

            return usersWithFollowing;
        }

        function getFollowerCommentsAndRecentSongList(){
                    user = vm.user;
                    vm.FollowingUser = user.following;
                    vm.FollowingUser.push(user._id); //for retriving a users own comments;
                    for(var i in user.following){
                        UserService.findUserById(user.following[i])
                            .success(
                                function (followingUser) {
                                    var recentSongArray = createRecentSongArray(followingUser.recent.reverse().splice(0,10),followingUser.username);
                                    vm.FollowerrecentSong= vm.FollowerrecentSong.concat(recentSongArray); //splicing to show last 10 only
                                    vm.FollowerrecentSong  = shuffle(vm.FollowerrecentSong );
                                    //this is bad shuffle placement..

                                    CommentService.findCommentByUser(followingUser._id)
                                        .success(
                                            function (comments) {
                                                var statusArray = createStatusArray(comments.splice(0,10),followingUser.username,followingUser.url); //top 10 comments from followers
                                                vm.FollowerStatus = vm.FollowerStatus.concat(statusArray);
                                                vm.FollowerStatus= shuffle(vm.FollowerStatus);
                                                //this is bad shuffle placement..
                                            }
                                        )
                                }
                            )
                            .error(
                                function (error) {
                                    console.error("error while adding recentsong to array");
                                }
                            )
                    }
        }


        function createStatusArray(statusArray, username,url){
            var statusArr = []
            for(i in statusArray){
                var item = {
                    username:username,
                    url:url,
                    status:statusArray[i].comment
                }
                statusArr.push(item);
            }
            return statusArr;
        }

        function createRecentSongArray(songArray, username){
            var songArr = [];
            for(i in songArray){
                var item = {
                    username:username,
                    song:songArray[i]
                };
                songArr.push(item);
            }
            return songArr;
        }

        function search(text) {
            $location.url("/user/"+vm.userid+"/home2?search="+text);
        }

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
    }
})();
