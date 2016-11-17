angular.module('default.controllers', [])

.factory('Connection', function($http) {
   return {
      getProfiles : function(body, callback) {
         $.ajax({
            url:'http://localhost:8080/api/profiles',
            type:"post",
            data: JSON.stringify(body),
            headers:{"Content-Type":"application/json"},
            dataType:"json",
            success: function(res) {
                console.log("Response");
                callback(res);
            }
         });

         //return $http.post('http://localhost:8080/api/profiles', JSON.stringify(body));
      },
      addProfile : function(profile) {
         return $http.post('http://localhost:8080/api/profiles/add', profile);
      },
      getRequests : function(profileId) {
         return $http.get('http://localhost:8080/api/requests/' + profileId);
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
         body.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODJkNmEwZTJhZDUwNDE1OGNiYzFmMjkiLCJ1c2VybmFtZSI6Inh5eiIsInBhc3N3b3JkIjoieHl6IiwiaWF0IjoxNDc5Mzc3NTU1LCJleHAiOjE0Nzk0NjM5NTV9.Jww03Vts_x9QLuD7N-b1PX-uqeF5fLU2fkhbQBaur_Q";
         console.log(JSON.stringify(body));

         Connection.getProfiles(body, function (res){
            $scope.profiles = res;
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

.controller('LoginController', function($scope, $state, $ionicHistory) {
  $scope.login = function() {
    //TODO tarvitaan login handle tähän.
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.welcome');
  }
});
