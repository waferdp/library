// create the module and name it hostApp
var hostApp = angular.module('hostApp', ['ngRoute']);
var bookCoverData;
var bookCoverMetaData;

hostApp.config(function($routeProvider) {
 $routeProvider

	// route for the home page
	.when('/', {
		 templateUrl : 'app/home/home.html',
		 controller : 'mainController'
	 })

	 // route for the about page
	 .when('/about', {
		 templateUrl : 'app/about/about.html',
		 controller : 'aboutController'
	 })
	
});

hostApp.controller('mainController', ['$http' , '$scope', function($http, $scope) {

    var library = this;
    library.books = [];
    
    $http.get('api/library').success(function(data){
	library.books = data;
    });
    $scope.message = 'Welcome to our home web server!';
    
    this.removeBook = function(book)
    {
	$http.delete('api/library/' + book._id);
	library.books = library.books.filter(function(element) {
	    return element._id != book._id;
	});
    }


}]);

hostApp.controller('BookController', ['$http', function($http) {
    this.book = {};
    var bookControl = this;

    this.addBook = function(library) 
    {
	this.book.cover = {}; 
	this.book.cover.meta = bookCoverMetaData;
	this.book.cover.data = bookCoverData;
	var bookString = JSON.stringify(this.book);
	var postBook = this.book;
	$http.post('api/library', bookString).success(function(data){
	    postBook._id = data;
	    library.books.push(postBook);
	    bookControl.book = {};
	});
    };
    
    this.resetValidation = function(form)
    {
	form.$pristine = true;
	form.$dirty = false;
    };
}]);

hostApp.controller('aboutController', function($scope) {
    $scope.message = 'This is the about page.';
});

var handleFileSelect = function(event)
{
    var files = event.target.files;
    var file = files[0];
    if(files && file)
    {
	var reader = new FileReader();
	reader.onload = function(readerEvent) {
	    var imageBase64Enc = btoa(readerEvent.target.result);
	    bookCoverMetaData = "data:" + file.type + ";base64,";
	    bookCoverData = imageBase64Enc;
	};
	
	reader.readAsBinaryString(file);
    }
};

window.addEventListener('load', function(event) {
    document.getElementById('bookCover').addEventListener('change', handleFileSelect, false);
}, false);
