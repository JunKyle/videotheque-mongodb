
var app = angular.module("Videotheque", ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
		.when('/', {
			templateUrl: '../template/listMovies.html',
			controller: getMoviesController
		})

		.when('/movie/:id', {
			templateUrl: '../template/movieDetail.html',
			controller: movieFromIdController
		})

		.otherwise({
			redirectTo: '/'
		});
});
app.service("moviesInfoService", MoviesInfoService);
app.controller('MovieFromIdController', movieFromIdController);
app.controller('GetMoviesController', getMoviesController);