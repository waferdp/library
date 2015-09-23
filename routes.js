module.exports = function (app, Book) {
    
    var BookModel = Book;
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
            res.send(JSON.stringify(app.getLibrary()));
        }, function (error) {
            console.log("Token invalid");
            res.status(403);       
            res.send();
        });

    });
    
    app.getLibrary = function () {
        var bookPromise = new Promise(function (resolve, reject) {
            BookModel.find(function (err, books) {
                if (!err) {
                    resolve(books);
                }
                else {
                    console.log("Error listing books: " + err);
                    reject();
                }
            });
        });
    };
    
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
            res.send(JSON.stringify(app.getSpecificBook(req.body.id)));
        }, function (error) {
            res.status(403);
            res.send();
        });
    });

    app.getSpecificBook = function (bookId) {
        var bookPromise = new Promise(function (resolve, reject) {
            BookModel.findById(bookId, function (err, book) {
                if (!err) {
                    resolve(book);
                }
                else {
                    reject("Error retrieving book " + req.params.id + ": " + err);
                }
            });
        });
    }
    

    app.post('/api/library', function (req, res) {
        
        var token = getTokenFromRequest(req);
        var promise = app.tokenValidationPromise(token);
        
        promise.then(function (user) {
            var bookId = app.addBook(req.body);
            res.send(bookId);
        }, function (error) {
            res.status(403);
            res.send();
        });
    });
    
    app.addBook = function (bookData) {
        var book = new BookModel(bookData);
        book.save(function (err) {
            if (err) {
                console.log("Error creating book: " + err);
                return '';
            }
            else {
                return bookId;
            }
        });
    }

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
            app.deleteBook(req.body.id);
        }, function (error) {
            res.status(403);
            res.send();
        });
    });

    app.deleteBook = function (bookId) {
        BookModel.findById(bookId, function (err, book) {
            if (!err) {
                book.remove(function (err) {
                    if (err) {
                        console.log("Error when removing book " + book.title + ": " + err);
                    }
                });
            }
            else {
                console.log("Error finding book " + bookId + ": " + err);
            }
        });
    }
};