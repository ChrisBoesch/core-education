(function() {
  'use strict';

  angular.module('scCoreEducation.controllers', ['scceUser.services']).

  controller('scceNavBarCtrl', ['$scope', '$location', 'scceCurrentUserApi',
    function($scope, $location, scceCurrentUser) {
      $scope.activeUser = null;
      scceCurrentUser.get('/').then(function(info) {
        $scope.activeUser = info;
      });

      $scope.isActive = function(route) {
        return route === $location.path();
      };
    }
  ]).

  controller('scceHomeCtrl', ['$scope',
    function($scope) {
      $scope.files = {};
    }
  ])

  ;

})();