angular.module('default.controllers').controller('RequestController',
  function($scope, $cookies, jwtHelper, Connection, $ionicModal) {
    var selectedRequest;
    $scope.inOut = "IN";
    $scope.showInRequests = true;

    token = $cookies.get('devCookie');
    var tokenPayload = jwtHelper.decodeToken(token);

    var userid = tokenPayload._id;

    var updateTable = function(inOut) {
      if (inOut == "IN") {
        $scope.showInRequests = true;
      } else {
        $scope.showInRequests = false;
      }
    }

    Connection.getProfileWithUserId(userid)
      .success(function(result) {
        if (result.success) {
          $scope.fromId = result.data._id;
          Connection.getRequests($scope.fromId, "IN")
            .success(function(result) {
              if (result.success) {
                $scope.requests = result.data;
              } else {
                alert(result.message);
              }
            });
        } else {
          alert(result.message);
        }
      });

    $scope.getRequests = function(inOut) {
      angular.element(".profile-row").remove();
      $scope.inOut = inOut;
      updateTable(inOut);
      Connection.getRequests($scope.fromId, inOut)
        .success(function(result) {
          if (result.success) {
            $scope.requests = result.data;
          } else {
            alert(result.message);
          }
        });
    }

    $scope.removeRequest = function() {
      var requestId = selectedRequest._id;
      Connection.removeRequest(requestId)
        .success(function(result) {
          if (result.success) {
            alert(result.message);
          } else {
            alert(result.message);
          }
        });
    }

    $scope.updateRequest = function(acceptDecline) {
      var request = selectedRequest;
      if (acceptDecline == "Accepted") {
        request.status = "accepted";
      } else if (acceptDecline == "Declined") {
        request.status = "declined";
      }
      var body = {
        request: request
      };
      Connection.updateRequest(body)
        .success(function(result) {
          if (result.success) {
            alert(result.message);
          } else {
            alert(result.message);
          }
        });

      if (acceptDecline == "Accepted") {

      }
    }

    $scope.sendRequest = function(toUserId) {
      //TODO implement request send.
      $scope.closeModal();
      var body = {
        request: {
          from: $scope.fromId,
          to: toUserId,
          date: Date(),
          status: "pending",
          new: true
        }
      };

      Connection.addRequest(body)
        .success(function(result) {
          if (result.success) {
            alert("Request sent to user!");
          } else {
            alert(result.message);
          }
        });
    }

    // Modal for accepting and declining requests
    $ionicModal.fromTemplateUrl('request-action-modal', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(result) {
      selectedRequest = result;
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
  });
