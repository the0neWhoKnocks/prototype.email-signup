var path = require('path');
var express = require('express');
var color = require('cli-color');
var browserSync = require('browser-sync');
var opn = require('opn');
var portscanner = require('portscanner');
var flags = require('minimist')(process.argv.slice(2));
var bodyParser = require('body-parser');

var appConfig = require('./conf.app.js');
var database = require('./dev/database.js');
var endpoints = require('./dev/endpoints.js');
var utils = require('./dev/utils.js');
var indexTemplate = require('./public/views/index.js');

// =============================================================================

for(var key in flags){
  var val = flags[key];
  
  switch(key){
    case 'd' :
    case 'dev' :
      flags.dev = true;
      break;
  }
};


// =============================================================================

var OS = function(){
  var platform = process.platform;
  
  if( /^win/.test(platform) ) return 'WINDOWS';
  else if( /^darwin/.test(platform) ) return 'OSX';
  else if( /^linux/.test(platform) ) return 'LINUX';
  else return platform;
}();
var CHROME = function(){
  switch(OS){
    case 'WINDOWS': return 'chrome';
    case 'OSX': return 'google chrome';
    case 'LINUX': return 'google-chrome';
  }
}();
var app = {
  init: function(){
    this.server = express();
    // doc root is `public`
    this.server.use(express.static(appConfig.paths.PUBLIC));
    // allows for reading POST data
    this.server.use(bodyParser.json());   // to support JSON-encoded bodies
    this.server.use(bodyParser.urlencoded({ // to support URL-encoded bodies
      extended: true
    })); 
    // bind server routes
    this.setupRoutes();
    this.addServerListeners();
  },
  
  setupRoutes: function(){
    this.server.get('/', function(req, res){
      res.send(indexTemplate({
        dev: flags.dev,
        appData: {
          endpoints: endpoints
        }
      }));
    });
    
    this.server.post(endpoints.SAVE_EMAIL, function(req, res){
      var data = req.body;
      var emailHash = new Buffer(data.email).toString('base64'); // decode new Buffer(b64Encoded, 'base64').toString()
      var child = database.ref.child(`emails/${emailHash}`);
      
      // check if email already exists
      child.once('value', function(snapshot){
        // email doesn't exist
        if( !snapshot.val() ){
          child.set({
            dob: data.dob,
            gender: data.gender
          }, function(err){
            if( err ){
              res.status(500);
              res.send({ error: err });
            }
            
            res.json({ 
              msg: `'${data.email}' was added.`,
              status: 200
            });
          });
        }else{
          res.status(409);
          res.json({ 
            msg: `'${data.email}' already exists.`,
            status: 409
          });
        }
      });
    });
  },
  
  addServerListeners: function(){
    var _self = this;
    
    // Dynamically sets an open port, if the default is in use.
    portscanner.checkPortStatus(appConfig.PORT, '127.0.0.1', function(error, status){
      // Status is 'open' if currently in use or 'closed' if available
      switch(status){
        case 'open' : // port isn't available, so find one that is
          portscanner.findAPortNotInUse(appConfig.PORT, appConfig.PORT+20, '127.0.0.1', function(error, openPort){
            console.log(`${color.yellow.bold('[PORT]')} ${appConfig.PORT} in use, using ${openPort}`);

            appConfig.PORT = openPort;
            
            _self.startServer();
          });
          break;
        
        default :
          _self.startServer();
      }
    });
  },
  
  openBrowser: function(data){
    // let the user know the server is up and ready
    var msg = `${color.green.bold('[ SERVER ]')} Running at ${color.blue.bold(data.url)}`;
    if( flags.dev ) msg += `\n${color.green.bold('[ WATCHING ]')} For changes`;
    console.log(`${msg} \n`);
    
    opn(data.url, {
      app: [CHROME, '--incognito'],
      wait: false // no need to wait for app to close
    });
  },
  
  startServer: function(){
    var _self = this;
    
    this.server.listen(appConfig.PORT, function(){  
      var url = 'http://localhost:'+ appConfig.PORT +'/';
      var firstRunComplete = false;
      
      utils.compileRiotTags({
        paths: {
          bundle: false,
          config: `${appConfig.paths.ROOT}/conf.riot.js`,
          sourceTags: appConfig.paths.SOURCE_TAGS,
          compiledTags: appConfig.paths.COMPILED_TAGS
        }
      }, function(err){
        if( err ) throw err;
        
        if( !firstRunComplete ){
          browserSync.init({
            browser: CHROME,
            files: [ // watch these files
              appConfig.paths.PUBLIC
            ],
            logLevel: 'silent', // prevent snippet message
            notify: false, // don't show the BS message in the browser
            port: appConfig.PORT,
            url: url
          }, _self.openBrowser.bind(_self, {
            url: url
          }));
          
          firstRunComplete = true;
        }        
      }, flags.dev);
    });
  }
};

module.exports = app;
var args = process.argv;
if( 
  // CLI won't have parent
  !module.parent
  // First arg is node executable, second arg is the .js file, the rest are user args
  && args.length >= 3
){
  if( app[args[2]] ) app[args[2]]();
}