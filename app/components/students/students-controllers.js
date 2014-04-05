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