var bCrypt = require('bcrypt-nodejs');
var btoa = require('btoa');

module.exports = function (UserModel) { 

    var User = UserModel;
    
    var login = function (username, password) {
        return new Promise(function (resolve, reject) {
            User.findOne({ username: username },
                    function (err, user) {
                if (err) {
                    Console.error(err);
                    reject(err);
                }
                if (!user) {
                    reject('Could not match user/password');
                }
                if (!validPassword(user, password)) {
                    reject('Could not match user/password');
                }
                resolve(user);
            });
        })
    };

    var signup = function (username, password, email) {
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
        return signupPromise;
    };

    var validateToken = function (token, resolve, reject) {
        User.findOne({ token: token }, function (err, user) {
            if (err) {
                console.error('Error finding user');
                reject("Error in database");
            }
            else if (!user) {
                reject("Bad token");
            }
            else {
                resolve(user);
            }
        });
    };

    var tokenValidationAsync = function (token) {
        return new Promise(function (resolve, reject) {
            validateToken(token, resolve, reject);
        });
    };
  

    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };


    var validPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
        };
    

    return {
        login : login,
        signup : signup,
        tokenValidationAsync : tokenValidationAsync
    };

};

