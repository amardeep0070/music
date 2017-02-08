//API for accessing the DB and giving out the corresponding information.
//method names self explanatory.
module.exports = function (app,model) {

    //using multer for profile image upload and mime to find its type(JPEG, png, etc.)
    var mime = require('mime');
    var multer = require('multer'); // npm install multer --save
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/project/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });
    var upload = multer({ storage: storage });
    //Passport JS for local, Github and Google OATH and session protection.
    var passport      = require('passport');
    var LocalStrategy    = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var GithubStrategy = require('passport-github2').Strategy;
    var cookieParser  = require('cookie-parser');
    var session       = require('express-session');
    app.use(session({
        secret: 'this is the secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    app.post('/api/logout', logout);
    app.get("/api/user/:uid",findUserById);
    app.post("/api/user",findUser);
    app.put("/api/user",updateUser);
    app.delete("/api/user/:uid",deleteUser);
    app.post("/api/user/new",createUser);
    app.get("/api/user/:uid/queue",getUserQueue);
    app.post("/api/user/:uid/recent",addRecentSongByUser);
    app.get("/api/user/:uid/recent",getRecentSongByUser);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.post("/api/user/:uid/queue1",addSong2UserQueue);
    app.get("/api/user/:uid/deleteSong/:videoId",deleteSongFromQueue);
    app.post("/api/user/:uid/updateQueue",updateUserQueue);
    app.get("/api/alluser",allUser);
    app.get("/api/user",findCurrentUser);

    app.post  ('/api/login', passport.authenticate('local'), login);
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
    app.post("/api/checkLogin",checkLogin);
    app.post("/api/logout",logout);
    app.get ('/api/loggedin', loggedin);

    //Google OATH
    app.get("/auth/google/callback",
        passport.authenticate('google', {
            successRedirect: '/project/#/user/redirect',
            failureRedirect: '/project/#/home'
        }));
    //Github OATH
    app.get("/auth/github/callback",
        passport.authenticate('github', {
            successRedirect: '/project/#/user/redirect',
            failureRedirect: '/project/#/home'
        }));

    var googleConfig = {
        clientID     : process.env.clientID||'386397546436-p05skr626rqua6lm3ht7la1ibniecebu.apps.googleusercontent.com',
        clientSecret : process.env.clientSecret||'wYd4R_LuiBQxGq-hgxrYkr_J',
        callbackURL  : process.env.callbackURL||'http://localhost:5000/auth/google/callback'
    };

    var githubConfig = {
        clientID: process.env.clientIDGITHUB ||"f7e8722a314d7b02bb91",
        clientSecret: process.env.clientSecretGITHUB ||'cab68fddbf2537d042c8d5d02a5adaaba8355af1',
        callbackURL: process.env.callbackURLGITHUB ||"http://localhost:5000/auth/github/callback"
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    passport.use(new GithubStrategy(githubConfig,githubStrategy));

    function logout(req, res) {
        req.logout();
        res.send(200);
    }
    function findCurrentUser(req,res) {
        var params = req.params;
        var query = req.query;
        if(query.password && query.username) {
            findUserByCredentials(req, res);
        } else if(query.username) {
            findUserByUsername(req, res);
        } else {
            res.json(req.user);
        }
    }

    //Github strategy
    function githubStrategy(accessToken, refreshToken, profile, done) {
        model.userModel
            .findUserByThirdPartyId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var newGoogleUser = {
                            username:  profile.username,
                            firstName: profile.displayName,
                            lastName:  profile.displayName,
                            email:     profile.email,
                            gender: profile.gender,
                            url:profile._json.avatar_url,
                            thirdParty: {
                                id:    profile.id,
                                token: profile.provider
                            }
                        };
                        return model.userModel.createUser(newGoogleUser)
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
        }

        //Google Strategy
    function googleStrategy(token, refreshToken, profile, done) {
        model.userModel
            .findUserByThirdPartyId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            gender: profile.gender,
                            url:profile.photos[0].value,
                            thirdParty: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser)
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }




    function logout(req,res) {
        req.logout();
        res.send(200);
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function checkLogin(req,res) {
        res.send(req.isAuthenticated()?req.user:'0');
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }


    //Local Strategy
    function localStrategy(username,password,done) {
        model.userModel.findUserByCredentials(username,password)
            .then(
                function (user) {
                    if(user){
                        return done(null,user);
                        //res.send(body)
                    }else{
                        return done(null,false);
                        //res.sendStatus(404).send('0');
                    }
                },
                function (error) {
                    if (error) { return done(error); }
                }
            );
    }



    function allUser(req,res) {
        model.userModel.getAllUser()
            .then(
                function (response) {
                    res.send(response)
                },
                function (error) {
                    console.log("while retriving all users");
                }
            )
    }


    function updateUserQueue(req,res) {
        var userId=req.params.uid;
        var queue=req.body;
        model.userModel.updateSongQueue(userId,queue)
                .then(
                    function (response) {
                        res.sendStatus(200);
                    },
                    function (error) {
                        console.error("while adding song to queue");
                    }
                )
    }


    function deleteSongFromQueue(req,res) {
        var userId=req.params.uid;
        var song=req.params.videoId;
        model.userModel.findUserById(userId)
            .then(
                function (user) {
                    var queue = user.queue;
                    for(item in queue){
                        if(queue[item].song==song){
                            queue.splice(item,1);
                        }
                    }
                    model.userModel.updateSongQueue(userId,queue)
                        .then(
                            function (response) {
                                res.send(200);
                            },
                            function (error) {
                                console.error("while adding song to queue");
                            }
                        )

                },
                function (error) {
                    console.log(error + "error adding sont ot queue in server user service")
                }
            )
    }

    function addSong2UserQueue(req,res) {
        var userId=req.params.uid;
        var song=req.body;
        model.userModel.findUserById(userId)
            .then(
                function (user) {
                    var queue = user.queue;
                    queue.push(song);
                    model.userModel.updateSongQueue(user._id,queue)
                        .then(
                            function (response) {
                                res.sendStatus(200);
                            },
                            function (error) {
                                console.error("while adding song to queue");
                            }
                        )

                },
                function (error) {
                    console.log(error + "error adding sont ot queue in server user service")
                }
            )
    }
    function createUser(req,res) {
        var user  = req.body;
        model.userModel.createUser(user)
            .then(
                function (user) {
                    res.send(user._id);
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );
    }
    function findUser(req, res) {
        if(req.body.password){
            findUserByCredentials(req,res)
        }
        else{
            findUserByUsername(req,res);
        }
        // var params = req.params;
        // var query = req.query;
        // if(query.password && query.username) {
        //     findUserByCredentials(req, res);
        // } else if(query.username) {
        //     findUserByUsername(req, res);
        // }
    }

    function getRecentSongByUser(req,res) {
        var userid = req.params['uid'];
        model.userModel.findUserById(userid)
            .then(
                function (userObj) {
                    res.send(userObj._doc.recent);
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            )
    }

    function addRecentSongByUser(req,res) {
        var userId = req.params.uid;
        var song = req.body;
        model.userModel.findUserById(userId)
            .then(
                function (user) {
                    var recentSongList = user._doc.recent;
                    var flag = true;
                    flag = isDuplicate(recentSongList,song);
                    if(!flag){
                        recentSongList.push(song);
                    }
                    model.userModel.addsong2Recent(user._id.toString(),recentSongList)
                        .then(
                            function (response) {
                                res.send(200);
                            },
                            function (error) {
                                console.error("while adding song to recent list");
                            }
                        )
                },
                function (error) {
                    console.log(error + "error adding song to recent in server user service")
                }
            )
    }

    function isDuplicate(recentSongs,song) {
        for(var i in recentSongs){
            if(recentSongs[i].videoId==song.videoId){
                return true;
            }
        }
        return false;
    }

    function findUserById(req,res){
        var id = req.params.uid;
        model.userModel.findUserById(id)
            .then(
                function (body) {
                    res.send(body);
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUserByCredentials(req,res){
       /* var user  = req.body;
        var username = user.username;
        var password = user.password;
        model.userModel.findUserByCredentials(username,password)
            .then(
                function (body) {
                    if(body){
                        res.send(body)
                    }else{
                        console.log("NO USER FOUND");
                        res.send('0');
                    }
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );*/
            var user = req.user;
            res.json(user);
    }

    function findUserByUsername(req, res) {
        var username = req.body.username;
        model.userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    }
                    else {
                        res.send('0');
                    }
                }),
            function (error) {
                res.statusCode(400).send(error);
            }
    }

    function updateUser(req,res){
        var user = req.body;
        model.userModel.updateUser(user,user._id)
            .then(
                function (body) {
                    res.send();
                },
                function (error) {
                    console.log(error);
                    res.send(error + "error updating in server");
                }
            );
    }

    function deleteUser(req,res){
        var uid= req.params['uid'];
        model.userModel.deleteUser(uid)
            .then(
                function (body) {
                    res.send(body)
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );
    }

    function getUserQueue(req,res){
        var id = req.params.uid;
        model.userModel.getUserQueue(id)
            .then(
                function (response) {
                    //reverse the array
                    response.queue.reverse();
                    res.send(response)
                },
                function (error) {
                    console.log(error);
                    res.sendStatus(400).send(error);
                }
            );
    }

    function uploadImage(request, response) {
        var userId= request.body.userId;
        var myFile        = request.file;
        console.log(myFile.filename)
        model.userModel.findUserById(userId)
            .then(function (user) {
                user.url="uploads/" + myFile.filename
                model.userModel.updateUser(user,userId)
                    .then(function (updatedUser) {
                        console.log(updatedUser);
                        response.redirect("/project/#/user/" + userId + "/profile");
                    })
            })

    }

}