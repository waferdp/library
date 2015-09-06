var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');


var libraryConnection = mongoose.createConnection("mongodb://192.168.1.18/library");
var passPortConnection = mongoose.createConnection("mongodb://192.168.1.18/passport");

var User = require('./models/User').UserModel(passPortConnection);
var BookModel = require('./models/Book').BookModel(libraryConnection);


module.exports = function (app, passport) {

    var validPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {
        User.findOne({ username: username },
            function (err, user) {
                if (err) {
                    console.error('Error finding user');
                    return done(err, false, { message: 'Error searching for user.' });
                }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!validPassword(user, password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                console.log("login successful for user: " + user.username)
                return done(null, user);
            });
    }));

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/#/',
        failureFlash: true
    }));


    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/#',
        failureFlash: true
    }));


    passport.use('signup', new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {
        findOrCreateUser = function () {
            // find a user in Mongo with provided username
            console.log(username);
            User.findOne({ 'username': username }, function (err, user) {
                // In case of any error return
                if (err) {
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                }
                // already exists
                if (user) {
                    console.log('User already exists');
                    return done(null, false, req.flash('message', 'User Already Exists'));
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();
                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.token = createHash(new Date().getTime());
                    newUser.email = req.params('email');

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, newUser);
                    });
                }
            });
        };

        // Delay the execution of findOrCreateUser and execute 
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    })
    );

    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    app.get('/api/library', function (req, res) {
        console.log(req.session);
        if (libraryConnection != null) {
            BookModel.find(function (err, books) {
                if (!err) {
                    res.send(JSON.stringify(books));
                }
                else {
                    console.log("Error listing books: " + err);
                }
            });
        }
    });

    app.get('/loggedin', passport.authenticate('login', {
        failureRedirect: '/#/auth',
        failureFlash : true
    }));

    app.get('/api/library/:id', function (req, res) {
        if (libraryConnection != null) {
            BookModel.findById(req.params.id, function (err, book) {
                if (!err) {
                    res.send(JSON.stringify(book));
                }
                else {
                    console.log("Error retrieving book " + req.params.id + ": " + err);
                }
            });

        }
    });


    app.post('/api/library', function (req, res) {

        var book = new BookModel(req.body);
        book.save(function (err) {
            if (err) {
                console.log("Error creating book: " + err);
            }
            else {
                res.send(book._id);
            }
        });
    });

    app.put('/api/library/:id', function (req, res) {
        BookModel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) {
                console.log("Error when updating book: " + req.body._id + ": " + err);
            }
            else {
                res.send(req.params.id);
            }

        });
    });

    app.delete('/api/library/:id', function (req, res) {

        if (libraryConnection != null) {
            BookModel.findById(req.params.id, function (err, book) {
                if (!err) {
                    book.remove(function (err) {
                        if (err) {
                            console.log("Error when removing book " + book.title + ": " + err);
                        }
                    });
                }
                else {
                    console.log("Error finding book " + req.params.id + ": " + err);
                }
            });
        }
    });

};