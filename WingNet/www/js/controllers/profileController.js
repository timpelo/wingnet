angular.module('default.controllers').controller('ProfileController',
  function($scope, Connection) {
    Connection.getProfileWithUserId()
      .success(function(result) {
        if (result.success) {
          $scope.profile = result.data;
          checkPlatforms(result.data.platform);
          checkInterests(result.data.interest);
        } else {
          alert(data.message);
        }
      });

    $scope.updateProfile = function() {
      if ($scope.profile.location != undefined && $scope.profile.location !=
        "") {
        var body = {};
        var profile = {};
        var platforms = fillPlatforms();
        var interests = fillInterests();
        profile._id = $scope.profile._id;
        profile.userid = $scope.profile.userid;
        profile.name = $scope.profile.name;
        profile.location = $scope.profile.location;
        profile.interest = interests;
        profile.platform = platforms;
        profile.active = $scope.profile.active;
        body.profile = profile;
        Connection.updateProfile(body)
          .success(function(data) {
            if (data.success) {
              alert("Profile updated");
            } else {
              alert(data.message);
            }

          });
      } else {
        alert("Please give your location");
      }
    }

    $scope.toggleEdit = function() {
      var nameInput = document.getElementById("nameInput");

      if (nameInput.readOnly == true) {
        nameInput.readOnly = false;

        var button = angular.element(document.querySelector(
          '#editButton'));
        button.removeClass("ion-edit");
        button.addClass("ion-checkmark-round");

        window.setTimeout(function() {
          nameInput.focus();
        }, 0);

      } else {
        nameInput.readOnly = true;

        var button = angular.element(document.querySelector(
          '#editButton'));
        button.addClass("ion-edit");
        button.removeClass("ion-checkmark-round");
      }
    }

    function fillPlatforms() {
      var platforms = [];
      if ($scope.profile.platform.xbox) {
        platforms.push("XBOX");
      }
      if ($scope.profile.platform.pc) {
        platforms.push("PC");
      }
      return platforms;
    }

    function checkPlatforms(platforms) {
      if (platforms.indexOf("XBOX") != -1) {
        $scope.profile.platform.xbox = true;
      }
      if (platforms.indexOf("PC") != -1) {
        $scope.profile.platform.pc = true;
      }
    }

    function fillInterests() {
      var interests = [];
      if ($scope.profile.interest.exploration) {
        interests.push("Exploration");
      }
      if ($scope.profile.interest.trading) {
        interests.push("Trading");
      }
      if ($scope.profile.interest.combat) {
        interests.push("Combat");
      }
      if ($scope.profile.interest.cg) {
        interests.push("CG");
      }
      return interests;
    }

    function checkInterests(interests) {
      if (interests.indexOf("Exploration") != -1) {
        $scope.profile.interest.exploration = true;
      }
      if (interests.indexOf("Trading") != -1) {
        $scope.profile.interest.trading = true;
      }
      if (interests.indexOf("Combat") != -1) {
        $scope.profile.interest.combat = true;
      }
      if (interests.indexOf("CG") != -1) {
        $scope.profile.interest.cg = true;
      }
    }
  });
