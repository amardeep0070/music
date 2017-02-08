//Name of the playlist and list of songs, referene to the user object.
module.exports = function () {
    var mongoose = require("mongoose");
    var PlaylistSchema = mongoose.Schema({
        private:{type:Boolean,default:false},
        _user:{type:mongoose.Schema.Types.ObjectId,ref:"UserModel"},
        name:String,
        songs:[{service:String,song:String}]
    }, {collection: "playlist"});
    return PlaylistSchema;
};