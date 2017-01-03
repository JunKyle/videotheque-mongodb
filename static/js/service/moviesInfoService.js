var MoviesInfoService = function ($http, $q)
{
	this.movies =  null;
	this.messages = null;
	this.status = null;

	this.store = function (data)
	{
		console.log("Store : " + data);
		this.movies = data;
	}
	this.getNumberOfMovies = function()
	{
		return (this.movies === null)? 0 : this.movies.length;
	}

	this.getAllMovies = function()
	{
		var deferred = $q.defer();
		if(this.movies == null || this.movies.length == 0)
		{
			console.log("GetMoviesController : no movies loaded");
			this.selectAllMoviesFromDB()
			.then(function(data){
				console.log("GetMoviesController : Callback from selectAllMoviesFromDB");
				if(data)
				{					
					deferred.resolve(this.movies);
				}
				else
				{
					console.log("GetMoviesController : No response from Callback from selectAllMoviesFromDB");
				}

			});
		}
		else
			deferred.resolve(this.movies);
		return deferred.promise;
	}

	this.get=function(id){
		var deferred = $q.defer();
		console.log("Etat des movies :");
		console.log(this.movies);
		if (this.movies === null)
		{
			console.log("MoviesInfoService: Must reload movies");
			this.selectAllMoviesFromDB().then(function() {
						deferred.resolve(getMovieFromId(id));
					});
		}
		else
		{
			console.log("MoviesInfoService :Get movie ID");
			deferred.resolve(getMovieFromId(id));
		}
		return deferred.promise;
	};

	var getMovieFromId = function(id)
	{		
		for (var i = 0; i < this.movies.length; i++) {
			if(this.movies[i].id == id)
			{
				console.log("MoviesInfoService :Selected movie : " +this.movies[i]);
				return this.movies[i];
			}
		}		
	}

	// méthode avec callback donc c'est une promise !
	this.retrievemoviesfromMDB = function()
	{
		console.log("MoviesInfoService : retrievemoviesfromMDB");
        var deferred = $q.defer();
		$http({
			method : "GET",
			url : "../retrievemoviesfromMDB"
		}).success(function(data){
			console.log("MoviesInfoService :Data received : " + data);
			//Movies from MDB well stored
			deferred.resolve(true);
		})
		.error(function(data, status){	
			console.log(data + " and "+ status)	;
	           this.messages = data || "Request failed";
	           this.status = status;

		});
		return deferred.promise;
	}

	// méthode avec callback donc c'est une promise !
	this.selectAllMoviesFromDB = function ()
	{
		var self = this;
		console.log("MoviesInfoService : selectAllMoviesFromDB");
        var deferred = $q.defer();
		$http({
			method : "GET",
			url : "../selectAllMoviesFromDB"
		}).success(function(data){
			console.log("MoviesInfoService : Data received : " + data);
			// Store movies into service
			this.movies = data;
			self.movies = data;

			deferred.resolve(data);
		})
		.error(function(data, status){	
			console.log(data + " and "+ status)	;
	           this.messages = data || "Request failed";
	           this.status = status;

		});
		return deferred.promise;
	}
}