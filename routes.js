var mongoose = require('mongoose');
var libraryConnection = mongoose.createConnection("mongodb://192.168.1.18/library");
var passPortConnection = mongoose.createConnection("mongodb://192.168.1.18/passport");

var User = require('./models/User').UserModel(passPortConnection);
var BookModel = require('./models/Book').BookModel(libraryConnection);

module.exports = function (app) {
    
    
    app.post('/login', function (req, res) {
        console.log(JSON.stringify(req.body));
        
        var username = req.body.username;
        var password = req.body.password;
        
        
        app.login(username, password).then(function (user) {
            res.status(200);
            res.send(user);
        }, function (error) {
            res.status(403);
            res.send('Bad username/password;');
        });
    });
    
    app.post('/signup', function (req, res) {
        
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email || "";
        // find a user in Mongo with provided username
        console.log("User registration: " + req.body.username + ":" + req.body.password);
        
        app.signup(username, password, email).then(function (newUser) {
            if (newUser) {
                res.status(200);
                res.send(newUser);
            }
        }, function (error) {
            console.error('Error in SignUp: ' + err);
            res.status(500);
            res.send('Error creating user: ' + error.message);
        });
    });
    
    app.get('/loggedin/:token', function (req, res) {
        
        var token = req.params.token;
        console.log(token);
        var promise = app.tokenValidationPromise(token);
        
        promise.then(function (user) {
            console.log("Succesfully validated token")
            res.status(204);
        }, function (error) {
            console.log("Token invalid")
            res.status(401);
            res.send("");
        });

    });

    app.get('/api/library', function (req, res) {
        
        var token = getTokenFromRequest(req);
        
        var promise = app.tokenValidationPromise(token);
        promise.then(function (user) {
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
        }, function (error) {
            console.log("Token invalid");
            res.status(403);            
            res.send();
        });

    });
    
    function getTokenFromRequest(req) {
        var token = req.get("Authorization") || null;
        token = trimTokenifBearer(token);
        return token;
    }

    function trimTokenifBearer(token) {
        if (token) {
            return token.replace('Bearer ', '');
        }
        return token;
    }
    
    function isTokenType(token, tokenType) {
        if (token && token.substr(0, tokenType.length) == tokenType) {
            return true;
        }
        return false;
    }



    app.get('/api/library/:id', function (req, res) {
        
        var token = getTokenFromRequest(req);
        
        var promise = app.tokenValidationPromise(token);
        promise.then(function (user) {
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
        }, function (error) {
            res.status(403);
            res.send();
        });
    });


    app.post('/api/library', function (req, res) {
        
        var token = getTokenFromRequest(req);
        var promise = app.tokenValidationPromise(token);
        
        promise.then(function (user) {
            var book = new BookModel(req.body);
            book.save(function (err) {
                if (err) {
                    console.log("Error creating book: " + err);
                }
                else {
                    res.send(book._id);
                }
            });
        }, function (error) {
            res.status(403);
            res.send();
        });
    });

    app.put('/api/library/:id', function (req, res) {
        
        var token = getTokenFromRequest(req);
        var promise = app.tokenValidationPromise(token);
        
        promise.then(function (user) {
            BookModel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) {
                    console.log("Error when updating book: " + req.body._id + ": " + err);
                }
                else {
                    res.send(req.params.id);
                }

            });
        }, function (error) {
            res.status(403);
            res.send();
        });
    });

    app.delete('/api/library/:id', function (req, res) {
        var token = getTokenFromRequest(req);
        var promise = app.tokenValidationPromise(token);
        
        promise.then(function (user) {
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
        }, function (error) {
            res.status(403);
            res.send();
        });
    });

};