require("dotenv").config();

let keys = require("./keys");
let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let moment = require("moment");
let request = require("request");

let spotify = new Spotify(keys.spotify);
let twitter = new Twitter(keys.twitter);

let command = process.argv[2];
let input = process.argv[3];

function get_Tweets() {
  // retrieve tweets from twitter
  twitter.get('statuses/user_timeline', function(error, response) {
    if (err) {
      return console.log(err);
    }
    // loop through array of tweets
    for (tweet of response) {

      // format "created_at" in a more legible format
      let timestamp = moment(tweet.created_at, 'ddd MMM DD hh:mm:ss ZZ YYYY').format('MM/DD/YY hh:mm:ss')

      // log time and text of tweet
      console.log(timestamp + '  ' + tweet.text);
    }
  });
}

function search_Song(title) {

  if (title) {
    let params = {
      type: 'track',
      query: title,
      limit: 1
    }

    console.log(params);
    // send search request to Spotify
    spotify.search(params, function(err, response) {

      if (err) {
        return console.log(err);
      }

      // set the first track in the response as the result
      let track = response.tracks.items[0];

      // log the track information
      console.log("Artist: " + track.artists[0].name);
      console.log("Song Name: " + track.name);
      console.log("Preview: " + track.preview_url);
      console.log("Album Name: " + track.album.name);

    });
  } else {
    spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE').then(function(response) {

      let track = response;

      // log the track information
      console.log("Artist: " + track.artists[0].name);
      console.log("Song Name: " + track.name);
      console.log("Preview: " + track.preview_url);
      console.log("Album Name: " + track.album.name);


    });
  }
}

function search_Movie(title) {
  request('https://omdbapi.com/?t=' + title + '&apikey=trilogy', function(err, response, body) {
    
  });
}


switch (command) {
  case 'get-tweets':
    get_Tweets();
    break;
  case 'spotify-this-song':
    search_Song(input);
    break;
    case 'movie-this':
    search_Movie(input);
    break;
  default:

}
