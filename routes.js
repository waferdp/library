module.exports = function (app, library, auth) {
    

    app.post('/login', function (req, res) {
        console.log(JSON.stringify(req.body));
        
        var username = req.body.username;
        var password = req.body.password;
        
        auth.login(username, password).then(function (user) {
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
        
        auth.signup(username, password, email).then(function (newUser) {
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
        var promise = auth.tokenValidationAsync(token);
        
        promise.then(function (user) {
            res.status(204);
        }, function (error) {
            res.status(401);
            res.send("");
        });

    });

    app.get('/api/library', function (req, res) {
        
        var token = getTokenFromRequest(req);
        
        var promise = auth.tokenValidationAsync(token);
        promise.then(function (user) {
            var bookPromise = library.getLibraryAsync();
            app.basicHandling(res, bookPromise);
        }, function (error) {
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
        
        var promise = auth.tokenValidationAsync(token);
        promise.then(function (user) {
            var bookPromise = library.getSpecificBook(req.body.id);
            app.basicHandling(res, bookPromise);
        }, function (error) {
            res.status(403);
            res.send();
        });
    });

    app.post('/api/library', function (req, res) {
        
        var token = getTokenFromRequest(req);
        var promise = auth.tokenValidationAsync(token);
        
        promise.then(function (user) {
            var bookPromise = library.addBook(req.body);
            app.basicHandling(res, bookPromise);
        }, function (error) {
            res.status(403);
            res.send();
        });
    });

    app.put('/api/library/:id', function (req, res) {
        
        var token = getTokenFromRequest(req);
        var promise = auth.tokenValidationAsync(token);
        
        promise.then(function (user) {
            var bookPromise = library.updateBook(req.params.id, req.body);
            app.basicHandling(res, bookPromise);
        }, function (error) {
            res.status(403);
            res.send();
        });
    });

    app.delete('/api/library/:id', function (req, res) {
        var token = getTokenFromRequest(req);
        var promise = auth.tokenValidationAsync(token);
        
        promise.then(function (user) {
            library.deleteBook(req.body.id);
            res.status(204);
            res.send();
        }, function (error) {
            res.status(403);
            res.send();
        });
    });
};