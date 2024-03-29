var token = undefined;
var dev = false;
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
    getProfileWithUserId: function() {
      token = $cookies.get('devCookie');
      return $http({
        url: host + '/api/profile/userid',
        method: "GET",
        params: {
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
    getRequests: function(inOut) {
      token = $cookies.get('devCookie');
      return $http({
        url: host + '/api/requests/',
        method: "GET",
        params: {
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
    },
    addConversation: function(body) {
      token = $cookies.get('devCookie');
      body.token = token;
      return $http.post(host + '/api/conversations/add', body);
    },
    getConversations: function() {
      token = $cookies.get('devCookie');
      return $http({
        url: host + '/api/conversations/',
        method: "GET",
        params: {
          token: token
        }
      });
    },
    getMessages: function(conversationId) {
      token = $cookies.get('devCookie');
      return $http({
        url: host + '/api/messages/',
        method: "GET",
        params: {
          conversationId: conversationId,
          token: token
        }
      });
    },
    addMessage: function(body) {
      token = $cookies.get('devCookie');
      body.token = token;
      return $http.post(host + '/api/messages/add', body);
    }
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

});
