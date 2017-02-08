module.exports = function () {


    var mongoose = require('mongoose');
    var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL|| 'mongodb://127.0.0.1:27017/music-unity';
    mongoose.connect(connectionString);

    //loading all the Modelservers.
    var userModel = require("./user/user.model.server")();
    var playlistModel = require("./playlist/playlist.model.server")();
    var likeModel= require("./like/like.model.server")();
    var commentModel= require("./comment/comment.model.server")();
    var model = {
        userModel : userModel,
        playlistModel:playlistModel,
        commentModel:commentModel,
        likeModel:likeModel
    };
    return model;
};
