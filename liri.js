// Grab the required packages
var request = require("request");
var twitter = require("twitter");
var spotify = require("spotify");
var fs = require("fs");

// Store all of the arguments in an array
var nodeArgs = process.argv;

// Store the argument at index number 2 as the user command
var userCommand = nodeArgs[2];

// Create an empty variable for holding the movie or song name
var queryName = "";

  // Loop through all the words in the node argument
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      queryName = queryName + "+" + nodeArgs[i];
    }else {
      queryName += nodeArgs[i];
    }
  }

console.log(queryName);

// We will then create a switch-case statement to check what the user command is and then run the approprite function
switch (userCommand) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
}

// myTweets function definition
function myTweets(){

  // Using the require keyword lets us access all of the exports
  // in our keys.js file
  var keys = require("./keys.js");

  //Instantiate the twitter component 
  var client = new twitter({
      consumer_key: keys.twitterKeys.consumer_key,
      consumer_secret: keys.twitterKeys.consumer_secret,
      access_token_key: keys.twitterKeys.access_token_key,
      access_token_secret: keys.twitterKeys.access_token_secret
  });

  // make a get request to twitter API in order to get the tweets from your account as specified by the screen name and count is set to 20
  var params = {screen_name: 'tavleens104', count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {

        // if there is an error lo it
        if(error){
              console.log('Error occurred: ' + error);
        }

        // else log my tweets and when they were created 
        else{
            //loop through all my tweets and log them
            for(i = 0; i < tweets.length; i++){
                var logTweets = "Tweet created at: " + tweets[i].created_at + '\n' + "My Tweet: " + tweets[i].text + '\n' + "_____________________________" + '\n';
                console.log(logTweets);

                // appending my tweets to the log.txt file
                fs.appendFile("log.txt", logTweets, function(err) {

                    // If an error was experienced we say it.
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
  });
}
 


// spotifyThisSong function definition
function spotifyThisSong() {

  //create a variable to hold the user input 
  var song = queryName;

  //if there is no user input then default to song "The Sign"
    if(queryName === ""){
      song === "The Sign";
    }

  // Make a call to Spotify API to search for the track input given by user and log in the details asked as part of this homework
  spotify.search({ type: 'track', query: song }, function(err, data) {
    // if there is any error log that
      if(err){
          console.log('Error occurred: ' + err);
          return;  //from spotify npm docs
      }
    // if no error return the required infromation
      else {
          var songInfo = data.tracks.items[0];
          var artist = "Artist: " + songInfo.artists[0].name;
          var songName = "Song Name: " + songInfo.name;
          var album = "Album: " + songInfo.album.name;
          var preview = "Preview Link: " + songInfo.preview_url;
          var songLog = artist + "\n" + songName + "\n" + album + "\n" + preview + "\n" + "___________________";

          // log all the information to console
          console.log(songLog);

          // appending my song data to the log.txt file
          fs.appendFile("log.txt", songLog, function(err) {

                    // If an error was experienced we say it.
                    if (err) {
                        console.log(err);
                    }
           });

      }
  });
}


//movieThis function definition
function movieThis(){
    //create a variable to hold the user input 
    var movie = queryName;
      //if there is no user input then default to movie "Mr. Nobody"
      if(queryName === ""){
        movie === "Mr. Nobody";
        console.log(movie);
      }
    // create variable to hold the query url to query omdb
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json&tomatoes=true";

    // This line is just to help us debug against the actual URL.
    console.log("queryURL: " + queryUrl);

    // make a request to omdb api 
    request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover the required items  
      var title = "Title: " + JSON.parse(body).Title;
      var year = "Year: " + JSON.parse(body).Year;
      var rating = "IMDB Rating: " + JSON.parse(body).imdbRating;
      var country = "Country: " + JSON.parse(body).Country;
      var language = "Language: " + JSON.parse(body).Language;
      var plot = "Plot: " + JSON.parse(body).Plot;
      var actors = "Actors: " + JSON.parse(body).Actors;
      var tomatorating = "Tomato Rating: " + JSON.parse(body).tomatoRating;
      var tomatourl = "Tomato URL: " + JSON.parse(body).tomatoURL;

      var movieData = title + "\n" + year + "\n" + rating + "\n" + country + "\n" + language + "\n" + plot + "\n" + actors + "\n" + tomatorating + "\n" + tomatourl + "\n" + "_____________________";

      //logging movie data to console and appending to log.txt
      console.log(movieData);

        // appending my song data to the log.txt file
        fs.appendFile("log.txt", movieData, function(err) {

            // If an error was experienced we say it.
            if (err) {
                  console.log(err);
            }
        });
      }
  });
}

// doWhatItSays function definition
function doWhatItSays(){

// This block of code will read from the "random.txt" file.
// The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function(error, data) {

  // We will then print the contents of data
      console.log(data);

  // Then split it by commas (to make it more readable)
      var dataArr = data.split(",");

  // We will then re-display the content as an array for later use.
      console.log(dataArr);
  
  // Then set the queryname to be the content from array at index position 1 and then run spotifyThisSong function with the newly generated queryName
      queryName = dataArr[1];
      console.log(queryName);
      spotifyThisSong();

    });
}







