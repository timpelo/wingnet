angular.module('default.controllers').controller('ConversationController',
  function($scope, Connection, $state) {

    $scope.openMessenger = function() {
      $state.go('app.messenger');
    }
  });
