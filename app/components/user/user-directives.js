(function() {
  'use strict';

  angular.module('scceUser.directives', ['scCoreEducation.templates']).

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
  }).

  /**
   * Form to create a new user.
   *
   * usage:
   *
   *  <scce-user-form
   *    scce-user-type="student"
   *    scce-user-handler="submitNewStudent"
   *   >
   *  </scce-user-form>
   *
   * Where `scce-user-type` is either 'student' or 'staff' and
   * scce-user-handler reference a function trigger when the form is submitted
   * .It take a user as argument and returning a promise that should resolve
   * a truthy value when the form is safe to reset.
   *
   * If the handler return a positive value instead of a promise, the form
   * will be reset right after submission.
   *
   */
  directive('scceUserForm', ['$q',
    function($q) {
      return {
        restrict: 'E',
        templateUrl: 'views/sccoreeducation/user/form.html',
        controller: ['$scope',
          function($scope) {
            $scope.submitNewUser = function(newUser) {
              if (!$scope.onSubmit) {
                $scope.reset();
                return;
              }

              $scope.disableForm = true;
              $q.when($scope.onSubmit(newUser)).then(function(result) {
                if (result) {
                  $scope.reset();
                }
              });
            };

            $scope.reset = function() {
              $scope.disableForm = false;
              $scope.newUser = {};
            };

            $scope.reset();
          }
        ],
        scope: {
          userType: '@scceUserType',
          onSubmit: '=scceUserHandler'
        }
      };
    }
  ])


  ;

})();