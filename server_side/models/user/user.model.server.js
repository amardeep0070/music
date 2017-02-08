module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var UserModel = mongoose.model("UserModel", UserSchema);
    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        deleteUser: deleteUser,
        getUserQueue:getUserQueue,
        updateSongQueue:updateSongQueue,
        addsong2Recent:addsong2Recent,
        getAllUser:getAllUser,
        findUserByThirdPartyId:findUserByThirdPartyId
    };
    return api;


    function findUserByThirdPartyId(googleId) {
        return UserModel.findOne({'thirdParty.id': googleId});

    }

    function getAllUser() {
        return UserModel.find({}).select("username url");
    }

    function addsong2Recent(userId,recentSongList) {
        return UserModel
            .update(
                {
                    _id:userId
                },//filter
                {
                    recent:recentSongList
                }
            );
    }

    function updateSongQueue(userId,queue) {
        return UserModel
            .update(
                {
                    _id:userId
                },//filter
                {
                   queue:queue
                }
            );
    }

    function createUser(user) {
         return UserModel.create(user);
    }

    function findUserById (userid) {
        //find will return an array while findbyById will give an object
        return UserModel.findById(userid);
    }
    function updateUser(user,userId) {
        return UserModel
            .update(
                {
                    _id:userId
                },//filter
                {
                    firstName:user.firstName,
                    lastName:user.lastName,
                    url:user.url,
                    following:user.following
                    //todo more values HERE
                }
                // new value
            );
    }
    function findUserByCredentials(username,password) {
        return UserModel
            .findOne({
                username:username,
                password:password
            })
    }
    function findUserByUsername(username) {
        return UserModel
            .findOne({
                username:username
            })
    }
    function deleteUser(userId) {
        return UserModel
            .remove({
                _id:userId
            })
    }

    function getUserQueue(userid) {
        return UserModel.findById(
            {_id:userid},
            {
                queue:1
            }
        )
    }
};
