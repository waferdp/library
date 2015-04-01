var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var app            = express();

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT


mongoose.connect("mongodb://localhost/library");
var db = mongoose.connection;


var BookSchema = new mongoose.Schema({  
    title: { type: String, required: true },
    author: { type: String, required: true},
    isbn: String,
    cover: { meta: String, data: String},
    date: Date 
},{
    collection: 'books'
});

var BookModel = mongoose.model('book',BookSchema);

app.get('/api/library', function(req, res) {
    if(db != null)
    {
	BookModel.find(function(err, books) {
	    if(!err) {
		res.send(JSON.stringify(books));
	    }
	    else {
		console.log("Error listing books: " + err);
	    }
	});

   }	
});

app.post('/api/library', function(req,res) {

    var book = new BookModel(req.body);
    book.save(function(err){
	if(err)
	{
	    console.log("Error creating book: " + err);
	}
	else
	{
	    res.send(book._id);
	}
    });
});

app.delete('/api/library/:id', function(req,res){

    var query = {"_id" : new ObjectID(req.params.id)};
    
    if(db != null)
    {
	BookModel.findById(req.params.id, function(err, book) {
	    if(!err) {
		book.remove(function(err) {
		    if(err) {
			console.log("Error when removing book " + book.title + ": " + err);
		    }
		});
	    }
	    else {
		console.log("Error finding book " + req.params.id + ": " + err);
	    }
	});
    }
});

app.listen(8000);	
console.log('Library server listening on port 8000'); 