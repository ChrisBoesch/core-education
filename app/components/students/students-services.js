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