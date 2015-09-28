var app = {};
var assert = require("assert");
var mongoose = require('mongoose');

var libraryConnection = mongoose.createConnection("mongodb://192.168.1.18/library");
var Book = require('../../models/Book').BookModel(libraryConnection);

var library = require("../../library.js")(Book);

describe('library.js', function () {
    describe('getLibraryAsync()' , function () {
        it('Returns all books', function (done) {
            var booksPromise = library.getLibrary();
            booksPromise.then(function (books) {
                assert(books, "Result contains books");
                done();
            }, function (error) {
                console.log(error);
                assert.equal(1, 0);
            });
        });
    });
    
    describe('getSpecificBook()', function () {
        it('Returns book specified by id if it exists', function (done) {
            var booksPromise = library.getLibrary();
            booksPromise.then(function (books) {
                var searchBook = books[0];
                var specificBookPromise = library.getSpecificBook(searchBook.id);
                specificBookPromise.then(function (book) {
                    assert.equal(searchBook.id, book.id);
                    done();
                }, function (error){
                    console.log(error);                    
                    assert.equal(1, 0);
                });
            }, function (error) {
                console.log(error);
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
