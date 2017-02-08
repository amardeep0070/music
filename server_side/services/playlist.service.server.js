//API for accessing the DB and giving out the corresponding information.
//method names self explanatory.
module.exports = function (app,model) {
    app.get("/api/user/:uid/pls/:pid", findPlaylistbyId);
    app.get("/api/user/:uid/pls", findPlaylistbyUser);
    app.put("/api/user/:uid/pls/:pid", udpatePlaylist);
    app.delete("/api/user/:uid/pls/:pid", deletePlaylist);
    app.post("/api/user/:uid/pls/new", createPlaylist);
    app.post("/api/user/:uid/pls/:pid/addSong", addSongtoPlaylist);

    function findPlaylistbyId(req,res) {
        var plsId = req.params.pid;
        model.playlistModel.findPlaylistbyId(plsId).then(
            function (response) {
                res.send(response);
            },
            function (error) {
                console.log(error);
                res.sendStatus(400).send(error);
            }
        );
    }

    function findPlaylistbyUser(req,res) {
        var userid = req.params.uid;
        model.playlistModel.findPlaylistbyUser(userid)
            .then(
                function (response) {
                    if(response){
                        res.send(response);
                    }else{
                        res.send('null');
                    }
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            )
    }

    function udpatePlaylist(req,res){
        var plsid = req.params.pid;
        var pls = req.body;
        model.udpatePlaylist(plsid,pls)
            .then(
                function (response) {
                    res.send(response);
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );
    }


    function deletePlaylist(req,res){
        var plsid = req.params.pid;
        model.playlistModel.deletePlaylist(plsid)
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

    function createPlaylist(req,res){
        var pls = req.body;
        model.playlistModel.createPlaylist(pls)
            .then(
                function (response) {
                    res.send(response)
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );
    }

    function addSongtoPlaylist(req,res){
        var plsid = req.params.pid;
        var song = req.body;
        model.playlistModel.addSongtoPlaylist(plsid,song)
            .then(
                function (response) {
                    res.send(response)
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );
    }

}