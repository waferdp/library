var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var MongoClient    = require('mongodb').MongoClient;
var ObjectID	   = require('mongodb').ObjectID;
var Mongoose       = require('mongoose');

var app            = express();

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

var db = {};

var Book = new Schema({  
    title: { type: String, required: true },  
    author: { type: String, required: true },  
    isbn: { type: String },
    cover: { meta: string, data: string},
    date: { type: Date, default: Date.now }
});


MongoClient.connect("mongodb://localhost:27017/library", function(err, successDb) {
	db = successDb;
});

app.get('/api/library', function(req, res) {
	if(db != null)
	{
		db.collection('books', function(err, collection) {
			var allBooks = collection.find().toArray(function(err, items) {
				res.send(JSON.stringify(items));
			});
		});
	}	
});

app.post('/api/library', function(req,res) {

	console.log(req.body);
	if(db != null)
	{
	    db.collection('books', function(err, collection) {
			collection.insert(req.body);
			console.log(req.body._id);
			res.send(req.body._id);
		});
	}
});

app.delete('/api/library/:id', function(req,res){

	var query = {"_id" : new ObjectID(req.params.id)};
	
	if(db != null)
	{
		db.collection('books', function(err, collection) {
			collection.remove(query, {justOne : false}, function(err, itemsRemoved) {
			});
		});
	}
});

app.listen(8000);	
console.log('Simple static server listening on port 8000'); 