var token = undefined;
var dev = false;
var hostDev = "http://localhost:8080";
var hostRelease = "http://35.160.11.177:8080";

var host = hostRelease;
if (dev == true) {
   host = hostDev;
}
angular.module('default.controllers', ['angular-jwt'])



.factory('Connection', function($http) {
   return {
      getProfiles : function(body){
         return $http.post(host+'/api/profiles', body);
      },
      addProfile : function(body) {
         return $http.post(host+'/api/profiles/add', body);
      },
      getRequests : function(profileId) {

         return $http({
                   url: host+'/api/requests/',
                   method: "GET",
                   params: {profileId: profileId, token: token}
                });
      },
      login : function(loginInfo) {
         return $http.post(host + '/login', loginInfo);
      }
   }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('FinderController', function($scope, Connection) {

   // Gets all profiles that fit the filters
   $scope.getProfiles = function() {

      if (!($scope.filter == undefined)) {
         var filterstmp = {$or : ""};
         filterstmp.$or = filterInterests($scope);
         body = {}
         body.filters = filterstmp
         body.token = token;

         Connection.getProfiles(body)
            .success(function(data) {
               $scope.profiles = data;
            });

      } else {
         alert("Choose atleast 1 interest");
      }
   }

   // Filters interests from checkboxes
   function filterInterests($scope) {
      var checkboxValues = [];

      if ($scope.filter.interest.exploration){
         checkboxValues.push({interest: "Exploration"});
      }
      if ($scope.filter.interest.trading){
         checkboxValues.push({interest: "Trading"});
      }
      if ($scope.filter.interest.combat){
         checkboxValues.push({interest: "Combat"});
      }

      return checkboxValues;
   }
})


.controller('RequestController', function($scope, Connection) {
  //Janin 5820c86ee0e56011df73e02d
  //Juhon 5825815ed01cb174b789a494
  //Servun 5825815ed01cb174b789a494
   var profileId = "5825815ed01cb174b789a494";
   Connection.getRequests(profileId)
      .success(function(data) {
         $scope.requests = data;
      });
})

.controller('ProfileAddController', function($scope, Connection, jwtHelper){
   $scope.addProfile = function () {
      if (!($scope.profile == undefined)
            && !($scope.profile.interest == undefined)
            && !($scope.profile.platform == undefined)
            && !($scope.profile.name == undefined)) {
         var body = {};
         var profile = {};
         var platforms = fillPlatforms();
         var interests = fillInterests();
         body.token = token;

         var tokenPayload = jwtHelper.decodeToken(token);
         profile.userid = tokenPayload._id;
         profile.name = $scope.profile.name;
         profile.interest = interests;
         profile.platform = platforms;
         body.profile = profile;
         Connection.addProfile(body)
            .success(function(data) {
               if(data.success) {
                  alert("Profile created!");
               } else {
                  alert(data.message);
               }

            });
      } else {
         alert("Choose atleast 1 interest and platform");
      }
   }

   function fillPlatforms() {
      var platforms = [];

      if ($scope.profile.platform.xbox){
         platforms.push("XBOX");
      }
      if ($scope.profile.platform.pc){
         platforms.push("PC");
      }

      return platforms;
   }

   function fillInterests() {
      var interests = [];

      if ($scope.profile.interest.exploration){
         interests.push("Exploration");
      }
      if ($scope.profile.interest.trading){
         interests.push("Trading");
      }
      if ($scope.profile.interest.combat){
         interests.push("Combat");
      }

      return interests;
   }
})

.controller('LoginController', function($scope, $state, $ionicHistory, Connection, jwtHelper) {
//TODO check token expiration.
  if (token != undefined) {
     var date = jwtHelper.getTokenExpirationDate(token);
     if (date > Date.now()) {
        $state.go('app.welcome');
     }
  }
  $scope.login = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    var loginInfo = {};
    loginInfo.username = $scope.login.username;
    loginInfo.password = $scope.login.password;
    loginInfo.remember = $scope.login.remember;
    Connection.login(loginInfo)
       .success(function(data) {
          if (data.success) {
            token = data.token;
            $state.go('app.welcome');
          }
       });
  }
});
