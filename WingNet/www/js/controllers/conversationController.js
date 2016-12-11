angular.module('default.controllers').controller('ConversationController',
  function($scope, Connection, $state) {

    $scope.openMessenger = function() {
      $state.go('app.messenger');
    }

    Connection.getConversations()
      .success(function(result) {
        if (result.success) {
          $scope.conversations = result.data;
        } else {
          alert(result.message);
        }
      });
  });
