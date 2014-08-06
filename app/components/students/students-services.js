(function() {
  'use strict';


  angular.module('scceStudents.services', ['scCoreEducation.services']).

  factory('scceStudentsApi', ['scceApi',
    function(scceApi) {
      return {
        all: function() {
          console.log('Deprecated... Use scceUsersApi.students() instead');
          return scceApi.all('students').getList();
        }
      };
    }
  ])

  ;

})();