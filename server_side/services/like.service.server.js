//API for accessing the DB and giving out the corresponding information.
module.exports = function (app,model) {
    app.get("/api/song/:songName/likes", getLikeBySong);
    app.get("/api/user/:uid/song/:songName/", findLikeByUserAndSong);
    app.get("/api/user/:uid/song/:songName/:like", updateLikebyUserAndSong);
    app.get("/api/user/:uid/likes", getLikeByUser);
    //app.delete("/api/user/:uid/comm", deleteComment);
    //app.post("/api/user/:uid/comm/new", createComment);


    function findLikeByUserAndSong(req,res) {
        var userId= req.params.uid;
        var song= req.params.songName;
        model.likeModel.getLikeByUserAndSong(userId,song)
            .then(
                function (response) {
                    if(response){
                        res.send(response);
                    }else{
                        res.send(null);
                    }
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );
    }


    function updateLikebyUserAndSong(req,res) {
        var like = req.params.like;
        var userId= req.params.uid;
        var song= req.params.songName;
        if(like=='true'){
            model.likeModel.createUpdateLike({_user:userId,song:song})
                .then(
                    function (response) {
                        res.send(response);
                    },
                    function (error) {
                        console.log(error);
                        res.sendStatus(400).send(error);
                    }
                )
        }else{
            model.likeModel.deleteLike({_user:userId,song:song})
                .then(
                    function (response) {
                        res.send(response);
                    },
                    function (error) {
                        console.log(error);
                        res.sendStatus(400).send(error);
                    }
                )
        }
    }


    function getLikeByUser(req,res) {
        var userid = req.params.uid;
        model.likeModel.getLikeByUser(userid)
            .then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            )
    }


    function getLikeBySong(req,res) {
        var song = req.params.songName;
        model.likeModel.getLikeBySong(song)
            .then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            )
    }
}