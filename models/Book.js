var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: String,
    cover: { meta: String, data: String },
    date: Date
}, {
    collection: 'books'
});

module.exports.BookModel = function(dbConnection) {
    return dbConnection.model('book', BookSchema)
};
