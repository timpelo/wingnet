angular.module('default.controllers').controller('MessageController',
  function($scope, Connection, $state, $interval) {
    conversationId = "584d377256776e2d1bc87060";



    $scope.sendMessage = function() {
      var message = $scope.messenger.message;
      angular.element("#sendMessageButton").hide();
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

    $scope.openNewMessage = function() {
      angular.element("#sendMessageButton").show();
    }

    var interval = $interval(callAtInterval, 5000);

    function callAtInterval() {
      Connection.getMessages(conversationId)
        .success(function(result) {
          if (result.success) {
            $scope.messages = result.data;
            console.log(JSON.stringify(result.data));
          } else {
            alert(result.message);
          }
        });
    }

    $scope.$on('$destroy', function() {
      $interval.cancel(interval);
    });
  });
