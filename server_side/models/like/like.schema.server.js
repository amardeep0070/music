//video ID of the song (Later used to retrieve the rest info on the fly)
//and reference to the corresponding user object.
module.exports = function () {
    var mongoose = require("mongoose");
    var LikeSchema = mongoose.Schema({
        song:String,
        _user:{type:mongoose.Schema.Types.ObjectId,ref:"UserModel"}
    }, {collection: "like"});
    return LikeSchema;
};