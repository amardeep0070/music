
module.exports = function () {
    var mongoose = require("mongoose");
    var PlaylistSchema = require("./playlist.schema.server")();
    var PlaylistModel = mongoose.model("PlaylistModel", PlaylistSchema);
    var api = {
        createPlaylist:createPlaylist,
        udpatePlaylist:udpatePlaylist,
        addSongtoPlaylist:addSongtoPlaylist,
        findPlaylistbyId:findPlaylistbyId,
        findPlaylistbyUser:findPlaylistbyUser,
        deletePlaylist:deletePlaylist
    };
    return api;


    function createPlaylist(playlist) {
        return PlaylistModel.create(playlist);
    }

    function udpatePlaylist(playlistId, playlist) {
        return PlaylistModel.update(
            {
                _id: playlistId
            },
            {
                private:playlist.private,
                songs:playlist.songs
            }
        )
    }

    function addSongtoPlaylist(playlistId,song) {
        return PlaylistModel.findById(playlistId)
            .then(
                function (playlistObj) {
                    playlistObj.songs.push(song);
                    playlistObj.save();
                },
                function (error) {

                }
            )
    }

    function findPlaylistbyId(playlistId) {
        return PlaylistModel.findById(playlistId);
    }

    function findPlaylistbyUser(userId) {
        return PlaylistModel.find({
            _user:userId
        });
    }
    function deletePlaylist(playlistId) {
        return PlaylistModel.remove({_id:playlistId});
    }
};
