/**
 * Created by roopghosh on 12/2/16.
 */
(function () {
    angular
        .module("MusicUnity")
        .factory("LikeService", LikeService);

    function LikeService($http) {
        var api = {
            findLikeByUserAndSong:findLikeByUserAndSong,
            updateLikebyUserAndSong:updateLikebyUserAndSong,
            getLikeByUser:getLikeByUser,
            getLikeBySong:getLikeBySong
        }
        return api;
        
        function findLikeByUserAndSong(uid,song) {
            return $http.get("/api/user/"+uid+"/song/"+song);
        }
        
        function updateLikebyUserAndSong(uid,song,like) { // like is a bool
            return $http.get("/api/user/"+uid+"/song/"+song+"/"+like);
        }
        
        function getLikeByUser(uid) {
            return $http.get("/api/user/"+uid+"/likes");
        }
        
        function getLikeBySong(song) {
            return $http.get("/api/song/"+song+"/likes");
        }
    }
})();

