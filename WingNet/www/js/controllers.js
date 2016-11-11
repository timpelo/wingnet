angular.module('default.controllers', [])

.factory('Connection', function($http) {
   return {
      getProfiles : function(filters) {
         return $http.post('http://localhost:8080/profiles', filters);
      },
      addProfile : function(profile) {
         return $http.post('http://localhost:8080/profiles/add', profile);
      },
      getRequests : function(profileId) {
         return $http.get('http://localhost:8080/requests/' + profileId);
      }
   }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('FinderController', function($scope, Connection) {

   // Gets all profiles that fit the filters
   $scope.getProfiles = function() {

      if (!($scope.filter == undefined)) {
         var filters = {$or : ""};

         filters.$or = filterInterests($scope);
         Connection.getProfiles(filters)
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
   var profileId = "5825815ed01cb174b789a494";
   Connection.getRequests(profileId)
      .success(function(data) {
         $scope.requests = data;
      });
});
