require("dotenv").config();

let keys = require("./keys");
let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let moment = require("moment");

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
  let params = {
    type: '',
    query: '',
    limit: 1
  }

  title ? params = {
    type: 'track',
    query: title,
    limit: 1
  } : '';

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
}




switch (command) {
  case 'get-tweets':
    get_Tweets();
    break;
  case 'spotify-this-song':
    search_Song(input);
    break;
  default:

}
