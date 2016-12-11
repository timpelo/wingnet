angular.module('default.controllers').controller('ConversationController',
  function($scope, Connection, $state) {

    $scope.openMessenger = function(conversationId) {
      $state.go('app.messenger', {
        'id': conversationId
      });
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
