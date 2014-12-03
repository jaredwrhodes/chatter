(function(angular){

  var app = angular.module('myapp', ['ngRoute', 'ngCookies']);


  app.factory('$logInInfo',
    [
      '$location', 
      '$cookieStore', 
      '$http',
      function logInInfoFactory($location, $cookieStore, $http){
        return {
          loggedIn: false,
          username: null,
          password: null,
          myChats:  null,
          recentChats: null,

          authorizeAndGrab: function(){
            
            if( !this.loggedIn || !this.username || !this.password){
              $location.path('/login');
              return;
            }
            // grab recent chats
            if( !this.recentChats ){
              var self = this;
              $http.get('/api/chatter/getrecent').
                success(function(data, status, headers, config) {
                  console.log('get recent chats');
                  console.log(data);
                  self.recentChats = data;
                }).
                error(function(data, status, headers, config) {
                  console.log('error with getting recent chats');
                });

            }

            if( !this.myChats ){
              var self = this;
              $http.post('/api/chatter/mychats', { username: self.username }).
                success(function(data, status, headers, config) {
                  console.log('get my chats');
                  console.log(data);
                  self.recentChats = data;
                }).
                error(function(data, status, headers, config) {
                  console.log('error with getting my chats');
                });
            }
           

          },
          moveIfLoggedIn: function(){
            if( this.loggedIn ){
              $location.path('/home');
            }
          },
          storeInfo: function( data ){

            this.loggedIn = true;
            this.username = data.username;
            this.password = data.password;

            $cookieStore.put('chatter',{
              loggedIn: true,
              username: data.username, 
              password: data.password
            });

          },
          clear: function(){
            this.loggedIn = false;
            this.username = null;
            this.password = null;
          }
        }
  }]);

  app.run(['$location', '$cookieStore', '$logInInfo', '$rootScope', '$http',
   function($location, $cookieStore, $logInInfo, $rootScope, $http){

/*
* Check whether we have cookies or not
*/
    if( !$cookieStore.get('chatter') ){
      $cookieStore.put('chatter', {
        loggedIn: $logInInfo.loggedIn,
        username: $logInInfo.username,
        password: $logInInfo. password
      });
    }
    else{
      var cookieInfo = $cookieStore.get('chatter');
      $logInInfo.loggedIn = cookieInfo.loggedIn;
      $logInInfo.username = cookieInfo.username;
      $logInInfo.password =  cookieInfo.password
    }




  }]);

  app.directive('mynavbar', function(){
    return {
      templateUrl: 'partials/navbar.html',
      restrict: 'E',
      scope: true,
      controller: 'NavbarController'
    }
  });


  app.config(['$routeProvider', function( $routeProvider ) {

      $routeProvider.
        when('/home', {
            templateUrl: 'partials/home.html',   
            controller: 'HomeController'
          }
        ).
        when('/bio', {
            templateUrl: 'partials/bio.html',
            controller: 'BioController'
          }
        ).
        when('/mychats', {
            templateUrl: 'partials/mychats.html',
            controller: 'MyChatsController'
          }
        ).
        when('/login', {
            templateUrl: 'partials/login.html',   
            controller: 'LoginController'
            
          }
        ).
        otherwise({
            redirectTo: '/home'
          }
        );
    }
  ]);


  app.controller('NavbarController',[
    '$scope',
    '$cookieStore',
    '$logInInfo',
    '$location',
    function ($scope, $cookieStore, $logInInfo, $location){
      $scope.logout = function(){
        $cookieStore.remove('chatter');
        $logInInfo.clear();
        $location.path('/login');

      };
    }

  ]);

  app.controller('HomeController',[
      '$scope',
      '$logInInfo',
      function($scope, $logInInfo){
        $logInInfo.authorizeAndGrab();
        $scope.chats = $logInInfo.recentChats;
        // $scope.chats = [{
        //     username: 'scott',
        //     chatMessage: 'This is a chat by Scott'
        //   },{
        //     username: 'steven',
        //     chatMessage: 'This is a chat by Steven'
        //   }
        // ];
      }
    ]
  );

  app.controller('MyChatsController',[
      '$scope',
      '$logInInfo',
      function($scope, $logInInfo){
        $logInInfo.authorizeAndGrab();

        $scope.chats = $logInInfo.myChats

        $scope.sendChat = function(){
          console.log($scope.newchat);
        }
      }

    ]
  );



  app.controller('BioController',[
      '$scope',
      '$logInInfo',
      function($scope, $logInInfo){
        $logInInfo.authorizeAndGrab();

      }

    ]
  );

  app.controller('LoginController',[
      '$scope',
      '$http',
      '$location',
      '$logInInfo',
      function($scope, $http, $location, $logInInfo){
        
        $logInInfo.moveIfLoggedIn();

        $scope.logIn = function(){
          var sendObj = {
            username: $scope.username,
            password: $scope.password
          }
          $http.post('/api/user/login', sendObj).
            success(function(data, status, headers, config) {
              if( !data.found ){
                console.log('user wasn\'t found');
                return;
              }
              //log in the information
                $logInInfo.storeInfo( data );
                $location.path('/home');

            }).
            error(function(data, status, headers, config) {
              console.log('issue with loggin in');
            });
        }

        $scope.createUser = function(){
          var sendObj = {
            username: $scope.username,
            password: $scope.password
          }
          $http.post('/api/user/createuser', sendObj).
            success(function(data, status, headers, config) {
              if( !data.userAdded ){
                alert('username already in use');
              }
              else{
                alert('user was created!');
              }
              
            }).
            error(function(data, status, headers, config) {
              alert('error with connection');
            });
        }

      }

    ]
  );

})(window.angular);
