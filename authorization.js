var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
var btoa = require('btoa');

var passPortConnection = mongoose.createConnection("mongodb://192.168.1.18/passport");

var User = require('./models/User').UserModel(passPortConnection);

module.exports = function (app) {

    var validPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }

    app.login = function (username, password) {
        
        return new Promise(function (resolve, reject) {
            User.findOne({ username: username },
                function (err, user) {
                if (err) {
                    console.error('Error finding user');
                    reject(err);;
                }
                if (!user) {
                    console.log('No user found');
                    reject('Could not match user/password');
                }
                if (!validPassword(user, password)) {
                    console.log('Bad password for user', user)
                    reject('Could not match user/password');
                }
                console.log("login successful for user: " + user.username)
                resolve(user);
            });
        })
    };
   
    app.signup = function (username, password, email) {
        
        var signupPromise = new Promise(function (resolve, reject) {
            
            User.findOne({ 'username': username }, function (err, user) {
                // In case of any error return
                if (err) {
                    reject('Error creating user: ' + error.message);
                }
                // already exists
                if (user) {
                    reject('User already exists');
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();
                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.token = btoa(createHash(new Date().getTime()));
                    newUser.email = email;
                    
                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        resolve(newUser);
                    });
                }
            });
        });
    };
    
    
    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    app.validateToken = function (token, resolve, reject) {
        User.findOne({ token: token }, function (err, user) {
            if (err) {
                console.error('Error finding user');
                reject("Error in database");
            }
            else if (!user) {
                reject("Bad token");
            }
            else {
                console.log("token found for user: " + user.username)
                resolve(user);
            }
        });
    }
    
    app.tokenValidationPromise = function (token) {
        return new Promise(function (resolve, reject) {
            app.validateToken(token, resolve, reject);
        });
    }

};