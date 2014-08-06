(function() {
  'use strict';


  angular.module('scceStaff.services', ['scCoreEducation.services']).

  factory('scceStaffApi', ['scceApi',
    function(scceApi) {
      return {
        all: function() {
          console.log('Deprecated... Use scceUsersApi.students() instead');
          return scceApi.all('staff').getList();
        },
        add: function(userId) {
          console.log(
            'Deprecated... Use scceUsersApi.makeStaff({id:userID}) instead'
          );
          return scceApi.one('staff', userId).put();
        }
      };
    }
  ])

  ;

})();