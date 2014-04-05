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