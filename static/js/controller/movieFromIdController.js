var movieFromIdController = function($scope, $http, $location, $routeParams, moviesInfoService)
{
	console.log("MovieFromIdController");

	// On récupère le param de l'url dans routeParam (voir le config route)
	var id = $routeParams.id;
	moviesInfoService.get(id).then(function(res){
		$scope.movieFromId = res;
	});
};