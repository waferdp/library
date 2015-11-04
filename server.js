var express         = require('express');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var mongoose        = require('mongoose');
var http            = require('http');
var https           = require('https');
var crypto          = require('crypto');
var fs              = require('fs');

var app = express();

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 				            // log every request to the console
app.use(bodyParser.json()); 				        // pull information from html in POST
app.use(methodOverride()); 					        // simulate DELETE and PUT

var libraryConnection = mongoose.createConnection("mongodb://192.168.1.18/library");
var Book = require('./models/Book').BookModel(libraryConnection);

var passPortConnection = mongoose.createConnection("mongodb://192.168.1.18/passport");
var User = require('./models/User').UserModel(passPortConnection);

var secretKey = 'ManBearPig';

var privateKey = fs.readFileSync('key.pem').toString();
var certificate = fs.readFileSync('cert.pem').toString();

var credentials = {
    key: privateKey,
    cert: certificate,
    passphrase: secretKey
}
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


var auth = require('./authorization.js')(User, secretKey);
var library = require('./library.js')(Book);
var routes = require('./routes.js')(app, library, auth);

httpServer.listen(8000);
httpsServer.listen(443);
console.log('Library server listening on port 8000'); 