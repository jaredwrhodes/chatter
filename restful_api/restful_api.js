
/*
* Instantiate the RESTful API
*/

module.exports = function(app, mongoose){

  /*
  * Initialize the Data Base Access Objects
  * These objects talk to the database
  */

  var userDBAccess = (function(mongoose){

    var UserDBConstructor = require('../database_access/user_db_access.js');
    return new UserDBConstructor(mongoose);

  })(mongoose);

  //Initialize USER API Routes

  var chatterDBAccess = (function(mongoose){
    var ChatterDBConstructor = require('../database_access/chatter_db_access.js');
    return new ChatterDBConstructor(mongoose);
  })(mongoose);


/*
                                                                 o8o  
                                                                 `"'  
oooo  oooo   .oooo.o  .ooooo.  oooo d8b     .oooo.   oo.ooooo.  oooo  
`888  `888  d88(  "8 d88' `88b `888""8P    `P  )88b   888' `88b `888  
 888   888  `"Y88b.  888ooo888  888         .oP"888   888   888  888  
 888   888  o.  )88b 888    .o  888        d8(  888   888   888  888  
 `V88V"V8P' 8""888P' `Y8bod8P' d888b       `Y888""8o  888bod8P' o888o 
                                                      888             
                                                     o888o            
                                                                      

*/

  app.post('/api/user/login', function(req, res){

    if(!req.body.username || !req.body.password){
      res.send({
        found: false
      });
    }

    var queryObject = {
      username: req.body.username,
      password: req.body.password
    }

    userDBAccess.getUser( queryObject, function( found ){
      
      if( !found ){
        res.send({
          found: false
        });
      }
      else{

        res.send({
          found: true,
          username: found.username,
          password: found.password
        });
      }


    })

  });
  app.post('/api/user/createuser', function(req, res){
    if(!req.body.username || !req.body.password){
      res.send({
        found: false
      });
      return;
    }

    var queryObject = {
      username: req.body.username,
      password: req.body.password
    };


    userDBAccess.createUser(queryObject, function( information){
      res.send( information );
    });
  });

/*

          oooo                      .                            o8o  
          `888                    .o8                            `"'  
 .ooooo.   888 .oo.    .oooo.   .o888oo     .oooo.   oo.ooooo.  oooo  
d88' `"Y8  888P"Y88b  `P  )88b    888      `P  )88b   888' `88b `888  
888        888   888   .oP"888    888       .oP"888   888   888  888  
888   .o8  888   888  d8(  888    888 .    d8(  888   888   888  888  
`Y8bod8P' o888o o888o `Y888""8o   "888"    `Y888""8o  888bod8P' o888o 
                                                      888             
                                                     o888o            
                                                                      

*/
  app.get('/api/chatter/getrecent', function(req, res){
    chatterDBAccess.getRecent(function( result ){
      if( !result.didFind ){
        res.status(400).send( 'issue with getting recent chats' );
      }
      else{
        res.send( result.chatsFound );
      }
      
    });
  });


  app.post('/api/chatter/mychats', function(req, res){
    if( !req.body.username){
      res.status(400).send('Bad Request.Request must have username');
    }

    var queryObject = {
      username: req.body.username
    }

    chatterDBAccess.getUserChats(queryObject, function( queryFound ){
      res.send( queryFound );
    })
  });


  app.post('/api/chatter/addchat', function(req, res){
    var chatToAdd = req.body;
    if(chatToAdd.username || chatToAdd.chatMessage){
      res.send({
        chatAdded: false
      });
      return;
    }

    var chatToAdd = {
      username: req.body.username,
      chatMessage: req.body.chatMessage
    };


    chatterDBAccess.addChat(chatToAdd, function(){
      res.send({
        chatAdded: true
      });
    });


  });

  app.post('api/chatter/removechat', function(req, res){
    var chatToRemove = req.body;

    if(!chatToRemove.username || 
      !chatToRemove.chatMessage || 
      !chatToRemove._id ||
      !chatToRemove.date
      ){

      res.send({
        chatRemoved: false
      });
      return;
    }

    chatterDBAccess.removeChat(chatToRemove, function( wasDeleted ){
      res.send({
        chatDeleted: wasDeleted
      });
    })
  });


}