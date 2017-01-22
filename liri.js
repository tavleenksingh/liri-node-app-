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
            if(error) {
              console.log('Error occurred: ' + error);
            }

        // else log my tweets and when they were created 
            else{
                for(i = 0; i < tweets.length; i++){
                  console.log("Tweet created at: " + tweets[i].created_at + '\n' + "My Tweet: " + tweets[i].text);
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
          console.log("Artist: " + songInfo.artists[0].name);
          console.log("Song Name: " + songInfo.name);
          console.log("Album: " + songInfo.album.name);
          console.log("Preview Link: " + songInfo.preview_url);
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
    console.log(queryUrl);

    // make a request to omdb api 
    request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover the required items  
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
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







