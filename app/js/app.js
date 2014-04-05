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