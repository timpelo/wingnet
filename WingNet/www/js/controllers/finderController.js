angular.module('default.controllers').controller('FinderController',
  function($scope, $scope, jwtHelper, $cookies, $ionicModal, Connection) {
    angular.element("#profile-table").visibility = 'hidden';

    var showFilters = function() {
      angular.element("#finder-filters").removeClass("anim-collapse");
      angular.element("#collapse-button").css("visibility", "hidden");

      angular.element("#profile-table").fadeIn()
        .css({
          position: 'relative',
          width: '100%'
        })
        .animate({
          display: 'none',
          top: 1000
        }, 800, function() {
          //callback
        });
    }

    var hideFilters = function() {
      angular.element("#finder-filters").addClass("anim-collapse");
      angular.element("#collapse-button").css("visibility", "visible");

      angular.element("#profile-table").fadeIn()
        .css({
          top: 1000,
          position: 'absolute',
          width: '100%'
        })
        .animate({
          top: 100,
          display: 'block'
        }, 800, function() {
          //callback
        });
    }

    $scope.showFilters = showFilters;
    $scope.hideFilters = hideFilters;

    // Gets all profiles that fit the filters
    $scope.getProfiles = function() {
        token = $cookies.get('devCookie');
        angular.element(".profile-row").remove();
        if ($scope.filter != undefined && filterInterests($scope).length !=
          0) {
          var tokenPayload = jwtHelper.decodeToken(token);
          var userid = tokenPayload._id;
          var filterstmp = {
            $or: "",
            active: true,
            userid: {
              $ne: userid
            }
          };
          filterstmp.$or = filterInterests($scope);
          body = {}

          if ($scope.filter.platform != undefined && ($scope.filter.platform
              .pc || $scope.filter.platform.xbox)) {
            filterstmp.$and = filterPlatforms($scope);
          }
          body.filters = filterstmp;
          Connection.getProfiles(body)
            .success(function(result) {
              if (result.success) {
                $scope.profiles = result.data;
                hideFilters();
              } else {
                alert(data.message);
              }
            });
        } else {
          alert("Choose atleast 1 interest");
        }
      }
      // Filters interests from checkboxes
    function filterPlatforms($scope) {
      var returnable = [{
        $or: ""
      }];
      var checkboxValues = [];

      if ($scope.filter.platform.pc) {
        checkboxValues.push({
          platform: "PC"
        });
      }
      if ($scope.filter.platform.xbox) {
        checkboxValues.push({
          platform: "XBOX"
        });
      }
      returnable[0].$or = checkboxValues;
      return returnable;
    }

    // Filters interests from checkboxes
    function filterInterests($scope) {
      var checkboxValues = [];

      if ($scope.filter.interest.exploration) {
        checkboxValues.push({
          interest: "Exploration"
        });
      }
      if ($scope.filter.interest.trading) {
        checkboxValues.push({
          interest: "Trading"
        });
      }
      if ($scope.filter.interest.combat) {
        checkboxValues.push({
          interest: "Combat"
        });
      }

      if ($scope.filter.interest.cg) {
        checkboxValues.push({
          interest: "CG"
        });
      }

      return checkboxValues;
    }

    // Modal for sending requests.
    $ionicModal.fromTemplateUrl('request-modal', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(userId) {
      $scope.modal.show();
      $scope.toUserId = userId;
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
