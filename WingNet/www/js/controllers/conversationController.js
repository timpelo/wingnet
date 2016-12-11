angular.module('default.controllers').controller('ConversationController',
  function($scope, Connection, $state) {


    angular.element('#newMessage').click(function() {
      openNewMessage();
    });

    $scope.sendMessage = function() {
      angular.element("#sendMessageButton").hide();
      angular.element('#newMessage').val('');

    }

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
