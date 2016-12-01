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
    if (scope.$last){
      var elements = document.getElementsByClassName("anim-fade-row");

      var i = 0, l = elements.length;
      (function iterator() {
        var elem = angular.element(elements[i]);
        elem.addClass("anim-fade");
        if(++i<l) {
          setTimeout(iterator, 100);
        }
      })();
    }
  };
})



.factory('Connection', function($http, $cookies) {
   return {
      getProfiles : function(body){
          token = $cookies.get('devCookie');
          body.token = token;
          return $http.post(host+'/api/profiles', body);
      },
      getProfileWithUserId : function(userid){
         token = $cookies.get('devCookie');
         return $http({
                  url: host+'/api/profile/userid',
                  method: "GET",
                  params: {userid: userid, token: token}
               });
      },
      addProfile : function(body) {
          token = $cookies.get('devCookie');
          body.token = token;
          return $http.post(host+'/api/profiles/add', body);
      },
      updateProfile : function(body) {
          token = $cookies.get('devCookie');
          body.token = token;
          return $http.post(host+'/api/profiles/update', body);
      },
      getRequests : function(profileId) {
          token = $cookies.get('devCookie');
          return $http({
                   url: host+'/api/requests/',
                   method: "GET",
                   params: {profileId: profileId, token: token}
                });
      },
      login : function(loginInfo) {
         return $http.post(host + '/login', loginInfo);
      }
   }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('FinderController', function($scope, Connection) {

  var showFilters = function() {
    angular.element("#finder-filters").removeClass("anim-collapse");
    angular.element("#profile-table").toggleClass("anim-top");
    angular.element("#collapse-button").css("visibility", "hidden");
    //angular.element("#finder-filters").addClass("anim-collapse-reverse");
    //angular.element("#profile-table").addClass("anim-top-reverse");
  }

  var hideFilters = function(callback) {
    //angular.element("#finder-filters").removeClass("anim-collapse-reverse");
    //angular.element("#profile-table").removeClass("anim-top-reverse");
    angular.element("#finder-filters").addClass("anim-collapse");
    angular.element("#profile-table").addClass("anim-top");
    angular.element("#collapse-button").css("visibility", "visible");

    callback();
  }

  $scope.showFilters = showFilters;
  $scope.hideFilters = hideFilters;

   // Gets all profiles that fit the filters
   $scope.getProfiles = function() {
      angular.element(".profile-row").remove();
      hideFilters(function() {
        if (!($scope.filter == undefined)) {
           var filterstmp = {$or : ""};
           filterstmp.$or = filterInterests($scope);
           body = {}
           body.filters = filterstmp;

           Connection.getProfiles(body)
              .success(function(data) {
                 $scope.profiles = data;
              });

        } else {
           alert("Choose atleast 1 interest");
        }
      });
   }

   // Filters interests from checkboxes
   function filterInterests($scope) {
      var checkboxValues = [];

      if ($scope.filter.interest.exploration){
         checkboxValues.push({interest: "Exploration"});
      }
      if ($scope.filter.interest.trading){
         checkboxValues.push({interest: "Trading"});
      }
      if ($scope.filter.interest.combat){
         checkboxValues.push({interest: "Combat"});
      }

      return checkboxValues;
   }
})


.controller('RequestController', function($scope, Connection) {
  //Janin 5820c86ee0e56011df73e02d
  //Juhon 5825815ed01cb174b789a494
  //Servun 5825815ed01cb174b789a494
  angular.element(".request-row").remove();
   var profileId = "5825815ed01cb174b789a494";
   Connection.getRequests(profileId)
      .success(function(data) {
         $scope.requests = data;
      });
})

.controller('ProfileController', function($scope,$cookies ,Connection, jwtHelper){
   token = $cookies.get('devCookie');
   var tokenPayload = jwtHelper.decodeToken(token);
   var userid = tokenPayload._id;
   Connection.getProfileWithUserId(userid)
      .success(function(data) {
         $scope.profile = data;
         checkPlatforms(data.platform);
         checkInterests(data.interest);
      });

   $scope.updateProfile = function () {
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
         body.profile = profile;
         console.log(JSON.stringify(body));
         Connection.updateProfile(body)
            .success(function(data) {
               if(data.success) {
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

     if(nameInput.readOnly == true) {
       nameInput.readOnly = false;

       var button = angular.element(document.querySelector('#editButton'));
       button.removeClass("ion-edit");
       button.addClass("ion-checkmark-round");

       window.setTimeout(function () {
         nameInput.focus();
       }, 0);

     } else {
       nameInput.readOnly = true;

       var button = angular.element(document.querySelector('#editButton'));
       button.addClass("ion-edit");
       button.removeClass("ion-checkmark-round");
     }
   }

   function fillPlatforms() {
      var platforms = [];
      if ($scope.profile.platform.xbox){
         platforms.push("XBOX");
      }
      if ($scope.profile.platform.pc){
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
      if ($scope.profile.interest.exploration){
         interests.push("Exploration");
      }
      if ($scope.profile.interest.trading){
         interests.push("Trading");
      }
      if ($scope.profile.interest.combat){
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

.controller('LoginController', function($scope, $state, $ionicHistory, Connection, jwtHelper, $cookies) {
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

    var loginInfo = {};
    var encodedPw = sjcl.encrypt(encodePw, $scope.login.password);

    loginInfo.username = $scope.login.username;
    loginInfo.password = encodedPw;
    loginInfo.remember = $scope.login.remember;
    Connection.login(loginInfo)
       .success(function(data) {
          if (data.success) {
            token = data.token;
            $cookies.put('devCookie', token);
            $state.go('app.welcome');
          }
       });
  }

  $scope.openRegisteration = function() {
    $state.go('app.register');
  }
})

.controller('RegisterController', function($scope, Connection) {

});
