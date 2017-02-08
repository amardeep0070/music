//Comment/Status update with a reference to the user object.
module.exports = function () {
    var mongoose = require("mongoose");
    var CommentSchema = mongoose.Schema({
        _user:{type:mongoose.Schema.Types.ObjectId,ref:"UserModel"},
        comment:String
    }, {collection: "comment"});
    return CommentSchema;
};
