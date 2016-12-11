angular.module('default.controllers').controller('LoginController',
  function($scope, $state, $ionicHistory, Connection, jwtHelper, $cookies) {
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
  });
