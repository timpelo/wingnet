var token = "";
angular.module('default.controllers', [])



.factory('Connection', function($http) {
   return {
      getProfiles : function(body){
         return $http.post('http://localhost:8080/api/profiles', body);
      },
      addProfile : function(profile) {
         return $http.post('http://localhost:8080/api/profiles/add', profile);
      },
      getRequests : function(profileId) {
         return $http.get('http://localhost:8080/api/requests/' + profileId);
      },
      login : function(loginInfo) {
         return $http.post('http://localhost:8080/login', loginInfo);
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
         console.log(JSON.stringify(body));

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
   var profileId = "5820c86ee0e56011df73e02d";
   Connection.getRequests(profileId)
      .success(function(data) {
         $scope.requests = data;
      });
})

.controller('LoginController', function($scope, $state, $ionicHistory, Connection) {
  $scope.login = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    var loginInfo = {};
    loginInfo.username = $scope.login.username;
    loginInfo.password = $scope.login.password;
    console.log(loginInfo);
    Connection.login(loginInfo)
       .success(function(data) {
          token = data.token;
          $state.go('app.welcome');
       });
  }
});
