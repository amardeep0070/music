(function (){
    angular
        .module("MusicUnity")
        .factory("DailyMotionService",DailyMotionService);

    function DailyMotionService($http,$q) {
        var api = {
            initService:initService,
            searchResult:searchResult,
            snippetData:snippetData
        }
        return api;

        function initService() {
           /* gapi.client.setApiKey("AIzaSyAqvaj33Z1ZRdiWP6vJ9IQ3EswflLRqqbA");
            gapi.client.load("youtube", "v3", function () {
                // yt api is ready
            });*/
        }
        //search 
        function searchResult(searchText) {
            var url = "https://api.dailymotion.com/videos?fields=id,thumbnail_url,title,&search=SEARCHTEXT&limit=45";
            url = url.replace("SEARCHTEXT",searchText);
            return $http.get(url);
        }
        //retrieve Data 
        function snippetData(videoId) {
            var url = "https://api.dailymotion.com/video/VIDEOID?fields=id,title,thumbnail_url,description,owner.username,channel.updated_time";
            url = url.replace("VIDEOID",videoId);
            return $http.get(url);
        }
    }
})();




