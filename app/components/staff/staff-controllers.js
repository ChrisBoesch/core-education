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