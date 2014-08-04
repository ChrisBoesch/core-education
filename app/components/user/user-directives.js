(function() {
  'use strict';

  angular.module(
    'scceUser.directives', ['scceUser.services', 'scCoreEducation.templates']
  ).

  /**
   * Directive creating a login info link for a boostrap navbar
   */
  directive('scceUserLogin', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/sccoreeducation/user/login.html',
      scope: {},
      controller: ['$scope', 'scceCurrentUserApi',
        function($scope, scceCurrentUserApi) {
          $scope.user = scceCurrentUserApi;
          scceCurrentUserApi.auth();
        }
      ]
    };
  }).

  /**
   * Directive displaying a list of user (student or staff)
   *
   * usage:
   *
   *  <scce-user-grid scce-users="studentList" scce-user-type="students">
   *  </scce-user-grid>
   *
   * Where students `scce-users` should reference a list of students
   * and `scce-user-type` is type of user ('students' or 'staff').
   *
   * Note that `scce-user-type` doesn't reference a scope attribute and
   * we be evaulated either.
   *
   */
  directive('scceUserGrid', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/sccoreeducation/user/grid.html',
      scope: {
        users: '=scceUsers',
        userType: '@scceUserType'
      }
    };
  });

})();