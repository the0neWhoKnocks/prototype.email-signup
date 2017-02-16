var firebase = require('firebase');
var debounce = require('./utils.js').debounce;

// account for webpack hotswaps
if( !firebase.apps.length ){
  var config = {
    apiKey: "AIzaSyC7DI8wd_UKLnHomjuHWDdCS3YhJLHE0IQ",
    authDomain: "emailsignup-4052b.firebaseapp.com",
    databaseURL: "https://emailsignup-4052b.firebaseio.com"
  };

  firebase.initializeApp(config);
}

var logPrefix = '[ DATABASE ]';
var db = firebase.database();
var auth = firebase.auth();

module.exports = {
  ref: db.ref()
};