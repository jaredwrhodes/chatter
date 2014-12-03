module.exports= function ( mongoose ){
  /*
  * mongoose that comest through must already be turned on
  */

  this.mongoose = mongoose;

  this.ChatterSchema = new mongoose.Schema({
    username: String,
    chatMessage: String,
    date: Date
  });

  this.ChatterModel = mongoose.model('chatter', this.ChatterSchema);

  this.getRecent = function( callback ){
    this.ChatterModel.find(
      {}, 
      {
        _id: 0,
        __v: 0 
      },  
      { 
        limit: 50,
        sort: { 
        '_id' : -1 
        } 
      },
      function(err, chatsFound){
        if(err){
          callback({
            didFind: false
          });
        }
        else{
          callback({
            didFind: true,
            chatsFound: chatsFound
          })
        }
      }
    );
  }

  this.getUserChats = function(queryObject, callback ){
    this.ChatterModel.find(
      {
        username: 'silvio'
      }, 
      {},
      { 
        limit: 50,
        sort: { 
        '_id' : -1 
        } 
      },
      function(err, listFound){
        if(err){
          callback( 'no chats found ');
        }
        else{
          callback( listFound );
        }
      }
    );
  }

  this.addChat = function(chatToAdd, callback){
    //add date
    chatToAdd.date = new Date();
    var newChat = new this.ChatterModel(chatToAdd);
    newChat.save();
    callback();
  }

  this.removeChat = function(chatToRemove, callback){
    ChatterModel.findOneAndRemove(chatToRemove, function(err){
      if(err){
        callback(false);
      }
      else{
        callback(true);
      }
    });
  }

}

