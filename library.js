

module.exports = function (BookModel) {
    var Book = BookModel;
    
    
    var getLibrary = function () {
        var bookPromise = new Promise(function (resolve, reject) {
            Book.find(function (err, books) {
                if (!err) {
                    resolve(books);
                }
                else {
                    reject("Error listing books: " + err);
                }
            });
        });
        return bookPromise;
    };
    
    var getSpecificBook = function (bookId) {
        var bookPromise = new Promise(function (resolve, reject) {
            Book.findById(bookId, function (err, book) {
                if (!err) {
                    resolve(book);
                }
                else {
                    reject("Error retrieving book " + bookId + ": " + err);
                }
            });
        });
        return bookPromise;
    };
    
    var basicHandling = function (res, promise) {
        promise.then(function (result) {
            res.status(200);
            res.send(JSON.stringify(result));
        }, function (error) {
            res.status(500);
            res.send(error);
        });
    };
    
    var addBook = function (bookData) {
        var bookPromise = new Promise(function (resolve, reject) {
            var book = new Book(bookData);
            book.save(function (err) {
                if (err) {
                    console.log();
                    reject("Error creating book: " + err);
                }
                else {
                    resolve(book._id);
                }
            });
        });
        return bookPromise;
    };
    
    
    var updateBook = function (bookId, book) {
        var bookPromise = new Promise(function (resolve, reject) {
            Book.findByIdAndUpdate(bookId, book, function (err, post) {
                if (err) {
                    reject("Error when updating book: " + bookId + ": " + err);
                }
                else {
                    resolve(bookId);
                }
            });
        });
        return bookPromise;
    };
    
    var deleteBook = function (bookId) {
        BookModel.findById(bookId, function (err, book) {
            if (!err) {
                book.remove(function (err) {
                    if (err) {
                        console.log("Error when removing book " + book.title + ": " + err);
                    }
                });
            }
            else {
                console.log("Error finding book " + bookId + ": " + err);
            }
        });
    };

    return {
        getLibrary : getLibrary,
        getSpecificBook : getSpecificBook,
        basicHandling : basicHandling,
        addBook: addBook,
        updateBook : updateBook,
        deleteBook : deleteBook
    };
};