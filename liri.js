require("dotenv").config();

let keys = require("./keys");
let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let moment = require("moment");
let request = require("request");
let fs = require("fs");

let spotify = new Spotify(keys.spotify);
let twitter = new Twitter(keys.twitter);

let command = process.argv[2];
let input = process.argv[3];

function log_Data(str = '', type = '', time = moment().format('MM/DD/YY hh:mm:ss')) {

  if (type) {
    fs.appendFileSync('./log.txt', type + " request made at: " + time + '\n');
  }
  // log time and text of tweet to console
  if (str) {
    console.log(str);

    // lost data to file
    fs.appendFileSync('./log.txt', str);
  }

}

function get_Tweets() {
  log_Data('',"Tweet")

  // retrieve tweets from twitter
  twitter.get('statuses/user_timeline', function(err, response) {
    if (err) {
      return console.log(err);
    }
    // loop through array of tweets
    for (tweet of response) {

      // format "created_at" in a more legible format
      let timestamp = moment(tweet.created_at, 'ddd MMM DD hh:mm:ss ZZ YYYY').format('MM/DD/YY hh:mm:ss')

      // log time and text of tweet
      log_Data(timestamp + '  ' + tweet.text + "\n");
    }
    log_Data('\n')
  });
}

function search_Song(title) {

  let track = {};

  if (title) {
    let params = {
      type: 'track',
      query: title,
      limit: 1
    }

    // send search request to Spotify
    spotify.search(params, function(err, response) {

      if (err) {
        return console.log(err);
      }

      // set the first track in the response as the result
      track = response.tracks.items[0];

    });
  } else {
    spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE').then(function(response) {

      track = response;

    });
  }

  console.log("after call" + JSON.stringify(track, null, 2));

  log_Data("Artist: " + track.artists[0].name + '\n' +
    "Song Name: " + track.name + '\n' +
    "Preview: " + track.preview_url + '\n' +
    "Album Name: " + track.album.name + '\n\n',
    "Song");

}

function search_Movie(title = "Mr. Nobody") {

  // log request to files
  request('https://omdbapi.com/?t=' + title + '&apikey=trilogy', function(err, response, body) {
    let movie = JSON.parse(body);
    let rtScore = '';
    for (i of movie.Ratings) {
      i.Source === 'Rotten Tomatoes' ?
        rtScore = i.Value : '';
    }

    log_Data(
      "Title: " + movie.Title + '\n' +
      "Year: " + movie.Year + '\n' +
      "IMDB Score: " + movie.imdbRating + '\n' +
      "Rotten Tomatoes Rating: " + rtScore + '\n' +
      "Country: " + movie.Country + '\n' +
      "Language: " + movie.Language + '\n' +
      "Plot: " + movie.Plot + '\n' +
      "Actors: " + movie.Actors + '\n\n',
      "Movie"
    );

  });

}

if (!command) {
  let data = fs.readFileSync("./random.txt", "utf8");
  let arr = data.split(',');
  command = arr[0];
  input = arr[1];
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
    console.log("default case");
}
