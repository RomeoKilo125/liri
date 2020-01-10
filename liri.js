require('dotenv').config()

const keys = require('./keys')
const Spotify = require('node-spotify-api')
const Twitter = require('twitter')
const moment = require('moment')
const request = require('request')
const fs = require('fs')

const spotify = new Spotify(keys.spotify)
const twitter = new Twitter(keys.twitter)

let command = process.argv[2]
let input = process.argv[3]

function logData (str = '', type = '', time = moment().format('MM/DD/YY hh:mm:ss')) {
  if (type) {
    fs.appendFileSync('./log.txt', type + ' request made at: ' + time + '\n')
  }
  // log time and text of tweet to console
  if (str) {
    console.log(str)

    // lost data to file
    fs.appendFileSync('./log.txt', str)
  }
}

function getTweets () {
  logData('', 'Tweet')

  // retrieve tweets from twitter
  twitter.get('statuses/user_timeline', function (err, response) {
    if (err) {
      return console.log(err)
    }
    // loop through array of tweets
    for (const tweet of response) {
      // format 'created_at' in a more legible format
      const timestamp = moment(tweet.created_at, 'ddd MMM DD hh:mm:ss ZZ YYYY').format('MM/DD/YY hh:mm:ss')

      // log time and text of tweet
      logData(timestamp + '  ' + tweet.text + '\n')
    }
    logData('\n')
  })
}

function searchSong (title) {
  let track = {}

  if (title) {
    const params = {
      type: 'track',
      query: title,
      limit: 1
    }

    // send search request to Spotify
    spotify.search(params, function (err, response) {
      if (err) {
        return console.log(err)
      }

      // set the first track in the response as the result
      track = response.tracks.items[0]

      logData('Artist: ' + track.artists[0].name + '\n' +
      'Song Name: ' + track.name + '\n' +
      'Preview: ' + track.preview_url + '\n' +
      'Album Name: ' + track.album.name + '\n\n',
      'Song')
    })
  } else {
    spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE').then(function (response) {
      track = response

      logData('Artist: ' + track.artists[0].name + '\n' +
      'Song Name: ' + track.name + '\n' +
      'Preview: ' + track.preview_url + '\n' +
      'Album Name: ' + track.album.name + '\n\n',
      'Song')
    })
  }

  // console.log('after call' + JSON.stringify(track, null, 2))
  //
  // logData('Artist: ' + track.artists[0].name + '\n' +
  //   'Song Name: ' + track.name + '\n' +
  //   'Preview: ' + track.preview_url + '\n' +
  //   'Album Name: ' + track.album.name + '\n\n',
  //   'Song')
}

function searchMovie (title = 'Mr. Nobody') {
  // log request to files
  request('https://omdbapi.com/?t=' + title + '&apikey=trilogy', function (err, response, body) {
    if (err) {
      console.log(err)
    }
    const movie = JSON.parse(body)
    let rtScore = ''
    for (const i of movie.Ratings) {
      if (i.Source === 'Rotten Tomatoes') {
        rtScore = i.Value
      }
    }

    logData(
      'Title: ' + movie.Title + '\n' +
      'Year: ' + movie.Year + '\n' +
      'IMDB Score: ' + movie.imdbRating + '\n' +
      'Rotten Tomatoes Rating: ' + rtScore + '\n' +
      'Country: ' + movie.Country + '\n' +
      'Language: ' + movie.Language + '\n' +
      'Plot: ' + movie.Plot + '\n' +
      'Actors: ' + movie.Actors + '\n\n',
      'Movie'
    )
  })
}

if (!command) {
  const data = fs.readFileSync('./random.txt', 'utf8')
  const arr = data.split(',')
  command = arr[0]
  input = arr[1]
}

switch (command) {
  case 'get-tweets':
    getTweets()
    break
  case 'spotify-this-song':
    searchSong(input)
    break
  case 'movie-this':
    searchMovie(input)
    break
  default:
    console.log('default case')
}
