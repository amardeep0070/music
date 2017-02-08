/**
 * Created by Amardeep on 15/11/16.
 */
/**
 * Created by Amardeep on 15/11/16.
 */
(function () {
    angular
        .module("MusicUnity")
        .controller("MainPageController",MainPageController )

    function MainPageController($location,UserService,$rootScope) {
        var vm=this;
        vm.signup=signup;
        vm.login=login;
        vm.register=register;
        vm.resetErrors = resetErrors;

        function resetErrors() {
            vm.error = '';
            vm.errorLogin='';
        }

        function init(){
            pausePlayer();
            vm.searchText=null;
            $("#backButtonParentDiv").css("display","none");
        }
        init();
        function register(newUser) {
            if(newUser==null|| newUser.username == null || newUser.username=="" ||
                newUser.firstName==null || newUser.firstName=="" ||
                newUser.verifyPassword==null || newUser.verifyPassword=="" ||
                newUser.password==null || newUser.password=="" ||
                newUser.verifyPassword != newUser.password){
                vm.error = "Errors found in the form";
                vm.user=null;
                return;
            }
            var usernameAlreadyPresent=UserService.findUserByUsername(newUser.username);
            usernameAlreadyPresent
                .success(function (user) {
                    if(user!='0'){
                        vm.error="Username already taken";
                        console.log("User taken");
                    }else{
                        // if(newUser.gender==='female'){
                        //     newUser.url="http://texturemedia.s3.amazonaws.com/user_images/profile_images/_default-medium.jpg"
                        // }
                        // if(newUser.gender==='male'){
                            newUser.url="http://img.freepik.com/free-icon/male-user-close-up-shape-for-facebook_318-37635.jpg?size=338&ext=jpg"
                      //  }
                        newUser.url="img/default.png"
                        UserService.createUser(newUser)
                            .success(function (addedUser) {
                                $location.url("/user/"+addedUser+"/profile");
                                console.log("user created");
                            })
                            .error(function (error) {
                                console.log(error + "error creating user");
                            })
                    }
                })
        }
        function signup () {
            $location.url("/signup");
        }

        function login (returningUser) {
            if(returningUser==null|| returningUser.loginUserName == null || returningUser.loginUserName=="" ||
                returningUser.loginPassword==null || returningUser.loginPassword=="" ){
                vm.errorLogin = "Please fill required fields";
                vm.user=null;
                return;
            }
                var user  = {username:returningUser.loginUserName,password:returningUser.loginPassword};
                UserService
                    .login(user)
                    .then(
                        function(response) {
                            var user = response.data;
                            if(user!='0'){
                                $("div").remove(".modal-backdrop");
                                $("#backButtonParentDiv").css("display","block");
                                $rootScope.currentUser = user;
                                searchTextInHistory="";
                                $location.url("/user/"+user._id+"/home1");

                            }
                            else{

                                shakeModal();
                            }
                        },
                        function (error) {
                            shakeModal();
                            console.log("something bad happened while loging you in.")
                        }
                    );
            /*UserService.findUserByCredentials(returningUser.loginUserName,returningUser.loginPassword)
                .success(function (user) {
                    if(user!='0'){
                        $("div").remove(".modal-backdrop");
                        $("#backButtonParentDiv").css("display","block");
                        $location.url("/user/"+user._id+"/home1");

                    }
                    else{

                        shakeModal();

                    }
                })
                .error(function (error) {
                    console.log("error in login controller")
                })*/


        }
        function shakeModal(){
            $('#loginModal .modal-dialog').addClass('shake');
           $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
            $('input[type="password"]').val('');
             setTimeout( function(){
                 $('#loginModal .modal-dialog').removeClass('shake');
             }, 10000 );
        }
    }
})();
