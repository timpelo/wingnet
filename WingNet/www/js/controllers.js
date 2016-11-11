angular.module('default.controllers', [])

.factory('Connection', function($http) {
   return {
      getProfiles : function(filters) {
         return $http.post('http://localhost:8080/profiles', filters);
      },
      addProfile : function(profile) {
         return $http.post('http://localhost:8080/profiles/add', profile);
      }
   }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('FinderController', function($scope, Connection) {
   var filters = "{}";
   Connection.getProfiles(filters)
      .success(function(data) {
         $scope.profiles = data;
      });

   console.log($scope.profiles);
   $scope.getProfiles = function() {


   }
})


.controller('RequestController', function($scope) {

});
