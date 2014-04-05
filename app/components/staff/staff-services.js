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