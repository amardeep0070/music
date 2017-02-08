//Client Service for Comments/Status update.
(function () {
    angular
        .module("MusicUnity")
        .factory("CommentService", CommentService);

    function CommentService($http) {
        var api = {
            findCommentById:findCommentById,
            findCommentByUser:findCommentByUser,
            //findCommentForUser:findCommentForUser,
            deleteComment:deleteComment,
            createComment:createComment
        }
        return api;

        function findCommentById(uid,cid) {
            return $http.get("/api/user/"+uid+"/comm/"+cid);
        }

        function createComment(uid,comment) {
            return $http.post("/api/user/"+uid+"/comm/new",{_user:uid,comment:comment});
        }

        function deleteComment(uid,cid) {
            return $http.delete("/api/user/"+uid+"/comm/"+cid);
        }

        function findCommentByUser(userId) {
            return $http.get("/api/user/"+userId+"/fromcomm");
        }

        //not using
        function findCommentForUser(userId) {
            return $http.get("/api/user/"+userId+"/tocomm");
        }
    }
})();