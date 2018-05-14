require("dotenv").config();

let keys = require("./keys");
let Spotify = require("node-spotify-api");
let Twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
