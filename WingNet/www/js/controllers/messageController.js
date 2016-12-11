angular.module('default.controllers').controller('MessageController',
  function($scope, Connection, $state, $stateParams, $interval) {
    conversationId = $stateParams.id;

    Connection.getMessages(conversationId)
      .success(function(result) {
        if (result.success) {
          $scope.messages = result.data;
          console.log(JSON.stringify(result.data));
        } else {
          alert(result.message);
        }
      });

    $scope.sendMessage = function() {
      var message = $scope.messenger.message;
      angular.element('#newMessage').val('');

      var body = {
        message: {
          conversationId: conversationId,
          message: message
        }
      };
      Connection.addMessage(body)
        .success(function(result) {
          if (result.success) {

          } else {
            alert(result.message);
          }
        });
    }

    $scope.openNewMessage = function() {}

    var interval = $interval(callAtInterval, 3000);

    function callAtInterval() {
      Connection.getMessages(conversationId)
        .success(function(result) {
          if (result.success) {
            $scope.messages = result.data;
          } else {
            alert(result.message);
          }
        });
    }

    $scope.$on('$destroy', function() {
      $interval.cancel(interval);
    });

  });
