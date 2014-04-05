(function() {
  'use strict';

  angular.module(
    'scCoreEducation',
    [
      'ngRoute',
      'scCoreEducation.controllers',
      'scceStudents.controllers',
      'scceStaff.controllers',
    ]
  ).

  config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/students', {
          templateUrl: 'views/sccoreeducation/studentlist.html',
          controller: 'scceStudentListCtrl'
        })
        .when('/staff', {
          templateUrl: 'views/sccoreeducation/stafflist.html',
          controller: 'scceStaffListCtrl'
        })
        .otherwise({
          redirectTo: '/students'
        });
    }
  ])

  ;

})();
(function() {
  'use strict';

  angular.module('scCoreEducation.config', []).

  constant('SCCE_API_BASE', '/api/v1')

  ;
})();
(function() {
  'use strict';

  var interceptor = function(data, operation, what) {
    var resp;

    if (operation === 'getList') {
      resp = data[what] ? data[what] : [];
      resp.cursor = data.cursor ? data.cursor : null;
    } else {
      resp = data;
    }
    return resp;
  };

  angular.module('scCoreEducation.services', ['restangular', 'scCoreEducation.config']).

  service('scceApi', ['Restangular', 'SCCE_API_BASE',
    function(Restangular, SCCE_API_BASE) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(SCCE_API_BASE);
        RestangularConfigurer.addResponseInterceptor(interceptor);
      });
    }
  ])

  ;
})();
(function() {
  'use strict';

  angular.module('scCoreEducation.controllers', ['scceUser.services']).

  controller('scceNavBarCtrl', ['$scope', '$location', 'scceCurrentUserApi',
    function($scope, $location, scceCurrentUser) {
      $scope.activeUser = null;
      scceCurrentUser.get().then(function(info) {
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
(function() {
  'use strict';

  angular.module('scceUser.services', ['scCoreEducation.services']).

  factory('scceCurrentUserApi', ['$location', '$q', 'scceApi',
    function($location, $q, scceApi) {
      return {
        get: function(returnUrl) {
          var params = {
            returnUrl: returnUrl || $location.absUrl()
          };

          return scceApi.one('user').get(params).then(function(data) {
            return data;
          }).catch(function(resp) {
            if (resp.status === 401) {
              return resp.data;
            } else {
              return $q.reject(resp);
            }
          });
        }
      };
    }
  ]);

})();
(function() {
  'use strict';

  angular.module('scceUser.directives', []).

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
        controller: function($scope) {
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
        },
        scope: {
          userType: '@scceUserType',
          onSubmit: '=scceUserHandler'
        }
      };
    }
  ])


  ;

})();
(function() {
  'use strict';


  angular.module('scceStudents.services', ['scCoreEducation.services']).

  factory('scceStudentsApi', ['scceApi',
    function(scceApi) {
      return {
        all: function() {
          return scceApi.all('students').getList();
        },
        add: function(data) {
          return scceApi.all('students').post(data);
        },
        edit: function(id, data) {
          scceApi.one('students', id).customPUT(data);
        }
      };
    }
  ])

  ;

})();
(function() {
  'use strict';

  angular.module('scceStudents.controllers', ['scceStudents.services', 'scceUser.directives']).

  controller('scceStudentListCtrl', ['$scope', 'scceStudentsApi',
    function($scope, scceStudentsApi) {
      $scope.students = null;

      $scope.submitNewStudent = function(newStudent) {
        scceStudentsApi.add(newStudent).then(function(student) {
          $scope.students.push(student);
          return 'done';
        });
      };

      $scope.listStudent = function() {
        return scceStudentsApi.all().then(function(list) {
          $scope.students = list;
          return list;
        }).catch(function(data) {
          if (data.status === 401) {
            $scope.error = 'You need to be logged in to view the list.';
          } else if (data.status === 403) {
            $scope.error = 'Only admins or staff can list students.';
          } else {
            $scope.error = 'Unexpected error.';
          }
        });
      };

      $scope.listStudent();
    }
  ])

  ;

})();
(function() {
  'use strict';


  angular.module('scceStaff.services', ['scCoreEducation.services']).

  factory('scceStaffApi', ['scceApi',
    function(scceApi) {
      return {
        all: function() {
          return scceApi.all('staff').getList();
        },
        add: function(data) {
          return scceApi.all('staff').post(data);
        },
        edit: function(id, data) {
          scceApi.one('staff', id).customPUT(data);
        }
      };
    }
  ])

  ;

})();
(function() {
  'use strict';

  angular.module('scceStaff.controllers', ['scceStaff.services', 'scceUser.directives']).

  controller('scceStaffListCtrl', ['$scope', 'scceStaffApi',
    function($scope, scceStaffApi) {
      $scope.staff = null;

      $scope.submitNewStaff = function(newStaff) {
        return scceStaffApi.add(newStaff).then(function(staff) {
          $scope.staff.push(staff);
          return 'done';
        });
      };

      $scope.listStaff = function() {
        return scceStaffApi.all().then(function(list) {
          $scope.staff = list;
          return list;
        }).catch(function(data) {
          if (data.status === 401) {
            $scope.error = 'You need to be logged in to view the list.';
          } else if (data.status === 403) {
            $scope.error = 'Only admins or staff can list staff.';
          } else {
            $scope.error = 'Unexpected error.';
          }
        });
      };

      $scope.listStaff();
    }
  ])

  ;

})();