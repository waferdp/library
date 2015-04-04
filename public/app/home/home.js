var libraryApp = angular.module('library-ui', []);

libraryApp.controller('libraryController', ['$http', '$scope', function ($http, $scope) {

    var library = this;
    library.books = [];

    $http.get('api/library').success(function (data) {
        library.books = data;
    });

    this.removeBook = function (book) {
        $http.delete('api/library/' + book._id);
        library.books = library.books.filter(function (element) {
            return element._id != book._id;
        });
    }

    this.editBook = function (book) {
        $scope.$broadcast('editBook', book);
    }


}]);

libraryApp.controller('bookController', ['$http', '$scope', function ($http, $scope) {
    this.book = {};
    this.book.cover = {};
    var bookControl = this;
    var bookCoverChooser;

    this.addBook = function (library) {
        var postBook = this.book;

        function bookWriteCallBack(data) {
            postBook._id = data;
            library.books.push(postBook);
            bookControl.book = {};
            bookControl.book.cover = {};
            bookCoverChooser.value = '';

            document.getElementById('bookCoverPreview').src = '';
        };

        if (this.book._id)
        {
            var bookId = this.book._id;
            delete this.book._id;
            delete this.book.$$hashKey;
            delete this.book.__v;
            var bookString = JSON.stringify(this.book);
            $http.put('api/library/' + bookId, bookString).success(bookWriteCallBack);
        }
        else
        {
            var bookString = JSON.stringify(this.book);
            $http.post('api/library', bookString).success(bookWriteCallBack);
        }
    };
    
    this.editReset = function () {
        this.book = {};
        this.book.cover = {};
        document.getElementById('bookCoverPreview').src = '';
    };

    $scope.bookWriteCallBack = function (data) {

    }

    $scope.handleFileSelect = function (event) {
        var files = event.target.files;
        var file = files[0];
        bookCoverChooser = event.target;
        if (files && file) {
            var reader = new FileReader();
            reader.onload = function (readerEvent) {
                var imageBase64Enc = btoa(readerEvent.target.result);
                bookControl.book.cover.meta = "data:" + file.type + ";base64,";
                bookControl.book.cover.data = imageBase64Enc;
                $scope.$apply();
            };

            reader.readAsBinaryString(file);
        }
    };

    $scope.$on('editBook', function(event, data) {
        data.date = new Date(data.date);
        bookControl.book = data;
        if(!data.cover)
        {
            data.cover = {};
        }
    });

}]);