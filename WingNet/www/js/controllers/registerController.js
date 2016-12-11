angular.module('default.controllers').controller('RegisterController', function(
  $scope, $cookies, $state,
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
