var http = require("http");
var express = require("express");
var app = express();
var fs = require("fs");
var request = require("request");


var apikey = "b4d1641a0e4683906ea839a3a350efcb";
var movieFolder = './movies/';

var numMovies = 0;
var countMovie = 0;


app.set("view engine", "twig");
app.set("views", "./views");

var server = http.createServer(app);

// on créé un middleware pour insérer un article dans la collection
app.get("/retrievemoviesfromMDB", process_retrievemoviesfromMDB);

app.get("/selectAllMoviesFromDB", process_selectAllMoviesFromDB);

app.get("/selectMovieInfoFromDB", process_selectMovieInfoFromDB);

app.use("/", express.static("./static"));
app.use(express.static(__dirname + '/videotheque-mongodb'));

//database initialization
var ObjectID = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;

var db = null;
server.listen(8080);

MongoClient.connect("mongodb://localhost:27017/videotheque",
	function(err, mydb){
		db = mydb;
		if(!err)
		{
			console.log("We are connected");
		}
		else
		{
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}

		db = mydb;
		init_database();
	});

function init_database()
{	
	db.collection("movies", {strict:true}, function(err){
		if(err){
			console.log("creating movies");
			db.createCollection("movies");
		}
	});
}

function process_selectAllMoviesFromDB(req, res)
{
	var collection = db.collection("movies");
	collection.find({})
		.toArray(function(err, rows){
			console.log("recovering all movies");
			for(var i=0; i < rows.length; i++)
			{
				//poster_path, overview, release_date, id, original_title
				rows[i].id = rows[i]._id.toString();
				rows[i].original_title = rows[i].original_title.toString();
				rows[i].overview = rows[i].overview.toString();
				rows[i].release_date = rows[i].release_date.toString();
				rows[i].poster_path = rows[i].poster_path.toString();
			}
			return res.send(rows);
		});
}

function process_retrievemoviesfromMDB(req, res)
{
	countMovie = 0;
	// read folder
	fs.readdir(movieFolder, (err, files) => {
		numMovies = files.length;
		files.forEach(file => 
		{
			var fileTitle = file.replace(/\.[^/.]+$/, "");
			fileTitle = fileTitle.replace(/\s/g, "+");
			console.log(fileTitle);

			//Call to api
			var url = "https://api.themoviedb.org/3/search/movie?api_key="+apikey +"&query="+ fileTitle;

			// Request response
			request(url, function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					//Create json object
					var jsonObject = JSON.parse(body);
					
					//Select first movie
					var movie = jsonObject.results[0];

					addMovieToDB(movie, function(requestsEnded){
						console.log("Finished count is "+countMovie);
						return res.send("Finished count is "+ countMovie);
					});
				}
				else
				{
					console.log("Error : " + error);
				}
			});

		});
	});
}


function addMovieToDB(result, callback)
{
	var collection = db.collection("movies");

	//poster_path, overview, release_date, id, original_title
	collection.insertOne(
		{
			_id: result.id,
			original_title: result.original_title,
			overview: result.overview,
			release_date: result.release_date,
			poster_path: result.poster_path
		},
		function(err,res) 
		{
			if(err)
			{
				//console.log("add err="+err);
			}
			countMovie++;
			if(countMovie >= numMovies)
			{
				callback(true);
			}
			//res.redirect("/");
		}
	);
}

function addGenresFromMovieToDB(result, callback)
{
	var collection = db.collection("film-genres");

	for(var i=0; i < result.genre_ids.length; i++)
	{
		//film_id, genre_id
		collection.insertOne(
			{
				//_id : generated
				film_id : result.id,
				genre_id : result.genre_ids[i]
			},
			function(err,res) 
			{
				if(err)
				{
					//console.log("add err="+err);
				}
				//res.redirect("/");
			}
		);
	}
}

/*function process_sell(req, res)
{
	var collection = db.collection("articles");
	collection.insertOne(
			{
				description: req.query.description,
				prix: Number(req.query.prix),
				date: new Date()
			},
			function(err, result){
				console.log("add err= "+err);
				res.redirect("/");
			}
		);
}

function process_search(req, res)
{
	var what = new RegExp(req.query.quoi, "i");
	var collection = db.collection("articles");
	collection.find(
			{
				description: what
			}
		).toArray(function(err, rows){
			for(var i=0; i < rows.length; i++)
			{
				rows[i].id = rows[i]._id.toString();
			}
			//res.send(rows);
			res.render("articles", {aa:rows});
		});
}

function process_select(req, res)
{
	var id = new ObjectID(req.query.id);
	var collection = db.collection("articles");
	collection.findOne(
		{
			_id: id
		},
		function(err, doc)
		{
			doc.id = doc._id.toString();
			res.render("offre", {d:doc});
		});
}

function process_bid(req, res)
{	
	var id = new ObjectID(req.query.id);
	var p = Number(req.query.prix);
	var e = req.query.email;
	var d = Date.now();
	var collection = db.collection("articles");
	collection.update(
			{
				_id: id
			},
			{
				$set:{prix:p, date:d, email:e}
			},
			function(err, result)
			{
				if(err)
				{
					console.log("update err= "+err);
				}
				res.redirect("/");
			}
		);
}*/