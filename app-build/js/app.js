(function() {
  'use strict';

  angular.module(
    'scCoreEducation',
    [
      'ngRoute',
      'scCoreEducation.controllers',
      'scceStudents.controllers',
      'scceStaff.controllers',
      'scceUser.directives',
      'scCoreEducation.templates'
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

  angular.module('scCoreEducation.controllers', []).

  controller('scceNavBarCtrl', ['$scope', '$location',
    function($scope, $location) {

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
  var api;

  angular.module('scceUser.services', ['scCoreEducation.services']).

  /**
   * scceCurrentUserApi - api to access user info.
   *
   * scceCurrentUserApi.get(returnUrl)  Return the user name, id and the
   * the logout url if the user logged in. Return the login url if the
   * user logged off.
   *
   * Note that it returns a promise that resole in either case. If the promise
   * fails, there was either a problem with the optional return url, or
   * there's an unexpected issue with the backend.
   *
   * TODO: handle lose of authentication.
   *
   */
  factory('scceCurrentUserApi', ['$location', '$q', 'scceApi',
    function($location, $q, scceApi) {
      api = {
        info: null,
        loading: null,

        _get: function(returnUrl) {
          var params = {
            returnUrl: returnUrl || $location.absUrl()
          };

          return scceApi.one('user').get(params).then(function(data) {
            return data;
          }).
          catch (function(resp) {
            if (resp.status === 401) {
              return resp.data;
            } else {
              return $q.reject(resp);
            }
          });
        },

        auth: function(returnUrl) {

          if (api.info) {
            return $q.when(api.info);
          }

          if (api.loading) {
            return api.loading;
          }


          api.loading = api._get(returnUrl).then(function(user) {
            api.info = user;
            return user;
          })['finally'](function() {
            api.loading = null;
          });

          return api.loading;
        },

        reset: function(loginUrl, msg) {
          var currentLoginUrl = api.info && api.info.loginUrl || null;

          loginUrl = loginUrl || currentLoginUrl;
          if (loginUrl) {
            api.info = {loginUrl: loginUrl, error: msg};
          } else {
            api.info = null;
          }
        }
      };

      return api;
    }
  ]).

  /**
   * Intercept http response error to reset scceCurrentUserApi on http
   * 401 response.
   *
   */
  factory('scceCurrentHttpInterceptor', ['$q', '$location',
    function($q, $location) {
      var httpPattern = /https?:\/\//,
        thisDomainPattern = new RegExp(
          'https?://' + $location.host().replace('.', '\\.')
        );

      function isSameDomain(url) {
        return !httpPattern.test(url) || thisDomainPattern.test(url);
      }

      return {
        responseError: function(resp) {
          if (
            resp.status === 401 &&
            isSameDomain(resp.config.url)
          ) {
            api.reset(resp.data.loginUrl, resp.data.error);
          }

          return $q.reject(resp);
        }
      };
    }
  ]).

  config(['$httpProvider',
    function($httpProvider) {
      $httpProvider.interceptors.push('scceCurrentHttpInterceptor');
    }
  ])

  ;

})();
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

  angular.module('scceStudents.controllers', [
    'scceStudents.services', 'scceUser.directives', 'scCoreEducation.templates'
  ]).

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
        }).
        catch (function(data) {
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

  angular.module('scceStaff.controllers', [
    'scceStaff.services', 'scceUser.directives', 'scCoreEducation.templates'
  ]).

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
        }).
        catch (function(data) {
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