var token = undefined;
var dev = false;
var hostDev = "http://localhost:8080";
var hostRelease = "http://35.160.11.177:8080";

var encodePw = "dotamasterraceblizzardsucks";

var host = hostRelease;
if (dev == true) {
   host = hostDev;
}
angular.module('default.controllers', ['angular-jwt'])

.directive('fadeInDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      var elements = document.getElementsByClassName("anim-slide-row");

      console.log(elements.length);

      var i = 0, l = elements.length;
      (function iterator() {
        var elem = angular.element(elements[i]);
        elem.addClass("anim-slide");
        if(++i<l) {
          setTimeout(iterator, 100);
        }
      })();
    }
  };
})



.factory('Connection', function($http) {
   return {
      getProfiles : function(body){
         return $http.post(host+'/api/profiles', body);
      },
      addProfile : function(body) {
         return $http.post(host+'/api/profiles/add', body);
      },
      getRequests : function(profileId) {

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

   // Gets all profiles that fit the filters
   $scope.getProfiles = function() {
      angular.element(".profile-row").remove();

      if (!($scope.filter == undefined)) {
         var filterstmp = {$or : ""};
         filterstmp.$or = filterInterests($scope);
         body = {}
         body.filters = filterstmp
         body.token = token;

         Connection.getProfiles(body)
            .success(function(data) {
               $scope.profiles = data;
            });

      } else {
         alert("Choose atleast 1 interest");
      }
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
   var profileId = "5825815ed01cb174b789a494";
   Connection.getRequests(profileId)
      .success(function(data) {
         $scope.requests = data;
      });
})

.controller('ProfileController', function($scope, Connection, jwtHelper){
   $scope.addProfile = function () {
      if (!($scope.profile == undefined)
            && !($scope.profile.interest == undefined)
            && !($scope.profile.platform == undefined)
            && !($scope.profile.name == undefined)) {
         var body = {};
         var profile = {};
         var platforms = fillPlatforms();
         var interests = fillInterests();
         body.token = token;

         var tokenPayload = jwtHelper.decodeToken(token);
         profile.userid = tokenPayload._id;
         profile.name = $scope.profile.name;
         profile.interest = interests;
         profile.platform = platforms;
         body.profile = profile;
         Connection.addProfile(body)
            .success(function(data) {
               if(data.success) {
                  alert("Profile created!");
               } else {
                  alert(data.message);
               }

            });
      } else {
         alert("Choose atleast 1 interest and platform");
      }
   }

   $scope.toggleEdit = function() {
     console.log("hello");
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
})

.controller('LoginController', function($scope, $state, $ionicHistory, Connection, jwtHelper) {
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

    var dePw = sjcl.decrypt(encodePw, encodedPw);
    loginInfo.username = $scope.login.username;
    loginInfo.password = encodedPw;
    loginInfo.remember = $scope.login.remember;
    Connection.login(loginInfo)
       .success(function(data) {
          if (data.success) {
            token = data.token;
            $state.go('app.welcome');
          }
       });
  }
});
