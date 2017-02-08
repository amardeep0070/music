module.exports = function (app,model) {
    app.get("/api/user/:uid/comm/:cid", findCommentById);
    app.get("/api/user/:uid/fromcomm", findCommentByUser);
    //app.put("/api/user/:uid/comm/:cid", udpateComment);
    app.delete("/api/user/:uid/comm/:cid", deleteComment);
    app.post("/api/user/:uid/comm/new", createComment);


    function findCommentById(req,res) {
        var id= req.params.cid;
        model.commentModel.getCommentById(id)
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
    function findCommentByUser(req,res) {
        var userid= req.params.uid;
        model.commentModel.getCommentByUser(userid)
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

    //not using
    function findCommentForUser(req,res) {
        var userid= req.params.uid;
        model.commentModel.getCommentForUser(userid)
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

    function udpateComment(req,res) {

    }
    function deleteComment(req,res) {
        var id = req.params.cid;
        model.commentModel.deleteComment(id)
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

    function createComment(req,res) {
        var comment = req.body;
        var userid= req.params.uid;
        model.commentModel.createComment(comment)
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