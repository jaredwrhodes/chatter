module.exports = function ( mongoose ){
  /*
  * mongoose that comest through must already be turned on
  */
  this.mongoose = mongoose;

  this.UserSchema = new mongoose.Schema({
    username: String,
    password: String
  });

  this.UserModel = mongoose.model('user', this.UserSchema);


  
  /*
  * Initial Verification of User
  */
  this.getUser = function( userInfo, callback ){
    this.UserModel.findOne( userInfo, function(err, found){
      if(err){
        throw err;
      }
      else{
        callback( found );
      }
      
    });
  }



  this.createUser = function( userInfo, callback){
    var self = this;

    this.getUser(userInfo, function( found ){

      if(!found){
        var saveUser = new self.UserModel(userInfo);
        saveUser.save();

        var information = {
          userAdded: true,
          infoAdded: userInfo
        };

        

      }else{
        var information = {
          userAdded: false
        };

      }

      callback( information );

    });

  }

}
