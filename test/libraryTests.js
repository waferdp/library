var app = {};
var assert = require("assert");
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var libraryConnection = mongoose.createConnection("mongodb://192.168.1.18/library");

var Book = require('../models/Book').BookModel(libraryConnection);
var library = require("../library.js")(Book);

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
    
    var testBookData = function () { 
        return {
            author : "Test author",
            cover : {
                data : "",
                meta : "data:image/jpeg;base64,"
            },
            date : "2015-01-01T00:00:00.000Z",
            isbn : "123456789",
            title : "Test title"
        };
    };

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

    describe('addBook(bookData)', function () {
        it('Adds a book to the library, and returns its new id', function (done) {
            var bookData = testBookData();
            var bookPromise = library.addBook(bookData);
            bookPromise.then(function (bookId) {
                assert(bookId);
                done();
            }, function (error) {
                console.error(error);
                assert.fail(bookData, null, "Rejected with error");
            });
        });
    });
    
    
    describe('updateBook(bookData)', function () {
        it('updates a book in the library if it exist', function (done) {
            var newBookData = testBookData();
            var addPromise = library.addBook(newBookData);
            addPromise.then(function (bookId) {
                newBookData.author = "Blank Blankingson";
                var updatePromise = library.updateBook(bookId, newBookData);
                updatePromise.then(function (bookId) {
                    assert(bookId);
                    done();
                }, function (error) {
                    console.error(error);
                    assert.fail(newBookData, null, "Rejected with error");
                });
            }, function (error) {
                console.log(error);
                assert.fail(newBookData, null, "Rejected with error");
            });
        });
    });

    describe('deleteBook(bookId)', function () {
        it('Deletes a book if it exists', function (done) {
            var libraryPromise = library.getLibrary();
            libraryPromise.then(function (books) {
                var deleteBookId = books[0].id;
                var deletePromise = library.deleteBook(deleteBookId);
                deletePromise.then(function () {
                    var bookPromise = library.getSpecificBook(deleteBookId);
                    bookPromise.then(function (book) {
                        assert.equal(book, null, "Expects book to be deleted");
                        done();
                    }, function (error) {
                        console.log(error);                                            
                        assert.fail(null, null,"Rejected with error");
                    });
                }, function (error) {
                    console.error(error);
                    assert.fail(deleteBookId, "Rejected with error");
                });
            }, function (error) {
                console.error(error);
                assert.fail(book, null, "Rejected with error");
            });
        });
    });

});
