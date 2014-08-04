(function() {
  'use strict';


  angular.module('scceStaff.services', ['scCoreEducation.services']).

  factory('scceStaffApi', ['scceApi',
    function(scceApi) {
      return {
        all: function() {
          return scceApi.all('staff').getList();
        },
        add: function(userId) {
          return scceApi.one('staff', userId).put();
        }
      };
    }
  ])

  ;

})();