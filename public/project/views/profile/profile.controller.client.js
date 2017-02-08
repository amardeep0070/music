/**
 * Created by roopghosh on 12/2/16.
 */
(function() {
    angular
        .module("MusicUnity")
        .controller("ProfileController", ProfileController)
        .controller("ProfileEditController", ProfileEditController)

    function ProfileController($routeParams,$http,UserService,PlaylistService,CommentService,LikeService,$location,$rootScope) {
        $('body').attr('class',"");
        $('.modal-backdrop').attr('class',"");
        var userid = $routeParams['uid'];
        var vm = this;
        vm._id=userid;
        vm.updateUser=updateUser;
        vm.deletePlayList = deletePlayList;
        vm.replaceQwithPls=replaceQwithPls
        vm.followingProfile=followingProfile;
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
        function followingProfile(followingUser) {
            $location.url("/user/"+vm._id+"/profile?followingProfile="+followingUser);
        }
        function replaceQwithPls(pid) {
            PlaylistService.findPlaylistbyId(userid,pid)
                .success(
                function (playlist) {
                                UserService.updateUserQueue(userid,playlist.songs)
                                    .success(
                                        function (response) {
                                            count =0;
                                            $location.url("/user/"+userid+"/home2");
                                        }
                                    )
                            }
                        )
        }

        function deletePlayList(pid) {
            PlaylistService.deletePlaylist(userid,pid)
                .success(
                    function (response) {
                        playlistByUser(userid);
                    }
                )
                .error(function (error) {
                    console.log(error+"at profile controller inti");
                })
        }
        function init() {
            pausePlayer();
            vm.searchText=null;
            $("#backButtonParentDiv").css("display","block");
            vm.guest = false;
            if($routeParams.followingProfile!=null){
                var username = $routeParams.followingProfile;
                UserService.findUserByUsername(username)
                    .success(function (response) {
                        userid = response._id;
                        UserService.findUserById(userid)
                            .success(
                                function (response) {
                                    vm.user = response;
                                }
                            )
                            .error(function (error) {
                                console.log(error+"at profile controller inti");
                            })
                        recentSongsByUser(userid);
                        playlistByUser(userid);
                        commentsByUser(userid);
                        //commentsForUser(userid);
                        getUserFollowing(userid);
                        likeByUser(userid);
                    })
                vm.guest = true;
                $("#updateProfile").hide();
                $("#home2Redirect").hide();
                $("#peopleIFollow").hide();
                $(".fa-trash ").hide();
                $("#lock").attr('class','center pull-right hidden-xs lock');
                $('#PIF').hide();
            }else{
                UserService.findUserById(userid)
                    .success(
                        function (response) {
                            vm.user = response;
                        }
                    )
                    .error(function (error) {
                        console.log(error+"at profile controller inti");
                    })
                recentSongsByUser(userid);
                playlistByUser(userid);
                commentsByUser(userid);
                //commentsForUser(userid);
                getUserFollowing(userid);
                likeByUser(userid);
            }
        }
        init();

        function getUserFollowing(userId) {
            array=[];
            UserService.findUserById(userId)
                .success(function (response) {
                    var userFollowing=response.following ;
                    for(item in userFollowing){
                        UserService.findUserById(userFollowing[item])
                            .success(function (response) {
                                array.push(response);
                            })
                            .error(
                                function (error) {
                                    console.log("while looping over users"+error);
                                }
                            )
                    }
                    vm.following = array;
                })
                .error(
                    function (error) {
                        console.log("error at get user following"+error);
                    }
                )
        }

        function likeByUser(userid) {
            LikeService.getLikeByUser(userid)
                .success(function (response) {
                    vm.likes= response;
                })
                .error(function (error) {
                    console.log(error);
                })
        }

        function updateUser(modifiedUser) {
            UserService.updateUser(userid,modifiedUser)
                .success(function (response) {
                    $('.error').addClass('alert alert-success').html("Profile Updated")
                   // $location.url("/user"+ userid+ "/profile");
                })
                .error(function (error) {
                    console.log(error + "error updatiing widget in profile controller")
                });
        }

        //not using
        function commentsForUser(userId) {
           CommentService.findCommentForUser(userId)
                .success(function (res) {
                    vm.comments4user= res;
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function recentSongsByUser(userId) {
            UserService.getrecentSongByUser(userId)
                .success(function (res) {
                    vm.recentSongs = res.reverse();
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function playlistByUser(userId) {
            PlaylistService.findPlaylistbyUser(userId)
                .success(function (res) {
                    vm.playlist = res;
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function commentsByUser(userId) {
            CommentService.findCommentByUser(userId)
                .success(function (res) {
                    vm.comment2user = res;
                })
                .error(function (error) {

                });
        }
    }


    function ProfileEditController($routeParams,$http,UserService) {
        var userid = $routeParams[uid];
        
        function init() {
             UserService.findUserById(userid)
                .success(function (user) {
                    vm.user= user;
                })
                .error(function (error) {

                });
        }
        init();

        function updateUser(modifiedUser) {
            UserService.updateUser(userid,modifiedUser)
                .success(function (response) {
                    $http.url("/user"+ response._id+ "/profile");//todo location.url to profile page.
                })
                .error(function (error) {

                });
        }
    }

})();