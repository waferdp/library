var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();
var expressSession = require('express-session');

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT
app.use(flash());
app.use(expressSession({ secret: 'hamSandwich' }));
app.use(passport.initialize());
app.use(passport.session());



require('./routes.js')(app, passport);

app.listen(8000);	
console.log('Library server listening on port 8000'); 