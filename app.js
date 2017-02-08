module.exports = function (app) {
    var model =  require("./server_side/models/models.server")();
    require("./server_side/services/user.service.server")(app,model);
    require("./server_side/services/comment.service.server.js")(app,model);
    require("./server_side/services/like.service.server.js")(app,model);
    require("./server_side/services/playlist.service.server.js")(app,model);
};
