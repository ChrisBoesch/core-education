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
        .when('/', {
          templateUrl: 'views/sccoreeducation/home.html',
          controller: 'scceHomeCtrl'
        })
        .when('/students', {
          templateUrl: 'views/sccoreeducation/studentlist.html',
          controller: 'scceStudentListCtrl'
        })
        .when('/staff', {
          templateUrl: 'views/sccoreeducation/stafflist.html',
          controller: 'scceStaffListCtrl'
        })
        .otherwise({
          redirectTo: '/'
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

  angular.module('scceStudents.controllers', ['scceStudents.services']).

  controller('scceStudentListCtrl', ['$scope', 'scceStudentsApi',
    function($scope, scceStudentsApi) {
      $scope.students = null;
      $scope.addingStudent = false;

      $scope.submitNewStudent = function(newStudent) {
        $scope.addingStudent = true;
        scceStudentsApi.add(newStudent).then(function(student) {
          $scope.newStudent = {};
          $scope.students.push(student);
          return student;
        })['finally'](function() {
          $scope.addingStudent = false;
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

  angular.module('scceStaff.controllers', ['scceStaff.services']).

  controller('scceStaffListCtrl', ['$scope', 'scceStaffApi',
    function($scope, scceStaffApi) {
      $scope.staff = null;
      $scope.addingStaff = false;

      $scope.submitNewStaff = function(newStaff) {
        $scope.addingStaff = true;
        scceStaffApi.add(newStaff).then(function(staff) {
          $scope.newStaff = {};
          $scope.staff.push(staff);
          return staff;
        })['finally'](function() {
          $scope.addingStaff = false;
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