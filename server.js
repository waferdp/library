var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var app = express();

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 				            // log every request to the console
app.use(bodyParser.json()); 				        // pull information from html in POST
app.use(methodOverride()); 					        // simulate DELETE and PUT

var libraryConnection = mongoose.createConnection("mongodb://192.168.1.18/library");
var Book = require('./models/Book').BookModel(libraryConnection);

var passPortConnection = mongoose.createConnection("mongodb://192.168.1.18/passport");
var User = require('./models/User').UserModel(passPortConnection);

var auth = require('./authorization.js')(app, User);
var routes = require('./routes.js')(app, Book);

app.listen(8000);	
console.log('Library server listening on port 8000'); 