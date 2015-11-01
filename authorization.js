var jws = require('jws');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (UserModel, secretKey) { 

    var User = UserModel;
    var _secret = secretKey || '';
    

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
                resolve(createToken(user.username));
            });
        })
    };
    
    var createToken = function (username) {
        var token = {
            header: { alg: 'HS256' },
            payload: username,
            secret: _secret
        };

        var signature = jws.sign({
            header: { alg: 'HS256' },
            payload: username,
            secret: _secret
        });
        console.log(signature);
        return signature;
    }
    

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
                    newUser.email = email;
                
                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        resolve(createToken(newUser.username));
                    });
                }
            });
        });
        return signupPromise;
    };

    var validateToken = function (token) {
        return new Promise(function (resolve, reject) {
            //var decodedToken = jws.decode(token);
            //Only allow HS256 to avoid 'none'.
            var valid = jws.verify(token, 'HS256', secretKey);
            
            if (valid) {
                resolve(token);
            }
            else {
                reject(token);
            }
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
        validateToken : validateToken,
    };
};

