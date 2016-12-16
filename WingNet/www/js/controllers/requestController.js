angular.module('default.controllers').controller('RequestController',
  function($scope, Connection, $ionicModal) {
    var selectedRequest;
    var inOut = "IN";
    $scope.showInRequests = true;

    var updateModalButtons = function(acc, dec, del, callback) {
      $scope.showAcceptRequest = false;
      $scope.showDeclineRequest = false;
      $scope.showDeleteRequest = false;
      if (acc) {
        $scope.showAcceptRequest = true;
        console.log("acc");
        callback();
      }
      if (dec) {
        $scope.showDeclineRequest = true;
        console.log("dec");
        callback();
      }
      if (del) {
        $scope.showDeleteRequest = true;
        console.log("del");
        callback();
      }

    }

    Connection.getProfileWithUserId()
      .success(function(result) {
        if (result.success) {
          $scope.fromId = result.data._id;
          Connection.getRequests("IN")
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
      inOut = inOut;
      Connection.getRequests(inOut)
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
      $scope.closeModal();
      if (confirm(
          "Do you want to delete request? This also deletes all conversations with that person"
        )) {
        Connection.removeRequest(requestId)
          .success(function(result) {
            if (result.success) {
              alert(result.message);
            } else {
              alert(result.message);
            }
          });
      }
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
            if (acceptDecline == "Accepted") {
              var body = {
                conversation: {
                  participantIds: [selectedRequest.to,
                    selectedRequest.from
                  ],
                  participantNames: [selectedRequest.fromName,
                    selectedRequest.toName
                  ],
                }
              };
              Connection.addConversation(body)
                .success(function(result) {
                  if (result.success) {} else {
                    alert(result.message);
                  }
                });
            }
          } else {
            alert(result.message);
          }
        });

      $scope.closeModal();
    }

    $scope.sendRequest = function(toUserId) {
      $scope.closeModal();
      var body = {
        request: {
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
      if (inOut == "OUT" || result.status == "accepted") {
        console.log(inOut + " " + result.status);
        updateModalButtons(false, false, true, function() {
          $scope.modal.show();
        });
      } else {
        updateModalButtons(true, true, false, function() {
          $scope.modal.show();
        });
      }
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
