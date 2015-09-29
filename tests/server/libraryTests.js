var app = {};
var assert = require("assert");
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var libraryConnection = mongoose.createConnection("mongodb://192.168.1.18/library");
var Book = require('../../models/Book').BookModel(libraryConnection);

var library = require("../../library.js")(Book);

describe('library.js', function () {
    
    beforeEach(function (done) {
        mockgoose.reset();
        Book.create({
            _id : mongoose.Types.ObjectId("551c4e5e524ee6ac19bff882"),
            author : "Amy Nicholson",
            cover : {
                data : "",
                meta : "data:image/jpeg;base64,"
            },
            date : "2015-04-14T22:00:00.000Z",
            isbn : "0714868019",
            title : "Tom Cruise: Anatomy of an Actor"
        }, function (err, model) {
            done(err);
        });
    });
    
    afterEach(function (done) {
        //Reset the database after every test.
        mockgoose.reset();
        done();
    });
    
    describe('getLibrary()' , function () {
        it('Returns all books', function (done) {
            var booksPromise = library.getLibrary();
            booksPromise.then(function (books) {
                assert.notEqual(books.length, 0, "Result contains books");
                done();
            }, function (error) {
                console.error("Error retrieving all books: " + error);
                assert.equal(1, 0);
            });
        });
    });
    
    describe('getSpecificBook(bookId)', function () {
        it('Returns book specified by id if it exists', function (done) {
            var booksPromise = library.getLibrary();
            booksPromise.then(function (books) {
                var searchBook = books[0];
                var specificBookPromise = library.getSpecificBook(searchBook._id);
                specificBookPromise.then(function (book) {
                    assert.equal(searchBook.id, book.id);
                    done();
                }, function (error){
                    console.log(error);                    
                    assert.equal(1, 0);
                });
            }, function (error) {
                console.error("Error retrieving all books: " + error);
                assert.equal(1, 0);
            });
        });

        it('Rejects with error if no book exists', function (done) {
            var bookPromise = library.getSpecificBook(-1);
            bookPromise.then(function (book) {
                assert.fail(book, "reject", "Should reject for -1");
            }, function (error) {
                assert(error);
                done();
            });
        });
    });

});
