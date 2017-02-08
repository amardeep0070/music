/**
 * Created by Amardeep on 15/11/16.
 */
(function () {
    angular
        .module("MusicUnity")
        .controller("SignupController",SignupController );

    function SignupController($location) {
        var vm=this;
        vm.signup=signup
        function signup () {
            $location.url("/signup");
        }

    }
})();
