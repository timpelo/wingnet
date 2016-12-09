var token = undefined;
var dev = true;
var hostDev = "http://localhost:8080";
var hostRelease = "http://35.160.11.177:8080";

var encodePw = "dotamasterraceblizzardsucks";

var host = hostRelease;
if (dev == true) {
  host = hostDev;
}

angular.module('default.controllers', ['angular-jwt', 'ngCookies'])

.directive('fadeInDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last) {
      var elements = document.getElementsByClassName("anim-fade-row");

      var i = 0,
        l = elements.length;
      (function iterator() {
        var elem = angular.element(elements[i]);
        elem.addClass("anim-fade");
        if (++i < l) {
          setTimeout(iterator, 100);
        }
      })();
    }
  };
})



.factory('Connection', function($http, $cookies) {
  return {
    getProfiles: function(body) {
      token = $cookies.get('devCookie');
      body.token = token;
      return $http.post(host + '/api/profiles', body);
    },
    getProfileWithUserId: function(userid) {
      token = $cookies.get('devCookie');
      return $http({
        url: host + '/api/profile/userid',
        method: "GET",
        params: {
          userid: userid,
          token: token
        }
      });
    },
    addProfile: function(body) {
      token = $cookies.get('devCookie');
      body.token = token;
      return $http.post(host + '/api/profiles/add', body);
    },
    updateProfile: function(body) {
      token = $cookies.get('devCookie');
      body.token = token;
      return $http.post(host + '/api/profiles/update', body);
    },
    getRequests: function(profileId, inOut) {
      token = $cookies.get('devCookie');
      return $http({
        url: host + '/api/requests/',
        method: "GET",
        params: {
          profileId: profileId,
          inOut: inOut,
          token: token
        }
      });
    },
    register: function(body) {
      return $http.post(host + '/register', body);
    },
    login: function(loginInfo) {
      return $http.post(host + '/login', loginInfo);
    },
    addRequest: function(body) {
      token = $cookies.get('devCookie');
      body.token = token;
      return $http.post(host + '/api/requests/add', body);
    },
    removeRequest: function(requestId) {
      token = $cookies.get('devCookie');
      return $http({
        url: host + '/api/requests/delete',
        method: "DELETE",
        params: {
          requestId: requestId,
          token: token
        }
      });
    },
    updateRequest: function(body) {
      token = $cookies.get('devCookie');
      body.token = token;
      return $http.post(host + '/api/requests/update', body);
    }
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('FinderController', function($scope, $scope, jwtHelper, $cookies,
  $ionicModal, Connection) {
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
})



.controller('RequestController', function($scope, $cookies, jwtHelper,
  Connection, $ionicModal) {
  $scope.inOut = "IN";
  $scope.showInOptions = true;

  token = $cookies.get('devCookie');
  var tokenPayload = jwtHelper.decodeToken(token);

  var userid = tokenPayload._id;

  var updateTable = function(inOut) {
    if (inOut == "IN") {
      angular.element("#to-label").hide();
      angular.element("#from-label").show();
      $scope.showInOptions = true;
    } else {
      angular.element("#to-label").show();
      angular.element("#from-label").hide();
      $scope.showInOptions = false;
    }
  }

  Connection.getProfileWithUserId(userid)
    .success(function(result) {
      if (result.success) {
        $scope.fromId = result.data._id;
        Connection.getRequests($scope.fromId, "IN")
          .success(function(result) {
            if (result.success) {
              console.log(JSON.stringify(result));
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
    angular.element(".request-row").remove();
    $scope.inOut = inOut;
    updateTable(inOut);
    Connection.getRequests($scope.fromId, inOut)
      .success(function(result) {
        if (result.success) {
          console.log(JSON.stringify(result));
          $scope.requests = result.data;
        } else {
          alert(result.message);
        }
      });
  }

  $scope.removeRequest = function(requestId) {
    Connection.removeRequest(requestId)
      .success(function(result) {
        if (result.success) {
          console.log(JSON.stringify(result));
          alert(result.message);
        } else {
          alert(result.message);
        }
      });
  }

  $scope.updateRequest = function(request, acceptDecline) {
    if (acceptDecline == "accept") {
      request.status == "accepted";
    } else {
      request.status == "declined";
    }
    var body = {
      request: request
    };

    Connection.updateRequest(body)
      .success(function(result) {
        if (result.success) {
          console.log(JSON.stringify(result));
          alert(result.message);
        } else {
          alert(result.message);
        }
      });
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
  $scope.openModal = function() {
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
})

.controller('ProfileController', function($scope, $cookies, Connection,
  jwtHelper) {
  token = $cookies.get('devCookie');
  var tokenPayload = jwtHelper.decodeToken(token);

  var userid = tokenPayload._id;
  Connection.getProfileWithUserId(userid)
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
    if (!($scope.profile.name == undefined)) {
      var body = {};
      var profile = {};
      var platforms = fillPlatforms();
      var interests = fillInterests();

      var tokenPayload = jwtHelper.decodeToken(token);
      profile._id = $scope.profile._id;
      profile.userid = tokenPayload._id;
      profile.name = $scope.profile.name;
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
      alert("Profile name can't be empty");
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
  }
})

.controller('LoginController', function($scope, $state, $ionicHistory,
  Connection, jwtHelper, $cookies) {
  //TODO check token expiration.
  if (token != undefined) {
    var date = jwtHelper.getTokenExpirationDate(token);
    if (date > Date.now()) {
      $state.go('app.welcome');
    }
  }
  $scope.login = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    var password = $scope.login.password;
    var username = $scope.login.password;
    if (password == undefined || username == undefined || password == "" ||
      username == "") {
      alert("Empty username or password");
      return;
    }
    var loginInfo = {};
    var encodedPw = sjcl.encrypt(encodePw, $scope.login.password);

    loginInfo.username = $scope.login.username;
    loginInfo.password = encodedPw;
    loginInfo.remember = $scope.login.remember;
    Connection.login(loginInfo)
      .success(function(data) {
        if (data != null && data.success) {
          token = data.token;
          $cookies.put('devCookie', token);
          $state.go('app.welcome');
        } else {
          alert(data.message);
        }
      });
  }

  $scope.openRegisteration = function() {
    $state.go('app.register');
  }
})

.controller('RegisterController', function($scope, $cookies, $state,
  Connection) {

  $scope.register = function() {
    if ($scope.register != null && $scope.register != undefined) {
      var password1 = $scope.register.password1;
      var password2 = $scope.register.password2;
      if (password1 == password2 && password1 != undefined &&
        password1 != null) {
        var username = $scope.register.username;
        var nickname = $scope.register.nickname;
        if (username != null && username != undefined && username
          .length !=
          0) {
          if (nickname != null && nickname != undefined) {
            var body = {};
            body.username = username;
            body.nickname = nickname;
            body.password = sjcl.encrypt(encodePw, password1);
            Connection.register(body)
              .success(function(data) {
                if (data.success) {
                  $state.go('app.login');
                } else {
                  alert(data.message);
                }
              });
          } else {
            alert("Please insert nickname!");
          }
        } else {
          alert("Please insert username!");
        }
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Please fill your info");
    }
  }
});
