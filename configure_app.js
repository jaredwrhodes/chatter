module.exports  = function(app, sessionKey){

  var bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      session = require('express-session');


  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(cookieParser()); // cookie parsing 
  app.use(session({
    secret: sessionKey,
    maxAge: 86400000,
    resave: true,
    saveUninitialized: true
  }));



}