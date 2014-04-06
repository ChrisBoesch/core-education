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