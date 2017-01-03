var getMoviesController = function($scope, $http, $location, moviesInfoService) 
{
	var allMovies = moviesInfoService.getAllMovies().then(function(res){
		moviesInfoService.store(res);
		$scope.movies = res;
		console.log("number of M "+moviesInfoService.getNumberOfMovies());
	});

	$scope.retrievemoviesfromMDB = function()
	{
		moviesInfoService.retrievemoviesfromMDB()
		.then(function(response){
			console.log("GetMoviesController : Callback from retrievemoviesfromMDB");
			if(response)
			{
				moviesInfoService.selectAllMoviesFromDB()
				.then(function(data){
					console.log("GetMoviesController : Callback from selectAllMoviesFromDB");
					if(data)
					{
						moviesInfoService.store(data);
						$scope.movies = data;	
					}
					else
					{
						console.log("GetMoviesController : No response from Callback from selectAllMoviesFromDB");
					}
					
				});
			}
			else
			{
				console.log("GetMoviesController : No response from Callback from retrievemoviesfromMDB");
			}
		});
	}
};