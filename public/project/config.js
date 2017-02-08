/**
 * Created by Amardeep on 08/10/16.
 */
//iffy statement to protect the namespace
(function() {
    console.log("in config");
    angular
        .module("MusicUnity")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "/project/views/landingPage/mainPage.view.client.html",
                controller:"MainPageController",
                controllerAs :"model"
            })
            .when("/signup", {
                templateUrl: "/project/views/signup.view.client.html"
                //    controller:"LoginController",
                //  controllerAs :"model"
            })
            .when("/test", {
                templateUrl: "/project/views/playback.html"
                //    controller:"LoginController",
                //  controllerAs :"model"
            })
            .when("/user/:uid/profile", {
            templateUrl: "/project/views/profile/profile.view.client.html",
            controller:"ProfileController",
            controllerAs :"model",
                // resolve:{
                //     checkLogin:checkLoginProfile
                // }
            })
            .when("/user/:uid/home2", {
                templateUrl: "/project/views/home2/home2.html",
                controller:"Home2Controller",
                controllerAs :"model",
                // resolve:{
                //     checkLogin:checkLoginhome2
                // }
            })
            .when("/user/:uid/home1", {
                templateUrl: "/project/views/home1/home1.view.client.html",
                controller:"Home1Controller",
                controllerAs :"model",
                // resolve:{
                //     checkLogin:checkLogin
                // }
            })
            .when("/user/redirect", {
                resolve:{
                    checkLogin:checkLogin
                }
            })

            .otherwise({
                redirectTo: "/home"
            })

        function redirectHome1(UserService,$location) {
            //var deferred = $q.defer($q,UserService,$location);
            UserService
                .checkLogin()
                .success(
                    function (user) {
                        if(user!=0){
                            $location.url("/user/"+user._id+"/home1");
                        }else{

                            $location.url("/login");
                        }
                    }
                );
            return deferred.promise;
        }


        function checkLogin($q,UserService,$location) {
            var deferred = $q.defer();
            UserService
                .checkLogin()
                .success(
                    function (user) {
                        if(user!=0){
                            deferred.resolve();
                            $location.url("/user/"+user._id+"/home1");
                        }else{
                            deferred.reject();
                            $location.url("/home");
                        }
                    }
                );
            return deferred.promise;
        }
        function checkLoginProfile($q,UserService,$location) {
            var deferred = $q.defer();
            UserService
                .checkLogin()
                .success(
                    function (user) {
                        if(user!=0){
                            deferred.resolve();
                            $location.url("/user/"+user._id+"/profile");
                        }else{
                            deferred.reject();
                            $location.url("/home");
                        }
                    }
                );
            return deferred.promise;
        }

    }
})();
