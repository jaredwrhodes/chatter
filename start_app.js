var port = 8000;
var sessionKey = 'this is a key for sessions';
var dbDomain = 'localhost';
var dbPort = 22222;

createApp(sessionKey, dbDomain, dbPort).listen(port, function(){
  console.log('Server App is running on port ' 
    + port + ' with database url being ' + 'mongodb://'
    + dbDomain + ':' + dbPort);
});


function createApp(sessionKey, dbDomain, dbPort){
  /*
  *  NPM modules
  */
  var express = require('express'),
      mongoose = require('mongoose');

  /*
  * Create bare bones of App
  */

  var app = express();

  /*
  * configure app
  */

  require('./configure_app')(app, sessionKey);



  /*
  *Give app and mongoose to configure RESTful API
  */
  require('./restful_api/restful_api.js')(app, mongoose);
  /*
  * have home files (aka HTML/CSS/Javascript) be served
  */
  app.use(express.static(__dirname + '/views'));

  /*
  * Connect mongoose to database
  */
  mongoose.connect('mongodb://'+ dbDomain + ':' + dbPort);




  return app;

}

