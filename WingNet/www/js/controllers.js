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

   $scope.getProfiles = function() {
      var filter = {};


      Connection.getProfiles(filters)
         .success(function(data) {
            $scope.profiles = data;
         });
   }
})


.controller('RequestController', function($scope) {

});
